import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeleteBranchModal from './branchesDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Branches = () => {
    const [columns] = useState([
        { field: '_id', label: 'BRANCH ID' },
        { field: 'name', label: 'NAME' },
        { field: 'address', label: 'ADDRESS' },
        { field: 'phone', label: 'PHONE' },
        { field: 'manager_id', label: 'MANAGER ID' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const URL_API = process.env.REACT_APP_API_URL;

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        location: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const navigate = useNavigate();
    const [exportFilters, setExportFilters] = useState({
        branchId: '',
        type: '',
        startDate: '',
        endDate: ''
    });
    const cleanFilters = Object.fromEntries(
        Object.entries(exportFilters).filter(([_, v]) => v)
    );
    

    const toggleExportModal = () => {
        setIsExportModalOpen(!isExportModalOpen);
        
    };
    
    const handleExportFilterChange = (e) => {
        setExportFilters({
            ...exportFilters,
            [e.target.name]: e.target.value
        });
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URL_API}branches/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters,
                        ...exportFilters
                    }
                });
                if (response.data.status === 'success') {
                    const branches = response.data.data.branches.map(branch => ({
                        ...branch,
                        address: `${branch.address.street}, ${branch.address.city}, ${branch.address.country}`,
                        createdAt: reformDateTime(branch.createdAt),
                        updatedAt: reformDateTime(branch.updatedAt)
                    }));
                    setData(branches);
                    setTotalPages(response.data.metadata.totalPages || 1);
                } else {
                    console.error('API response error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage, search, filters, exportFilters]);

    const handleEdit = (id) => {
        navigate(`/branches/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_API}branches/delete/${id}`);
            setData(data.filter(branch => branch._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting branch:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedBranchId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedBranchId(null);
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

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get(`${URL_API}branches/all`, {
                params: {
                    ...cleanFilters,
                    limit: 1000
                },
                withCredentials: true
            });
            
            console.log('API Response:', response.data); // Kiểm tra dữ liệu trả về từ API
    
            if (response.data.status === 'success') {
                const branches = response.data.data.branches.map(branch => ({
                    'BRANCH ID': branch._id,
                    'NAME': branch.name,
                    'PHONE': branch.phone,
                    'CITY': branch.address?.city || 'N/A',
                    'CREATED AT': reformDateTime(branch.createdAt),
                    'UPDATED AT': reformDateTime(branch.updatedAt)
                }));
                console.log('Excel Data:', branches); // Kiểm tra dữ liệu trước khi xuất
    
                const ws = XLSX.utils.json_to_sheet(branches);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Branches_Report');
    
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
                saveAs(data, 'branches_report.xlsx');
                alert('Xuất báo cáo thành công!');
             
                  // Đóng modal và reset filters
                toggleExportModal(); // Đóng modal
                setExportFilters({
                    branchId: '',
                    type: '',
                    startDate: '',
                    endDate: ''
                }); // Reset filters
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
                <h1 className="text-2xl font-bold">Tất Cả Chi Nhánh</h1>
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
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                        onClick={() => navigate('/branches/create')}
                    >
                        Thêm Chi Nhánh
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
            <DeleteBranchModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                branchId={selectedBranchId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Chi Nhánh</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Địa Điểm</label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
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
            <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo Chi Nhánh</h2>

          {/* Bộ lọc tìm kiếm theo Payment ID, Order ID, hoặc User ID */}
          <div className="mb-4">
                <label className="block mb-2">Tìm kiếm</label>
                <input
                    type="text"
                    name="search"
                    value={exportFilters.search}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nhập Brand ID"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-2">Thành Phố</label>
                <input
                    type="text"
                    name="location"
                    value={exportFilters.location}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nhập thành phố"
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

export default Branches;