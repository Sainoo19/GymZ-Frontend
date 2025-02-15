import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePayment = () => {
    const navigate = useNavigate();
    const [payment, setPayment] = useState({
        orderId: '',
        user_id: '',
        amount: '',
        paymentMethod: '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/orders/all');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/all');
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchOrders();
        fetchUsers();
    }, []);

    const handleOrderChange = (e) => {
        const selectedOrder = orders.find(order => order._id === e.target.value);
        setPayment({
            ...payment,
            orderId: selectedOrder._id,
            amount: selectedOrder.totalPrice,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/payments/create', payment);
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
                    >
                        <option value="">Chọn Order ID</option>
                        {orders.map(order => (
                            <option key={order._id} value={order._id}>
                                {order._id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <select
                        value={payment.user_id}
                        onChange={(e) => setPayment({ ...payment, user_id: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Chọn User ID</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>
                                {user._id}
                            </option>
                        ))}
                    </select>
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
                    <input
                        type="text"
                        value={payment.paymentMethod}
                        onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
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