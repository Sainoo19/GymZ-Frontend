import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeleteDiscountModal from './discountsDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Discounts = () => {
    const [columns] = useState([
        { field: '_id', label: 'DISCOUNT ID' },
        { field: 'code', label: 'CODE' },
        { field: 'description', label: 'DESCRIPTION' },
        { field: 'discountPercent', label: 'DISCOUNT PERCENTAGE' },
        { field: 'validFrom', label: 'START DATE' },
        { field: 'validUntil', label: 'END DATE' },
        { field: 'status', label: 'STATUS' },
    ]);

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);
    
    const navigate = useNavigate();

    const [exportFilters, setExportFilters] = useState({
        branchId: '',
        type: '',
        startDate: '',
        endDate: ''
    });
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
                const response = await axios.get('http://localhost:3000/discounts/all', {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters,
                        ...exportFilters
                    }
                });
                if (response.data.status === 'success') {
                    const discounts = response.data.data.discounts.map(discount => ({
                        ...discount,
                        validFrom: reformDateTime(discount.validFrom),
                        validUntil: reformDateTime(discount.validUntil)
                    }));
                    setData(discounts);
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
        navigate(`/discounts/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/discounts/delete/${id}`);
            setData(data.filter(discount => discount._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting discount:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedDiscountId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedDiscountId(null);
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
            const response = await axios.get('http://localhost:3000/discounts/all', {
                params: {
                    ...exportFilters, // Giữ lại các filter hiện tại như status, validFrom, validUntil, search
                    limit: 1000 // Giới hạn dữ liệu xuất
                },
                withCredentials: true
            });
    
            if (response.data.status === 'success') {
                const discounts = response.data.data.discounts.map(discount => ({
                    'DISCOUNT ID': discount._id,
                    'CODE': discount.code,
                    'STATUS': discount.status,
                    'VALID FROM': reformDateTime(discount.validFrom),
                    'VALID UNTIL': reformDateTime(discount.validUntil),
                    'CREATED AT': reformDateTime(discount.createdAt),
                    'UPDATED AT': reformDateTime(discount.updatedAt)
                }));
    
                const ws = XLSX.utils.json_to_sheet(discounts);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Discounts_Report');
    
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
                saveAs(data, 'discounts_report.xlsx');
                alert('Xuất báo cáo thành công!');
                
                // Đóng modal và reset filters
                toggleExportModal(); // Đóng modal
                setExportFilters({
                    status: '',
                    validFrom: '',
                    validUntil: '',
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
                <h1 className="text-2xl font-bold">Tất Cả Khuyến Mãi</h1>
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
                        onClick={() => navigate('/discounts/create')}
                    >
                        Thêm Khuyến Mãi
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
            <DeleteDiscountModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                discountId={selectedDiscountId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Khuyến Mãi</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Trạng Thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
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
            <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo</h2>
            {/* Bộ lọc Status của Discount */}
            <div className="mb-4">
                <label className="block mb-2">Trạng Thái Discount</label>
                <select
                    name="status"
                    value={exportFilters.status}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Tất cả</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {/* Tìm kiếm theo mã Discount hoặc ID */}
            <div className="mb-4">
                <label className="block mb-2">Tìm kiếm Discount ID hoặc Mã Discount</label>
                <input
                    type="text"
                    name="search"
                    value={exportFilters.search}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nhập Discount ID hoặc Mã Discount"
                />
            </div>

            {/* Ngày bắt đầu của Discount */}
            <div className="mb-4">
                <label className="block mb-2">Ngày Bắt Đầu</label>
                <input
                    type="date"
                    name="validFrom"
                    value={exportFilters.validFrom}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>

            {/* Ngày kết thúc của Discount */}
            <div className="mb-4">
                <label className="block mb-2">Ngày Kết Thúc</label>
                <input
                    type="date"
                    name="validUntil"
                    value={exportFilters.validUntil}
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

export default Discounts;