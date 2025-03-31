import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeletePaymentModal from './paymentsDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Payment = () => {
    const [columns] = useState([
        { field: '_id', label: 'PAYMENT ID' },
        { field: 'orderId', label: 'ORDER ID' },
        { field: 'user_id', label: 'USER ID' },
        { field: 'amount', label: 'AMOUNT' },
        { field: 'paymentMethod', label: 'PAYMENT METHOD' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);

    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        paymentMethod: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
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
                const response = await axios.get('http://localhost:3000/payments/all', {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters,
                        ...exportFilters
                    }
                });
                if (response.data.status === 'success') {
                    const payments = response.data.data.payments.map(payment => ({
                        ...payment,
                        createdAt: reformDateTime(payment.createdAt),
                        updatedAt: reformDateTime(payment.updatedAt)
                    }));
                    setData(payments);
                    setTotalPages(response.data.metadata.totalPages);
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
        navigate(`/payments/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/payments/delete/${id}`);
            setData(data.filter(payment => payment._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedPaymentId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedPaymentId(null);
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

    const handleExportPayments = async () => {
        try {
            const response = await axios.get('http://localhost:3000/payments/all', {
                params: {
                    ...exportFilters,
                    limit: 1000 // Giới hạn dữ liệu xuất
                },
                withCredentials: true
            });
    
            if (response.data.status === 'success') {
                const payments = response.data.data.payments.map(payment => ({
                    'PAYMENT ID': payment._id,
                    'ORDER ID': payment.orderId,
                    'USER ID': payment.user_id,
                    'STATUS': payment.status,
                    'PAYMENT METHOD': payment.paymentMethod,
                    'AMOUNT': payment.amount,
                    'CREATED AT': reformDateTime(payment.createdAt),
                    'UPDATED AT': reformDateTime(payment.updatedAt),
                }));
    
                const ws = XLSX.utils.json_to_sheet(payments);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Payments_Report');
    
                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
                saveAs(data, 'payments_report.xlsx');
                alert('Xuất báo cáo thanh toán thành công!');
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
            alert('Xuất báo cáo thanh toán thất bại!');
        }
    };
    
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Hóa Đơn</h1>
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
                        onClick={() => navigate('/payments/create')}
                    >
                        Thêm Hóa Đơn
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
            <DeletePaymentModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                paymentId={selectedPaymentId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Hóa Đơn</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Trạng Thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                 <option value="">Tất cả</option>
                                 <option value="pending">Chờ xử lý</option>
                                <option value="completed">Hoàn tất</option>
                                <option value="failed">Thất bại</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Phương Thức Thanh Toán</label>
                            <select
                                name="paymentMethod"
                                value={filters.paymentMethod}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="cash">Cash</option>
                                <option value="MoMo">MoMo</option>
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
            <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo Thanh Toán</h2>
              {/* Bộ lọc tìm kiếm theo Payment ID, Order ID, hoặc User ID */}
              <div className="mb-4">
                <label className="block mb-2">Tìm kiếm</label>
                <input
                    type="text"
                    name="search"
                    value={exportFilters.search}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nhập Payment ID, Order ID hoặc User ID"
                />
            </div>
            {/* Bộ lọc Trạng thái thanh toán */}
            <div className="mb-4">
                <label className="block mb-2">Trạng Thái Thanh Toán</label>
                <select
                    name="status"
                    value={exportFilters.status}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Tất cả</option>
                                <option value="pending">Chờ xử lý</option>
                                <option value="completed">Hoàn tất</option>
                                <option value="failed">Thất bại</option>
                </select>
            </div>

            {/* Bộ lọc Phương thức thanh toán */}
            <div className="mb-4">
                <label className="block mb-2">Phương Thức Thanh Toán</label>
                <select
                    name="paymentMethod"
                    value={exportFilters.paymentMethod}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                >
                      <option value="">Tất cả</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="cash">Cash</option>
                </select>
            </div>

            {/* Bộ lọc theo khoảng thời gian */}
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
                    onClick={handleExportPayments}
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

export default Payment;