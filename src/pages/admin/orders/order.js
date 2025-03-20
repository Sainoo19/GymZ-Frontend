import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import Pagination from '../../../components/admin/layout/Pagination';
import DeleteOrderModal from './ordersDelete';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';

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
    const [filters, setFilters] = useState({
        user_id: '',
        status: '',
        startDate: '',
        endDate: '',
        minTotalPrice: '',
        maxTotalPrice: '',
        product_id: ''
    });
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
                        ...filters
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
    }, [currentPage, search, filters]);

    const handleEdit = (id) => {
        navigate(`orders/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/orders/delete/${id}`);
            setData(data.filter(order => order._id !== id));
            setIsDeleteModalOpen(false);
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

    return (
        <div className="mt-4">
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
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                        onClick={() => navigate('/orders/create')}
                    >
                        Thêm Đơn Hàng
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
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Đã hủy">Đã hủy</option>
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
        </div>
    );
};

export default Order;