import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePayment = () => {
    const navigate = useNavigate();
    const [payment, setPayment] = useState({
        orderId: '',
        user_id: '',
        userName: '',
        amount: '',
        paymentMethod: 'Credit Card', // Default to "Credit Card"
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    const URL_API = process.env.REACT_APP_API_URL;

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${URL_API}orders/all/nopagination`);
                setOrders(response.data.data || []); // Ensure orders is an array
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleOrderChange = async (e) => {
        const selectedOrder = orders.find(order => order._id === e.target.value);
        if (selectedOrder) {
            try {
                const userResponse = await axios.get(`${URL_API}users/${selectedOrder.user_id}`);
                const user = userResponse.data.data;
                setPayment({
                    ...payment,
                    orderId: selectedOrder._id,
                    user_id: selectedOrder.user_id,
                    userName: user.name,
                    amount: selectedOrder.totalPrice,
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${URL_API}payments/create`, {
                ...payment,
                user_id: payment.user_id, // Ensure user_id is sent in the POST request
            });
            navigate('/payments'); // Navigate back to the payments list
        } catch (error) {
            console.error('Error creating payment:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tạo Hóa Đơn Mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Order ID</label>
                    <select
                        value={payment.orderId}
                        onChange={handleOrderChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        style={{ maxHeight: '8rem', overflowY: 'auto' }} // Add inline styles for max height and overflow
                    >
                        <option value="">Chọn Order ID</option>
                        {Array.isArray(orders) && orders.map(order => (
                            <option key={order._id} value={order._id}>
                                {order._id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User Name</label>
                    <input
                        type="text"
                        value={payment.userName}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số Tiền</label>
                    <input
                        type="number"
                        value={payment.amount}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phương Thức Thanh Toán</label>
                    <select
                        value={payment.paymentMethod}
                        onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="Credit Card">Credit Card</option>
                        <option value="VNPay">VNPay</option>
                        <option value="MoMo">MoMo</option>
                        <option value="Cash">Cash</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                    <select
                        value={payment.status}
                        onChange={(e) => setPayment({ ...payment, status: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="pending">Đang chờ</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                    <input
                        type="text"
                        value={payment.createdAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                    <input
                        type="text"
                        value={payment.updatedAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Tạo Hóa Đơn
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePayment;