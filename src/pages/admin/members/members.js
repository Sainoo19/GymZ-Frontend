import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeleteMemberModal from './membersDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Members = () => {
    const [columns] = useState([
        { field: '_id', label: 'MEMBER ID' },
        { field: 'userID', label: 'USER ID' },
        { field: 'type', label: 'MEMBERSHIP TYPE' },
        { field: 'validFrom', label: 'VALID FROM' },
        { field: 'validUntil', label: 'VALID UNTIL' },
        { field: 'branchID', label: 'BRANCH ID' },
        { field: 'employeeID', label: 'EMPLOYEE ID' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        branchId: '',
        type: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState(null);
    const navigate = useNavigate();
    const URL_API = process.env.REACT_APP_API_URL;

    const [exportFilters, setExportFilters] = useState({
        branchId: '',
        type: '',
        startDate: '',
        endDate: '',
        search: ''
    });
    const [branches, setBranches] = useState([]);

    // Hàm để loại bỏ các tham số rỗng
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

    // Lấy danh sách branches cho dropdown
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${URL_API}branches/all/nopagination`);
                if (response.data.status === 'success') {
                    setBranches(response.data.data);
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            }
        };

        fetchBranches();
    }, [URL_API]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Tạo bản sao của filters để không ảnh hưởng đến state gốc
                const cleanedFilters = cleanFilters(filters);

                const response = await axios.get(`${URL_API}members/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...cleanedFilters
                    },
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const members = response.data.data.members.map(member => ({
                        ...member,
                        validFrom: reformDateTime(member.validFrom),
                        validUntil: reformDateTime(member.validUntil),
                        createdAt: reformDateTime(member.createdAt),
                        updatedAt: reformDateTime(member.updatedAt)
                    }));
                    setData(members);
                    setTotalPages(response.data.metadata.totalPages || 1);
                } else {
                    console.error('API response error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage, search, filters, URL_API]);  // Loại bỏ exportFilters từ dependencies

    const handleEdit = (id) => {
        navigate(`/admin/members/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_API}members/delete/${id}`, {
                withCredentials: true
            });
            setData(data.filter(member => member._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting member:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedMemberId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMemberId(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi search
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const clearFilters = () => {
        setFilters({
            branchId: '',
            type: '',
            startDate: '',
            endDate: ''
        });
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const applyFilters = () => {
        // Kiểm tra nếu cả hai ngày đều được điền
        if ((filters.startDate && !filters.endDate) || (!filters.startDate && filters.endDate)) {
            alert('Vui lòng nhập đủ cả ngày bắt đầu và kết thúc');
            return;
        }

        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const handleExport = async () => {
        try {
            // Xử lý và làm sạch filters trước khi gửi request
            const cleanedExportFilters = cleanFilters(exportFilters);

            const response = await axios.get(`${URL_API}members/all`, {
                params: {
                    ...cleanedExportFilters,
                    limit: 1000 // Giới hạn dữ liệu xuất
                },
                withCredentials: true
            });

            if (response.data.status === 'success') {
                const members = response.data.data.members.map(member => ({
                    'MEMBER ID': member._id,
                    'USER ID': member.userID,
                    'MEMBERSHIP TYPE': member.type,
                    'VALID FROM': reformDateTime(member.validFrom),
                    'VALID UNTIL': reformDateTime(member.validUntil),
                    'BRANCH ID': member.branchID,
                    'EMPLOYEE ID': member.employeeID,
                    'CREATED AT': reformDateTime(member.createdAt),
                    'UPDATED AT': reformDateTime(member.updatedAt),
                    'NAME': member.user ? member.user.name : '',
                    'EMAIL': member.user ? member.user.email : '',
                    'PHONE': member.user ? member.user.phone : ''
                }));

                const ws = XLSX.utils.json_to_sheet(members);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Members_Report');

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                saveAs(data, 'members_report.xlsx');
                alert('Xuất báo cáo thành công!');

                // Đóng modal và reset filters
                toggleExportModal(); // Đóng modal
                setExportFilters({
                    branchId: '',
                    type: '',
                    startDate: '',
                    endDate: '',
                    search: ''
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
                <h1 className="text-2xl font-bold">Tất Cả Hội Viên</h1>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID hoặc User ID..."
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
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                        onClick={() => navigate('/admin/members/create')}
                    >
                        Thêm Hội Viên
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                        onClick={toggleExportModal}
                    >
                        Xuất Báo Cáo
                    </button>
                </div>
            </div>
            <Table columns={columns} data={data} onEdit={handleEdit} onDelete={openDeleteModal} />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
            <DeleteMemberModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                memberId={selectedMemberId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Lọc Hội Viên</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Loại Thành Viên</label>
                            <select
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="BASIC">BASIC</option>
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="PLATINUM">PLATINUM</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Chi Nhánh</label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả chi nhánh</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name} ({branch._id})
                                    </option>
                                ))}
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
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Loại Thành Viên</label>
                            <select
                                name="type"
                                value={exportFilters.type}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="BASIC">BASIC</option>
                                <option value="SILVER">SILVER</option>
                                <option value="GOLD">GOLD</option>
                                <option value="PLATINUM">PLATINUM</option>
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
                                <option value="">Tất cả chi nhánh</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name} ({branch._id})
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Bộ lọc tìm kiếm theo MemberID hoặc UserID */}
                        <div className="mb-4">
                            <label className="block mb-2">Tìm kiếm UserID hoặc MemberID</label>
                            <input
                                type="text"
                                name="search"
                                value={exportFilters.search}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Nhập User ID hoặc MemberID"
                            />
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

export default Members;