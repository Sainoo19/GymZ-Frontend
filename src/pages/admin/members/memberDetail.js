import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import reformDateTime from "../../../components/utils/reformDateTime";
import Cookies from 'js-cookie';

const UpdateMemberForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [member, setMember] = useState(null);
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');

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

        const fetchMember = async () => {
            try {
                const response = await axios.get(`${URL_API}members/${id}`, {
                    withCredentials: true
                });
                const memberData = response.data.data;

                // Managers can only view and manage members within their branch
                if (userRole === 'manager' && memberData.branchID !== userBranchId) {
                    navigate('/unauthorized');
                    return;
                }

                // PTs can only view and manage their assigned members
                if (userRole === 'PT' && memberData.employeeID !== userId) {
                    navigate('/unauthorized');
                    return;
                }

                setMember(memberData);
                setSelectedBranchId(memberData.branchID);
            } catch (error) {
                console.error("Error fetching member:", error);
            }
        };

        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${URL_API}branches/all/nopagination`, {
                    withCredentials: true
                });
                setBranches(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${URL_API}users/all/nopagination`, {
                    withCredentials: true
                });
                setUsers(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách người dùng:", error);
            }
        };

        fetchMember();
        fetchBranches();
        fetchUsers();
    }, [id, userRole, userBranchId, userId, navigate]);

    // Fetch employees (PTs) when branch changes
    useEffect(() => {
        const fetchEmployees = async () => {
            if (!selectedBranchId) return;

            try {
                const response = await axios.get(`${URL_API}employees/all/nopagination`, {
                    params: {
                        role: 'PT',
                        branch_id: selectedBranchId
                    },
                    withCredentials: true
                });

                // Access the employees array properly from the nested structure
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

        fetchEmployees();
    }, [selectedBranchId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMember({
            ...member,
            [name]: value
        });
    };

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        setSelectedBranchId(branchId);
        setMember(prev => ({
            ...prev,
            branchID: branchId,
            employeeID: userRole === 'PT' ? userId : '' // Reset employeeID unless user is a PT
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedMember = {
                ...member,
                updatedAt: new Date().toISOString()
            };
            await axios.put(
                `${URL_API}members/update/${id}`,
                updatedMember,
                { withCredentials: true }
            );
            alert("Cập nhật hội viên thành công!");
            navigate("/admin/members");
        } catch (error) {
            console.error("Error updating member:", error);
            alert(error.response?.data?.message || "Lỗi khi cập nhật hội viên");
        }
    };

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cập Nhật Hội Viên</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                        type="text"
                        value={member._id}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Người Dùng</label>
                    <select
                        name="userID"
                        value={member.userID}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    >
                        <option value="">Chọn người dùng</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user.name} - {user.email} ({user._id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại Thành Viên</label>
                    <select
                        name="type"
                        value={member.type}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    >
                        <option value="BASIC">BASIC</option>
                        <option value="SILVER">SILVER</option>
                        <option value="GOLD">GOLD</option>
                        <option value="PLATINUM">PLATINUM</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Bắt Đầu</label>
                    <input
                        type="date"
                        name="validFrom"
                        value={member.validFrom ? new Date(member.validFrom).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Kết Thúc</label>
                    <input
                        type="date"
                        name="validUntil"
                        value={member.validUntil ? new Date(member.validUntil).toISOString().split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        required
                    />
                </div>

                {/* Chi Nhánh - Disabled for managers and PTs who can only use their own branch */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Chi Nhánh</label>
                    <select
                        name="branchID"
                        value={member.branchID}
                        onChange={handleBranchChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        disabled={userRole === 'manager' || userRole === 'PT'}
                        required
                    >
                        <option value="">Chọn chi nhánh</option>
                        {branches.map(branch => (
                            <option key={branch._id} value={branch._id}>
                                {branch.name} ({branch._id})
                            </option>
                        ))}
                    </select>
                    {(userRole === 'manager' || userRole === 'PT') && (
                        <p className="text-sm text-gray-500 mt-1">
                            Bạn chỉ có thể cập nhật hội viên trong chi nhánh của mình.
                        </p>
                    )}
                </div>

                {/* Nhân Viên PT - Disabled for PTs who can only use themselves */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Huấn Luyện Viên (PT)</label>
                    <select
                        name="employeeID"
                        value={member.employeeID || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        disabled={userRole === 'PT'}
                    >
                        <option value="">Không chọn PT</option>
                        {employees.map(employee => (
                            <option key={employee._id} value={employee._id}>
                                {employee.name} ({employee._id})
                            </option>
                        ))}
                    </select>
                    {userRole === 'PT' && (
                        <p className="text-sm text-gray-500 mt-1">
                            Hội viên đã được gán cho bạn làm PT.
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                    <input
                        type="text"
                        value={reformDateTime(member.createdAt)}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                    <input
                        type="text"
                        value={reformDateTime(member.updatedAt)}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Hội Viên
                    </button>

                    <button
                        type="button"
                        className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                        onClick={() => navigate("/admin/members")}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMemberForm;