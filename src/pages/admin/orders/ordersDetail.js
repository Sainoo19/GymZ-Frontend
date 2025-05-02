import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import FormatCurrency from '../../../components/utils/formatCurrency';

const UpdateOrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${URL_API}orders/${id}`);
                setOrder(response.data.data); // Access the data field
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${URL_API}users/all/nopagination`);
                setUsers(response.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchOrder();
        fetchUsers();
    }, [id, URL_API]);

    useEffect(() => {
        if (order) {
            const fetchProducts = async () => {
                try {
                    const productIds = order.items.map(item => item.product_id);
                    const response = await axios.post(`${URL_API}orders/products/byIds`, { ids: productIds });
                    const productsMap = response.data.data.reduce((map, product) => {
                        map[product._id] = product;
                        return map;
                    }, {});
                    setProducts(productsMap);
                    setLoading(false); // Set loading to false after fetching products
                } catch (error) {
                    console.error('Error fetching products:', error);
                    setLoading(false); // Set loading to false even if there's an error
                }
            };

            fetchProducts();
        }
    }, [order, URL_API]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedOrder = {
                ...order,
                updatedAt: new Date().toISOString(), // Update the updatedAt field
            };
            await axios.put(`${URL_API}orders/update/${id}`, updatedOrder);
            // Navigate back to the orders list after update
            navigate('/admin/orders');
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2">Đang tải dữ liệu đơn hàng...</span>
        </div>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Chi Tiết Đơn Hàng</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Thông tin đơn hàng */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Thông Tin Đơn Hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mã Đơn Hàng</label>
                            <input
                                type="text"
                                value={order._id}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mã Khách Hàng</label>
                            <select
                                value={order.user_id}
                                onChange={(e) => setOrder({ ...order, user_id: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {users.map(user => (
                                    <option key={user._id} value={user._id}>
                                        {user._id}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                            <select
                                value={order.status}
                                onChange={(e) => setOrder({ ...order, status: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Đặt hàng thành công">Đặt hàng thành công</option>
                                <option value="Đã gửi hàng">Đã gửi hàng</option>
                                <option value="Đã nhận">Đã nhận</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tổng Giá Sản Phẩm</label>
                            <input
                                type="text"
                                value={FormatCurrency(order.totalPrice) + " VND"}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phí Vận Chuyển</label>
                            <input
                                type="text"
                                value={FormatCurrency(order.shippingFee) + " VND"}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tổng Thanh Toán</label>
                            <input
                                type="text"
                                value={FormatCurrency(order.totalPrice + order.shippingFee) + " VND"}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 font-bold text-green-600"
                            />
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    </div>
                </div>

                {/* Thông tin vận chuyển */}
                <div className="border-b pb-6">
                    <h2 className="text-xl font-semibold mb-4">Thông Tin Vận Chuyển</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên Người Nhận</label>
                            <input
                                type="text"
                                value={order.deliveryName || ''}
                                onChange={(e) => setOrder({ ...order, deliveryName: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                            <input
                                type="text"
                                value={order.deliveryPhoneNumber || ''}
                                onChange={(e) => setOrder({ ...order, deliveryPhoneNumber: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {order.deliveryAdress && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa Chỉ Chi Tiết</label>
                                <input
                                    type="text"
                                    value={order.deliveryAdress.street || ''}
                                    onChange={(e) => setOrder({
                                        ...order,
                                        deliveryAdress: {
                                            ...order.deliveryAdress,
                                            street: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                                <input
                                    type="text"
                                    value={order.deliveryAdress.ward || ''}
                                    onChange={(e) => setOrder({
                                        ...order,
                                        deliveryAdress: {
                                            ...order.deliveryAdress,
                                            ward: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {order.deliveryAdress && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                                <input
                                    type="text"
                                    value={order.deliveryAdress.district || ''}
                                    onChange={(e) => setOrder({
                                        ...order,
                                        deliveryAdress: {
                                            ...order.deliveryAdress,
                                            district: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành Phố</label>
                                <input
                                    type="text"
                                    value={order.deliveryAdress.province || ''}
                                    onChange={(e) => setOrder({
                                        ...order,
                                        deliveryAdress: {
                                            ...order.deliveryAdress,
                                            province: e.target.value
                                        }
                                    })}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    {order.deliveryAdress && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm font-medium text-gray-700">Địa Chỉ Đầy Đủ:</p>
                            <p className="text-gray-600">
                                {order.deliveryAdress.street}, {order.deliveryAdress.ward}, {order.deliveryAdress.district}, {order.deliveryAdress.province}
                            </p>
                        </div>
                    )}
                </div>

                {/* Danh sách sản phẩm */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Sản Phẩm</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Tên Sản Phẩm</th>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Phân Loại</th>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Màu Sắc</th>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Số Lượng</th>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Đơn Giá</th>
                                    <th className="py-3 px-4 border-b bg-gray-800 text-white text-left">Thành Tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, index) => {
                                    const product = products[item.product_id];
                                    const variation = product?.variations.find(v => v.category === item.category && v.theme === item.theme);
                                    const price = variation?.salePrice || 0;
                                    return (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="py-3 px-4 border-b">{product?.name || 'N/A'}</td>
                                            <td className="py-3 px-4 border-b">{item.category}</td>
                                            <td className="py-3 px-4 border-b">{item.theme}</td>
                                            <td className="py-3 px-4 border-b">{item.quantity}</td>
                                            <td className="py-3 px-4 border-b">{FormatCurrency(price)} VND</td>
                                            <td className="py-3 px-4 border-b">{FormatCurrency(price * item.quantity)} VND</td>
                                        </tr>
                                    );
                                })}
                                <tr className="bg-gray-100">
                                    <td colSpan="5" className="py-3 px-4 border-b text-right font-semibold">Tổng tiền sản phẩm:</td>
                                    <td className="py-3 px-4 border-b font-semibold">{FormatCurrency(order.totalPrice)} VND</td>
                                </tr>
                                <tr className="bg-gray-100">
                                    <td colSpan="5" className="py-3 px-4 border-b text-right font-semibold">Phí vận chuyển:</td>
                                    <td className="py-3 px-4 border-b font-semibold">{FormatCurrency(order.shippingFee)} VND</td>
                                </tr>
                                <tr className="bg-gray-200">
                                    <td colSpan="5" className="py-3 px-4 border-b text-right font-bold">Tổng thanh toán:</td>
                                    <td className="py-3 px-4 border-b font-bold text-green-600">{FormatCurrency(order.totalPrice + order.shippingFee)} VND</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/orders')}
                        className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Quay Lại
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Đơn Hàng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateOrderForm;