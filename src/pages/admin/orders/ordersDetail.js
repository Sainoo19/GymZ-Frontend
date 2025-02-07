import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateOrderForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newProductId, setNewProductId] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState(1);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/orders/${id}`);
                setOrder(response.data.data); // Access the data field
            } catch (error) {
                console.error('Error fetching order:', error);
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

        const fetchAllProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products/all');
                setAllProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchOrder();
        fetchUsers();
        fetchAllProducts();
    }, [id]);

    useEffect(() => {
        if (order) {
            const fetchProducts = async () => {
                try {
                    const productIds = order.items.map(item => item.product_id);
                    const response = await axios.post('http://localhost:3000/orders/products/byIds', { ids: productIds });
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
    }, [order]);

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

    const calculateTotalPrice = () => {
        return order.items.reduce((total, item) => {
            const product = products[item.product_id];
            return total + item.quantity * (product ? product.price : 0);
        }, 0);
    };

    const handleAddProduct = () => {
        if (newProductId && newProductQuantity > 0) {
            const existingItem = order.items.find(item => item.product_id === newProductId);
            if (existingItem) {
                existingItem.quantity += newProductQuantity;
            } else {
                order.items.push({ product_id: newProductId, quantity: newProductQuantity });
            }
            setOrder({ ...order });
            setNewProductId('');
            setNewProductQuantity(1);
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        const updatedItems = order.items.map(item =>
            item.product_id === productId ? { ...item, quantity: parseInt(quantity, 10) } : item
        );
        setOrder({ ...order, items: updatedItems });
    };

    const handleRemoveProduct = (productId) => {
        const updatedItems = order.items.filter(item => item.product_id !== productId);
        setOrder({ ...order, items: updatedItems });
    };

    if (loading) {
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
                    <h2 className="text-xl font-bold mb-2">Sản Phẩm</h2>
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b bg-black text-white">Product ID</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Quantity</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Price</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={item.product_id}>
                                    <td className="py-3 px-6 border-b">{item.product_id}</td>
                                    <td className="py-3 px-6 border-b">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.product_id, e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </td>
                                    <td className="py-3 px-6 border-b">{products[item.product_id]?.price}</td>
                                    <td className="py-3 px-6 border-b">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(item.product_id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Add Product</label>
                    <div className="flex space-x-2">
                        <select
                            value={newProductId}
                            onChange={(e) => setNewProductId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Product</option>
                            {allProducts.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={newProductQuantity}
                            onChange={(e) => setNewProductQuantity(parseInt(e.target.value, 10))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            min="1"
                        />
                        <button
                            type="button"
                            onClick={handleAddProduct}
                            className="mt-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tổng Giá</label>
                    <input
                        type="number"
                        value={calculateTotalPrice()}
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