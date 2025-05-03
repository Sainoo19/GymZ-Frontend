import Table from '../../../components/admin/Table';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteEmployeeModal from './employeesDelete';
import { FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/admin/layout/Pagination';
import { jwtDecode } from 'jwt-decode';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import reformDateTime from '../../../components/utils/reformDateTime';

const Employee = () => {
    const [columns] = useState([
        { field: '_id', label: 'ID' },
        { field: 'avatar', label: 'AVATAR' },
        { field: 'email', label: 'EMAIL' },
        { field: 'phone', label: 'PHONE' },
        { field: 'name', label: 'NAME' },
        { field: 'branch_id', label: 'ID BRANCH' },
        { field: 'role', label: 'ROLE' },
        { field: 'salary', label: 'SALARY' },
    ]);

    const [branches, setBranches] = useState([]);
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        branchId: '',
        role: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    const [exportFilters, setExportFilters] = useState({
        branchId: '',
        role: '',
        startDate: '',
        endDate: ''
    });

    // Lọc bỏ các giá trị rỗng trong object filters
    const cleanFilters = (filters) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
    };

    const toggleExportModal = () => {
        setIsExportModalOpen(!isExportModalOpen);
    };

    const handleExportFilterChange = (e) => {
        setExportFilters({
            ...exportFilters,
            [e.target.name]: e.target.value
        });
    };

    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${URL_API}employees/profile`, {
                    withCredentials: true // Ensure cookies are sent with the request
                });
                const role = response.data.data.role;
                setUserRole(role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                setUserRole(null);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Áp dụng cleanFilters trước khi gửi request
                const cleanedFilters = cleanFilters(filters);

                const response = await axios.get(`${URL_API}employees/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...cleanedFilters
                    },
                    withCredentials: true // Ensure cookies are sent with the request
                });

                if (response.data && response.data.data && Array.isArray(response.data.data.employees)) {
                    const formattedData = response.data.data.employees.map((employee) => ({
                        ...employee,
                        salary: employee.salary.toLocaleString(),
                    }));
                    setData(formattedData);
                    setTotalPages(response.data.metadata.totalPages);
                } else {
                    console.error('API response does not contain employees:', response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${URL_API}branches/all/nopagination`);
                setBranches(response.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            }
        };

        fetchBranches();
        fetchData();
    }, [currentPage, search, filters]);

    const handleEdit = (id) => {
        if (userRole === 'admin' || userRole === 'manager') {
            navigate(`/admin/employees/${id}`);
        }
    };

    const handleDelete = async (id) => {
        if (userRole === 'admin' || userRole === 'manager') {
            try {
                await axios.delete(`${URL_API}employees/delete/${id}`, {
                    withCredentials: true // Ensure cookies are sent with the request
                });
                setData(data.filter(employee => employee._id !== id));
                setIsDeleteModalOpen(false);
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const openDeleteModal = (id) => {
        if (userRole === 'admin' || userRole === 'manager') {
            setSelectedEmployeeId(id);
            setIsDeleteModalOpen(true);
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedEmployeeId(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const clearFilters = () => {
        setFilters({
            branchId: "",
            role: "",
            startDate: "",
            endDate: "",
            search: "",
        });
        setTimeout(() => {
            applyFilters();
        }, 0);
    };

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const formattedData = data.map((item) => ({
        ...item,
        avatar: (
            <img
                src={item.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
            />
        )
    }));

    const handleExport = async () => {
        try {
            // Áp dụng cleanFilters trước khi gửi request
            const cleanedExportFilters = cleanFilters(exportFilters);

            const response = await axios.get(`${URL_API}employees/all`, {
                params: {
                    ...cleanedExportFilters,
                    limit: 1000 // Giới hạn dữ liệu xuất
                },
                withCredentials: true
            });

            if (response.data.status === 'success') {
                const employees = response.data.data.employees.map(employee => ({
                    'EMPLOYEE ID': employee._id,
                    'NAME': employee.name,
                    'ROLE': employee.role,
                    'BRANCH ID': employee.branch_id,
                    'AVATAR': employee.avatar, // Thêm avatar vào báo cáo
                    'CREATED AT': reformDateTime(employee.createdAt),
                    'UPDATED AT': reformDateTime(employee.updatedAt)
                }));

                const ws = XLSX.utils.json_to_sheet(employees);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Employees_Report');

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                saveAs(data, 'employees_report.xlsx');
                alert('Xuất báo cáo thành công!');

                // Đóng modal và reset filters
                toggleExportModal(); // Đóng modal
                setExportFilters({
                    branchId: '', // Reset branch filter
                    role: '', // Reset role filter
                    startDate: '', // Reset startDate filter
                    endDate: '' // Reset endDate filter
                }); // Reset filters về giá trị mặc định (trống)
            } else {
                alert('Lỗi khi xuất báo cáo: ' + response.data.message);
            }
        } catch (error) {
            console.error('Lỗi khi xuất báo cáo:', error);
            alert('Xuất báo cáo thất bại!');
        }
    };


    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Nhân Viên</h1>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={search}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded"
                    />
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center"
                        onClick={toggleFilterModal}
                    >
                        <FaFilter className="mr-2" /> Lọc
                    </button>
                    {(userRole === 'admin' || userRole === 'manager') && (
                        <button
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                            onClick={() => navigate('/admin/employees/create')}
                        >
                            Thêm Nhân Viên
                        </button>


                    )}
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                        onClick={toggleExportModal}
                    >
                        Xuất Báo Cáo
                    </button>
                </div>
            </div>
            <Table columns={columns} data={formattedData} onEdit={handleEdit} onDelete={openDeleteModal} />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            <DeleteEmployeeModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                employeeId={selectedEmployeeId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Nhân Viên</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Chi Nhánh</label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Vai Trò</label>
                            <select
                                name="role"
                                value={filters.role}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="Quản trị viên">Quản trị viên</option>
                                <option value="Quản lý">Quản lý</option>
                                <option value="Nhân viên">Nhân viên</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Ngày Bắt Đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Ngày Kết Thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc
                            </button>
                            <button
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={toggleFilterModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                                onClick={applyFilters}
                            >
                                Áp Dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isExportModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo Nhân Viên</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Chức Vụ</label>
                            <select
                                name="role"
                                value={exportFilters.role}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Chi Nhánh</label>
                            <select
                                name="branchId"
                                value={exportFilters.branchId}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Ngày Bắt Đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={exportFilters.startDate}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Ngày Kết Thúc</label>
                            <input
                                type="date"
                                name="endDate"
                                value={exportFilters.endDate}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={toggleExportModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                                onClick={handleExport}
                            >
                                Xuất Báo Cáo
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Employee;