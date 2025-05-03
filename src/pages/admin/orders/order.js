import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeleteOrderModal from './ordersDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Order = () => {
    const [columns] = useState([
        { field: '_id', label: 'ORDER ID' },
        { field: 'user_id', label: 'USER ID' },
        { field: 'totalPrice', label: 'TOTAL PRICE' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);
    const URL_API = process.env.REACT_APP_API_URL;
    const [data, setData] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        user_id: '',
        status: '',
        startDate: '',
        endDate: '',
        minTotalPrice: '',
        maxTotalPrice: '',
        product_id: ''
    });

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
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URL_API}orders/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters,
                        ...exportFilters
                    }
                });
                if (response.data.status === 'success') {
                    const orders = response.data.data.orders.map(order => ({
                        ...order,
                        createdAt: reformDateTime(order.createdAt),
                        updatedAt: reformDateTime(order.updatedAt)
                    }));
                    setData(orders);
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
        navigate(`/admin/orders/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            // Gửi yêu cầu xóa đơn hàng
            await axios.delete(`${URL_API}orders/delete/${id}`);

            // Cập nhật lại dữ liệu sau khi xóa
            const response = await axios.get(`${URL_API}orders/all`, {
                params: {
                    page: currentPage,
                    limit: 10,
                    search,
                    ...filters
                }
            });

            if (response.data.status === 'success') {
                const orders = response.data.data.orders.map(order => ({
                    ...order,
                    createdAt: reformDateTime(order.createdAt),
                    updatedAt: reformDateTime(order.updatedAt)
                }));

                // Nếu số trang lớn hơn tổng số trang sau khi xóa, điều chỉnh về trang trước đó
                if (data.length === 1 && currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }

                setData(orders);
                setTotalPages(response.data.metadata.totalPages);
            } else {
                console.error('API response error:', response.data.message);
            }

            setIsDeleteModalOpen(false); // Đóng modal
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };


    const openDeleteModal = (id) => {
        setSelectedOrderId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedOrderId(null);
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

    const handleExportOrders = async () => {
        try {
            const response = await axios.get(`${URL_API}orders/all`, {
                params: {
                    ...exportFilters,
                    limit: 1000 // Giới hạn dữ liệu xuất
                },
                withCredentials: true
            });

            if (response.data.status === 'success') {
                const orders = response.data.data.orders.map(order => ({
                    'ORDER ID': order._id,
                    'USER ID': order.user_id,
                    'STATUS': order.status,
                    'TOTAL PRICE': order.totalPrice,
                    'CREATED AT': reformDateTime(order.createdAt),
                    'UPDATED AT': reformDateTime(order.updatedAt),
                    'PRODUCTS': order.items.map(item => `${item.product_id} (x${item.quantity})`).join(', '),
                }));

                const ws = XLSX.utils.json_to_sheet(orders);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Orders_Report');

                const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
                const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                saveAs(data, 'orders_report.xlsx');
                alert('Xuất báo cáo đơn hàng thành công!');
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
        <div className="mt-20">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Đơn Hàng</h1>
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
                    {/* Removed "Thêm Đơn Hàng" button */}
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
            <DeleteOrderModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                orderId={selectedOrderId}
            />
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Đơn Hàng</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Trạng Thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="Đang chờ">Đang chờ</option>
                                <option value="Đang xử lý">Đang xử lý</option>
                                <option value="Đặt Hàng Thành Công">Đặt Hàng Thành Công</option>
                                <option value="Đã hủy">Đã hủy</option>
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
                        <div className="mb-4">
                            <label className="block mb-2">Giá Tối Thiểu</label>
                            <input
                                type="number"
                                name="minTotalPrice"
                                value={filters.minTotalPrice}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Giá Tối Đa</label>
                            <input
                                type="number"
                                name="maxTotalPrice"
                                value={filters.maxTotalPrice}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Mã Sản Phẩm</label>
                            <input
                                type="text"
                                name="product_id"
                                value={filters.product_id}
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
                        <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo Đơn Hàng</h2>

                        {/* Trạng thái đơn hàng */}
                        <div className="mb-4">
                            <label className="block mb-2">Trạng Thái Đơn Hàng</label>
                            <select
                                name="status"
                                value={exportFilters.status}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="Đang chờ">Đang chờ</option>
                                <option value="Đang xử lý">Đang xử lý</option>
                                <option value="Đặt Hàng Thành Công">Đặt Hàng Thành Công</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>

                        {/* Lọc theo ID người dùng */}
                        <div className="mb-4">
                            <label className="block mb-2">ID Người Dùng</label>
                            <input
                                type="text"
                                name="user_id"
                                value={exportFilters.user_id}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Nhập ID người dùng"
                            />
                        </div>

                        {/* Tìm kiếm đơn hàng (ID đơn hoặc User ID) */}
                        <div className="mb-4">
                            <label className="block mb-2">Tìm kiếm đơn hàng</label>
                            <input
                                type="text"
                                name="search"
                                value={exportFilters.search}
                                onChange={handleExportFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Nhập Order ID hoặc User ID"
                            />
                        </div>

                        {/* Khoảng giá đơn hàng */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">Giá Tối Thiểu</label>
                                <input
                                    type="number"
                                    name="minTotalPrice"
                                    value={exportFilters.minTotalPrice}
                                    onChange={handleExportFilterChange}
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Nhập giá thấp nhất"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Giá Tối Đa</label>
                                <input
                                    type="number"
                                    name="maxTotalPrice"
                                    value={exportFilters.maxTotalPrice}
                                    onChange={handleExportFilterChange}
                                    className="w-full px-4 py-2 border rounded"
                                    placeholder="Nhập giá cao nhất"
                                />
                            </div>
                        </div>

                        {/* Ngày tạo đơn hàng */}
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

                        {/* Nút Hủy & Xuất Báo Cáo */}
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={toggleExportModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                                onClick={handleExportOrders}
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

export default Order;