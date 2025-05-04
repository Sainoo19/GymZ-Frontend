import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const TrainSessionCreate = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState([]);
    const [employees, setEmployees] = useState([]); // Still need this to display PT info
    const [selectedPT, setSelectedPT] = useState(null); // Store the selected PT info for display
    const [loading, setLoading] = useState(false);

    const [trainSession, setTrainSession] = useState({
        userID: '',
        employeeID: '',
        dayOfWeek: '',
        date: new Date().toISOString().split('T')[0],
        startHour: '08:00', // Default start time 8:00 AM
        endHour: '09:00',   // Default end time 9:00 AM (auto-calculated)
        status: 'scheduled'
    });

    // Status options
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
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Redirect unauthorized users
        if (userRole === 'staff') {
            navigate('/unauthorized');
            return;
        }

        // Fetch members based on user role
        const fetchMembers = async () => {
            setLoading(true);
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

                const response = await axios.get(`${URL_API}members/all/nopagination`, {
                    params,
                    withCredentials: true
                });

                if (response.data.status === 'success' && response.data.data) {
                    // Filter members to only include those with an assigned PT (non-empty employeeID)
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
            } finally {
                setLoading(false);
            }
        };

        // Fetch all employees (PTs) for displaying PT info
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${URL_API}employees/all/nopagination`, {
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

        fetchMembers();
        fetchEmployees();
    }, [userRole, navigate, userBranchId, userId]);

    // Handle date selection - automatically calculate dayOfWeek
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        const dateObj = new Date(selectedDate);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeek = daysOfWeek[dateObj.getDay()];

        setTrainSession(prev => ({
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

        setTrainSession(prev => ({
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
            setTrainSession({
                ...trainSession,
                [name]: value
            });
        }
    };

    // When a member is selected, automatically set the PT
    const handleMemberChange = (e) => {
        const memberId = e.target.value;
        const selectedMember = members.find(member => member.userID === memberId);

        if (selectedMember && selectedMember.employeeID) {
            const ptId = selectedMember.employeeID;
            const ptInfo = employees.find(emp => emp._id === ptId);
            setSelectedPT(ptInfo);

            setTrainSession(prev => ({
                ...prev,
                userID: memberId,
                employeeID: ptId
            }));
        } else {
            setSelectedPT(null);
            setTrainSession(prev => ({
                ...prev,
                userID: memberId,
                employeeID: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!trainSession.employeeID) {
            alert("Hội viên này không có PT được gán. Không thể tạo lịch tập.");
            return;
        }

        if (!trainSession.dayOfWeek) {
            alert("Vui lòng chọn ngày tập.");
            return;
        }

        try {
            // Create new training session
            const response = await axios.post(
                `${URL_API}trainingSession/create`,
                trainSession,
                { withCredentials: true }
            );

            alert("Tạo lịch tập thành công!");
            navigate("/admin/train-sessions");
        } catch (error) {
            console.error("Lỗi khi tạo lịch tập:", error);
            console.log("Request data:", trainSession);
            if (error.response) {
                console.log("Response data:", error.response.data);
                console.log("Response status:", error.response.status);
                console.log("Response headers:", error.response.headers);
            }
            alert(error.response?.data?.message || "Lỗi khi tạo lịch tập");
        }
    };

    // Helper function to get user info from a member
    const getUserInfo = (memberId) => {
        const member = members.find(member => member.userID === memberId);
        return member ? `${member.userID} (${member.type})` : memberId;
    };

    // Helper function to display the day of week from the selected date
    const getSelectedDayOfWeek = () => {
        if (!trainSession.date) return null;

        const vietnameseDays = {
            'Sunday': 'Chủ nhật',
            'Monday': 'Thứ hai',
            'Tuesday': 'Thứ ba',
            'Wednesday': 'Thứ tư',
            'Thursday': 'Thứ năm',
            'Friday': 'Thứ sáu',
            'Saturday': 'Thứ bảy'
        };

        return vietnameseDays[trainSession.dayOfWeek] || trainSession.dayOfWeek;
    };

    if (loading) {
        return <div className="max-w-2xl mx-auto p-4">Đang tải...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm Lịch Tập Mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hội Viên</label>
                    <select
                        name="userID"
                        value={trainSession.userID}
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
                    {members.length === 0 && (
                        <p className="text-sm text-red-500 mt-1">
                            Không tìm thấy hội viên nào có huấn luyện viên. Vui lòng gán PT cho hội viên trước.
                        </p>
                    )}
                </div>

                {/* Display selected PT information - Read only */}
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
                                {trainSession.userID ? "PT không tìm thấy" : "Vui lòng chọn hội viên trước"}
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
                        value={trainSession.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    />
                    {trainSession.dayOfWeek && (
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
                            value={trainSession.startHour}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Giờ kết thúc</label>
                        <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
                            {trainSession.endHour}
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
                        value={trainSession.status}
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

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tạo Lịch Tập
                    </button>

                    <button
                        type="button"
                        className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                        onClick={() => navigate("/admin/train-sessions")}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TrainSessionCreate;