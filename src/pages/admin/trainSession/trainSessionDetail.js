import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import reformDateTime from "../../../components/utils/reformDateTime";
import Cookies from 'js-cookie';

const TrainSessionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [members, setMembers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedPT, setSelectedPT] = useState(null);

    // Status options for dropdown
    const statusOptions = [
        { value: 'scheduled', label: 'Đã lên lịch' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

    // Get user info from token
    const token = Cookies.get('accessToken');
    const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;
    const userBranchId = token ? JSON.parse(atob(token.split('.')[1])).branch_id : null;
    const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

    useEffect(() => {
        // Redirect unauthorized users
        if (userRole === 'staff') {
            navigate('/unauthorized');
            return;
        }

        const fetchSession = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/trainingSession/${id}`, {
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const sessionData = response.data.data;

                    // Format the date for the form
                    if (sessionData.date) {
                        sessionData.date = new Date(sessionData.date).toISOString().split('T')[0];
                    }

                    setSession(sessionData);

                    // PTs can only edit their own sessions
                    if (userRole === 'PT' && sessionData.employeeID !== userId) {
                        navigate('/unauthorized');
                        return;
                    }
                } else {
                    console.error("Failed to fetch session data");
                }
            } catch (error) {
                console.error("Error fetching training session:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchMembers = async () => {
            try {
                let params = {};

                // Apply role-based filters for fetching members
                if (userRole === 'manager') {
                    // Managers can only see members from their branch
                    params.branchId = userBranchId;
                } else if (userRole === 'PT') {
                    // PTs can only see members assigned to them
                    params.employeeID = userId;
                }

                const response = await axios.get("http://localhost:3000/members/all/nopagination", {
                    params,
                    withCredentials: true
                });

                if (response.data.status === 'success' && response.data.data) {
                    // Filter members to only include those with an assigned PT
                    const membersWithPT = response.data.data.filter(member =>
                        member.employeeID && member.employeeID.trim() !== ''
                    );
                    setMembers(membersWithPT);
                } else {
                    setMembers([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách hội viên:", error);
                setMembers([]);
            }
        };

        // Fetch all employees (PTs)
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/employees/all/nopagination`, {
                    params: { role: 'PT' },
                    withCredentials: true
                });

                if (response.data.status === 'success' && response.data.data.employees) {
                    setEmployees(response.data.data.employees);
                } else {
                    setEmployees([]);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách PT:", error);
                setEmployees([]);
            }
        };

        fetchSession();
        fetchMembers();
        fetchEmployees();
    }, [id, userRole, userBranchId, userId, navigate]);

    // When session data is loaded, find and set the selected member and PT
    useEffect(() => {
        if (session && members.length > 0 && employees.length > 0) {
            // Find member by userID
            const member = members.find(m => m.userID === session.userID);
            setSelectedMember(member || null);

            // Find PT by employeeID
            const pt = employees.find(e => e._id === session.employeeID);
            setSelectedPT(pt || null);
        }
    }, [session, members, employees]);

    // Handle date selection - automatically calculate dayOfWeek
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const dateObj = new Date(selectedDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[dateObj.getDay()];

        setSession(prev => ({
            ...prev,
            date: selectedDate,
            dayOfWeek: dayOfWeek
        }));
    };

    // Handle startHour selection - automatically calculate endHour
    const handleTimeChange = (e) => {
        const { value } = e.target;
        const [hours, minutes] = value.split(':').map(Number);

        // Calculate end time (start time + 1 hour)
        let endHours = hours + 1;
        if (endHours > 23) endHours = 23; // Cap at 23:00

        const endHour = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        setSession(prev => ({
            ...prev,
            startHour: value,
            endHour: endHour
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'date') {
            handleDateChange(e);
        } else if (name === 'startHour') {
            handleTimeChange(e);
        } else {
            setSession(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // When a member is selected, automatically set the PT
    const handleMemberChange = (e) => {
        const memberId = e.target.value;
        const member = members.find(m => m.userID === memberId);

        if (member && member.employeeID) {
            const ptId = member.employeeID;
            const pt = employees.find(emp => emp._id === ptId);

            setSelectedMember(member);
            setSelectedPT(pt);

            setSession(prev => ({
                ...prev,
                userID: memberId,
                employeeID: ptId
            }));
        } else {
            setSelectedMember(member);
            setSelectedPT(null);

            setSession(prev => ({
                ...prev,
                userID: memberId,
                employeeID: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session.employeeID) {
            alert("Hội viên này không có PT được gán. Không thể cập nhật lịch tập.");
            return;
        }

        if (!session.dayOfWeek) {
            alert("Vui lòng chọn ngày tập.");
            return;
        }

        try {
            // Update training session
            const updatedSession = {
                ...session,
                updatedAt: new Date().toISOString()
            };

            await axios.put(
                `http://localhost:3000/trainingSession/update/${id}`,
                updatedSession,
                { withCredentials: true }
            );

            alert("Cập nhật lịch tập thành công!");
            navigate("admin/train-sessions");
        } catch (error) {
            console.error("Lỗi khi cập nhật lịch tập:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật lịch tập");
        }
    };

    // Helper function to get user info from a member
    const getUserInfo = (memberId) => {
        const member = members.find(m => m.userID === memberId);
        return member ? `${member.userID}` : memberId;
    };

    // Helper function to display the day of week in Vietnamese
    const getSelectedDayOfWeek = () => {
        if (!session?.dayOfWeek) return null;

        const vietnameseDays = {
            'Sunday': 'Chủ nhật',
            'Monday': 'Thứ hai',
            'Tuesday': 'Thứ ba',
            'Wednesday': 'Thứ tư',
            'Thursday': 'Thứ năm',
            'Friday': 'Thứ sáu',
            'Saturday': 'Thứ bảy'
        };

        return vietnameseDays[session.dayOfWeek] || session.dayOfWeek;
    };

    if (loading) {
        return <div className="max-w-2xl mx-auto p-4">Đang tải...</div>;
    }

    if (!session) {
        return <div className="max-w-2xl mx-auto p-4">Không tìm thấy phiên tập luyện</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cập Nhật Phiên Tập Luyện</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                        type="text"
                        value={session._id}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Hội Viên</label>
                    {userRole === 'PT' ? (
                        // PT can't change the member
                        <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                            {selectedMember ? getUserInfo(session.userID) : session.userID}
                        </div>
                    ) : (
                        // Admin and Manager can change the member
                        <select
                            name="userID"
                            value={session.userID}
                            onChange={handleMemberChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            required
                        >
                            <option value="">Chọn hội viên</option>
                            {members.map(member => (
                                <option key={member._id} value={member.userID}>
                                    {getUserInfo(member.userID)} - PT: {member.employeeID}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Display PT information */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Huấn Luyện Viên (PT)</label>
                    <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                        {selectedPT ? (
                            <div className="flex items-center">
                                <div className="font-medium">
                                    {selectedPT.name} ({selectedPT._id})
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">
                                {session.employeeID || "Không có PT được gán"}
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        PT được gán tự động dựa trên hội viên đã chọn.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày tập</label>
                    <input
                        type="date"
                        name="date"
                        value={session.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    />
                    {session.dayOfWeek && (
                        <p className="text-sm text-blue-600 mt-1">
                            Ngày trong tuần: <span className="font-medium">{getSelectedDayOfWeek()}</span>
                        </p>
                    )}
                </div>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Giờ bắt đầu</label>
                        <input
                            type="time"
                            name="startHour"
                            value={session.startHour}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                        <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                            {session.endHour}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Tự động tính (bắt đầu + 1 giờ)
                        </p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select
                        name="status"
                        value={session.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                    <input
                        type="text"
                        value={reformDateTime(session.createdAt)}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                    <input
                        type="text"
                        value={reformDateTime(session.updatedAt)}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Phiên Tập
                    </button>

                    <button
                        type="button"
                        className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                        onClick={() => navigate("admin/train-sessions")}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainSessionDetail;