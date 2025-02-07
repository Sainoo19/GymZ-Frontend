import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/orders/${id}`);
                setOrder(response.data.data); // Access the data field
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedOrder = {
                ...order,
                updatedAt: new Date().toISOString(), // Update the updatedAt field
            };
            await axios.put(`http://localhost:3000/orders/update/${id}`, updatedOrder);
            navigate('/orders'); // Navigate back to the orders list
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cập Nhật Đơn Hàng</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                        type="text"
                        value={order._id}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <input
                        type="text"
                        value={order.user_id}
                        onChange={(e) => setOrder({ ...order, user_id: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng Giá</label>
                    <input
                        type="number"
                        value={order.totalPrice}
                        onChange={(e) => setOrder({ ...order, totalPrice: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                    <select
                        value={order.status}
                        onChange={(e) => setOrder({ ...order, status: e.target.value })}
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
                        value={order.createdAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                    <input
                        type="text"
                        value={order.updatedAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Đơn Hàng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateOrderForm;