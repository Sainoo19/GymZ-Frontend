import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    FaBox,
    FaShippingFast,
    FaMapMarkerAlt,
    FaPhone,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaSearch,
    FaFilter,
    FaSpinner
} from 'react-icons/fa';
import Pagination from '../../admin/layout/Pagination';

const OrdersHistoryContent = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState({
        startDate: '',
        endDate: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(5); // Hiển thị 5 đơn hàng mỗi trang

    // Available status options
    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'Đặt hàng thành công', label: 'Đặt hàng thành công' },
        { value: 'Đã gửi hàng', label: 'Đã gửi hàng' },
        { value: 'Đã nhận hàng', label: 'Đã nhận hàng' },
        { value: 'Đã hủy', label: 'Đã hủy' }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, dateFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/orderClient/orders', {
                withCredentials: true
            });

            if (response.data.status === 'success') {
                setOrders(response.data.data.orders);
            } else {
                setError('Không thể tải lịch sử đơn hàng.');
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Đã xảy ra lỗi khi tải lịch sử đơn hàng.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount).replace('₫', 'VNĐ');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Đặt hàng thành công':
                return 'bg-blue-100 text-blue-800';
            case 'Đã gửi hàng':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã nhận hàng':
                return 'bg-green-100 text-green-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleDateFilterChange = (e) => {
        const { name, value } = e.target;
        setDateFilter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setDateFilter({
            startDate: '',
            endDate: ''
        });
    };

    // Xử lý chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Cuộn lên đầu trang khi chuyển trang
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Apply filters to orders
    const filteredOrders = orders.filter(order => {
        // Filter by order ID
        const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter by status
        const matchesStatus = statusFilter ? order.status === statusFilter : true;

        // Filter by date range
        let matchesDateRange = true;
        if (dateFilter.startDate) {
            const orderDate = new Date(order.createdAt);
            const startDate = new Date(dateFilter.startDate);
            startDate.setHours(0, 0, 0, 0);
            if (orderDate < startDate) {
                matchesDateRange = false;
            }
        }
        if (dateFilter.endDate && matchesDateRange) {
            const orderDate = new Date(order.createdAt);
            const endDate = new Date(dateFilter.endDate);
            endDate.setHours(23, 59, 59, 999);
            if (orderDate > endDate) {
                matchesDateRange = false;
            }
        }

        return matchesSearch && matchesStatus && matchesDateRange;
    });

    // Tính toán các đơn hàng hiển thị cho trang hiện tại
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lịch Sử Đơn Hàng</h1>
                <button
                    onClick={toggleFilters}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                >
                    <FaFilter className="mr-2" /> Bộ lọc
                </button>
            </div>

            {/* Search bar always visible */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn hàng..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Advanced filters */}
            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="font-semibold mb-3">Lọc đơn hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                name="startDate"
                                value={dateFilter.startDate}
                                onChange={handleDateFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                name="endDate"
                                value={dateFilter.endDate}
                                onChange={handleDateFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
            )}

            {/* Orders list */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-primary" />
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    <p>{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-gray-500 text-lg mb-3">Không tìm thấy đơn hàng nào.</div>
                    {(searchTerm || statusFilter || dateFilter.startDate || dateFilter.endDate) ? (
                        <p className="text-gray-600 mb-4">Không có đơn hàng phù hợp với bộ lọc hiện tại.</p>
                    ) : (
                        <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào.</p>
                    )}
                    {(searchTerm || statusFilter || dateFilter.startDate || dateFilter.endDate) && (
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="space-y-6">
                        {currentOrders.map(order => (
                            <div
                                key={order._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-secondary hover:border-2 transform hover:-translate-y-1"
                            >
                                {/* Order header - updated with tailwind config colors */}
                                <div className="bg-primary p-4 border-b flex flex-col md:flex-row justify-between">
                                    <div className="mb-2 md:mb-0">
                                        <h3 className="font-semibold text-lg text-secondary">Đơn hàng #{order._id}</h3>
                                        <div className="flex items-center text-sm text-gray-300">
                                            <FaCalendarAlt className="mr-1" /> {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <div className="text-lg font-semibold mt-1 text-secondary">
                                            {formatCurrency(order.totalPrice)}
                                        </div>
                                    </div>
                                </div>

                                {/* Order details */}
                                <div className="p-4">
                                    {/* Items section */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                            <FaBox className="mr-2" /> Sản phẩm ({order.items.length})
                                        </h4>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <ul className="divide-y divide-gray-200">
                                                {order.items.map((item, index) => (
                                                    <li key={index} className="py-2 first:pt-0 last:pb-0">
                                                        <div className="flex items-center">
                                                            <div className="h-16 w-16 flex-shrink-0 mr-4 overflow-hidden rounded-md border border-gray-200 transition-transform duration-300 hover:scale-110 hover:shadow-md">
                                                                <img
                                                                    src={item.productImage || '/placeholder-image.jpg'}
                                                                    alt={item.productName}
                                                                    className="h-full w-full object-cover object-center"
                                                                />
                                                            </div>
                                                            <div className="flex-1 transition-colors duration-300 hover:text-primary">
                                                                <div className="font-medium">{item.productName}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {item.theme}, {item.category}
                                                                </div>
                                                            </div>
                                                            <div className="text-gray-700">x{item.quantity}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Shipping info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                                <FaMapMarkerAlt className="mr-2" /> Địa chỉ giao hàng
                                            </h4>
                                            <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                                <div className="text-gray-700">
                                                    <div>{order.deliveryName}</div>
                                                    <div className="flex items-center mt-1">
                                                        <FaPhone className="text-gray-400 mr-1" size={12} />
                                                        {order.deliveryPhoneNumber}
                                                    </div>
                                                    <div className="mt-1">
                                                        {order.deliveryAdress?.street}, {order.deliveryAdress?.ward}, {order.deliveryAdress?.district}, {order.deliveryAdress?.province}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                                                <FaMoneyBillWave className="mr-2" /> Thông tin thanh toán
                                            </h4>
                                            <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-500">Tổng tiền hàng:</span>
                                                    <span>{formatCurrency(order.totalPrice - (order.shippingFee || 0))}</span>
                                                </div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-500">Phí vận chuyển:</span>
                                                    <span>{order.shippingFee ? formatCurrency(order.shippingFee) : 'Miễn phí'}</span>
                                                </div>
                                                <div className="flex justify-between font-semibold">
                                                    <span>Tổng thanh toán:</span>
                                                    <span className="text-primary">{formatCurrency(order.totalPrice)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default OrdersHistoryContent;