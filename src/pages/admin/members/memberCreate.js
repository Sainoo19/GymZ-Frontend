import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const CreateMember = () => {
    const navigate = useNavigate();
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState('');

    const [member, setMember] = useState({
        userID: '',
        type: 'BASIC',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Default to 1 month
        branchID: '',
        employeeID: '',
    });

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

        // Set initial values based on user role
        if (userRole === 'manager' && userBranchId) {
            setMember(prev => ({
                ...prev,
                branchID: userBranchId,
            }));
            setSelectedBranchId(userBranchId);
        } else if (userRole === 'PT' && userBranchId) {
            setMember(prev => ({
                ...prev,
                branchID: userBranchId,
                employeeID: userId,
            }));
            setSelectedBranchId(userBranchId);
        }

        // Fetch branches
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

        // Fetch users for dropdown
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

        fetchBranches();
        fetchUsers();
    }, [userRole, navigate, userBranchId, userId]);

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

        // When branch changes, update the selectedBranchId
        if (name === 'branchID') {
            setSelectedBranchId(value);
            // Reset employeeID when branch changes
            if (userRole !== 'PT') {
                setMember(prev => ({
                    ...prev,
                    employeeID: ''
                }));
            }
        }
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
            // Create new member
            const response = await axios.post(
                `${URL_API}members/create`,
                member,
                { withCredentials: true }
            );

            alert("Tạo hội viên thành công!");
            navigate("/admin/members");
        } catch (error) {
            console.error("Lỗi khi tạo hội viên:", error);
            alert(error.response?.data?.message || "Lỗi khi tạo hội viên");
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Thêm Hội Viên Mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                        value={member.validFrom}
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
                        value={member.validUntil}
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
                            Bạn chỉ có thể thêm hội viên vào chi nhánh của mình.
                        </p>
                    )}
                </div>

                {/* Nhân Viên PT - Disabled for PTs who can only use themselves */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Huấn Luyện Viên (PT)</label>
                    <select
                        name="employeeID"
                        value={member.employeeID}
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
                            Hội viên sẽ được gán cho bạn làm PT.
                        </p>
                    )}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="submit"
                        className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tạo Hội Viên
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

export default CreateMember;