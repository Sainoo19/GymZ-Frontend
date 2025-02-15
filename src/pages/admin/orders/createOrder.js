import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateOrder = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        user_id: '',
        items: [],
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });
    const [users, setUsers] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState({});
    const [newProductId, setNewProductId] = useState('');
    const [newProductQuantity, setNewProductQuantity] = useState(1);
    const [newProductVariations, setNewProductVariations] = useState([]);
    const [selectedVariationId, setSelectedVariationId] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [themes, setThemes] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    useEffect(() => {
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

        fetchUsers();
        fetchAllProducts();
    }, []);

    useEffect(() => {
        if (order.items.length > 0) {
            const fetchProducts = async () => {
                try {
                    const productIds = order.items.map(item => item.product_id);
                    const response = await axios.post('http://localhost:3000/orders/products/byIds', { ids: productIds });
                    const productsMap = response.data.data.reduce((map, product) => {
                        map[product._id] = product;
                        return map;
                    }, {});
                    setProducts(productsMap);
                } catch (error) {
                    console.error('Error fetching products:', error);
                }
            };

            fetchProducts();
        }
    }, [order.items]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Calculate total price
            const totalPrice = order.items.reduce((total, item) => total + item.quantity * item.salePrice, 0);

            // Create a copy of the order without the price field in items
            const orderToSubmit = {
                ...order,
                totalPrice, // Include total price
                items: order.items.map(({ product_id, category, theme, quantity }) => ({ product_id, category, theme, quantity })),
            };
            await axios.post('http://localhost:3000/orders/create', orderToSubmit);
            navigate('/orders'); // Navigate back to the orders list
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    const handleAddProduct = () => {
        if (newProductId && newProductQuantity > 0 && selectedVariationId && selectedTheme) {
            const existingItem = order.items.find(item => item.product_id === newProductId && item.variation_id === selectedVariationId && item.theme === selectedTheme);
            if (existingItem) {
                existingItem.quantity += newProductQuantity;
            } else {
                const product = allProducts.find(p => p._id === newProductId);
                const variation = product.variations.find(v => v._id === selectedVariationId && v.theme === selectedTheme);
                if (product && variation) {
                    if (newProductQuantity > variation.stock) {
                        alert(`Quantity exceeds stock. Available stock: ${variation.stock}`);
                        return;
                    }
                    order.items.push({
                        product_id: newProductId,
                        variation_id: selectedVariationId,
                        category: variation.category,
                        theme: selectedTheme,
                        quantity: newProductQuantity,
                        salePrice: variation.salePrice,
                        name: product.name
                    });
                } else {
                    console.error('Product or variation not found');
                }
            }
            setOrder({ ...order });
            setNewProductId('');
            setNewProductQuantity(1);
            setNewProductVariations([]);
            setSelectedVariationId('');
            setSelectedTheme('');
            setFilteredCategories([]);
            // Update products state to ensure the new product is reflected in the table
            const updatedProducts = { ...products };
            updatedProducts[newProductId] = allProducts.find(p => p._id === newProductId);
            setProducts(updatedProducts);
        }
    };

    const handleQuantityChange = (productId, variationId, theme, quantity) => {
        const updatedItems = order.items.map(item =>
            item.product_id === productId && item.variation_id === variationId && item.theme === theme ? { ...item, quantity: parseInt(quantity, 10) || 0 } : item
        );
        setOrder({ ...order, items: updatedItems });
    };

    const handleRemoveProduct = (productId, variationId, theme) => {
        const updatedItems = order.items.filter(item => !(item.product_id === productId && item.variation_id === variationId && item.theme === theme));
        setOrder({ ...order, items: updatedItems });
    };

    const handleProductChange = (productId) => {
        setNewProductId(productId);
        const product = allProducts.find(p => p._id === productId);
        if (product) {
            setNewProductVariations(product.variations);
            setSelectedVariationId(product.variations[0]?._id || '');
            setThemes([...new Set(product.variations.map(v => v.theme))]);
            setSelectedTheme(product.variations[0]?.theme || '');
            setFilteredCategories(product.variations.filter(v => v.theme === product.variations[0]?.theme));
        } else {
            setNewProductVariations([]);
            setSelectedVariationId('');
            setThemes([]);
            setSelectedTheme('');
            setFilteredCategories([]);
        }
    };

    const handleThemeChange = (theme) => {
        setSelectedTheme(theme);
        const product = allProducts.find(p => p._id === newProductId);
        if (product) {
            setFilteredCategories(product.variations.filter(v => v.theme === theme));
            setSelectedVariationId(product.variations.find(v => v.theme === theme)?._id || '');
        } else {
            setFilteredCategories([]);
            setSelectedVariationId('');
        }
    };

    const calculateTotalPrice = () => {
        return order.items.reduce((total, item) => {
            return total + item.quantity * item.salePrice;
        }, 0);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tạo Đơn Hàng Mới</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">User ID</label>
                    <select
                        value={order.user_id}
                        onChange={(e) => setOrder({ ...order, user_id: e.target.value })}
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
                                <th className="py-2 px-4 border-b bg-black text-white">Product Name</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Variation Category</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Theme</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Quantity</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Price</th>
                                <th className="py-2 px-4 border-b bg-black text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(item => (
                                <tr key={`${item.product_id}-${item.variation_id || 'no-variation'}-${item.theme}`}>
                                    <td className="py-3 px-6 border-b">{products[item.product_id]?.name || 'N/A'}</td>
                                    <td className="py-3 px-6 border-b">{item.category || 'N/A'}</td>
                                    <td className="py-3 px-6 border-b">{item.theme || 'N/A'}</td>
                                    <td className="py-3 px-6 border-b">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.product_id, item.variation_id, item.theme, e.target.value)}
                                            className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                        />
                                    </td>
                                    <td className="py-3 px-6 border-b">{products[item.product_id]?.variations.find(v => v._id === item.variation_id && v.theme === item.theme)?.salePrice || 'N/A'}</td>
                                    <td className="py-3 px-6 border-b">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveProduct(item.product_id, item.variation_id, item.theme)}
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
                            onChange={(e) => handleProductChange(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Product</option>
                            {allProducts.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedTheme}
                            onChange={(e) => handleThemeChange(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Theme</option>
                            {themes.map(theme => (
                                <option key={theme} value={theme}>
                                    {theme}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedVariationId}
                            onChange={(e) => setSelectedVariationId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Select Category</option>
                            {filteredCategories.map(variation => (
                                <option key={variation._id} value={variation._id}>
                                    {variation.category} - {variation.salePrice}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={newProductQuantity}
                            onChange={(e) => setNewProductQuantity(parseInt(e.target.value, 10) || 0)}
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
                        Tạo Đơn Hàng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrder;