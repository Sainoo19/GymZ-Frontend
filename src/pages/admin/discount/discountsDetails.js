import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDiscountForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [discount, setDiscount] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch discount data
                const discountResponse = await axios.get(`${URL_API}discounts/${id}`);
                if (discountResponse.data.status === 'success') {
                    const discountData = discountResponse.data.data;
                    setDiscount(discountData);
                    if (discountData.applicableProducts && Array.isArray(discountData.applicableProducts)) {
                        setSelectedProducts(discountData.applicableProducts);
                    }
                }

                // Fetch all products
                const productsResponse = await axios.get(`${URL_API}products/all/nopagination`);
                if (productsResponse.data.status === 'success') {
                    setProducts(productsResponse.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Không thể tải dữ liệu. Vui lòng thử lại sau!');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, URL_API]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDiscount({
            ...discount,
            [name]: value
        });
    };

    const handleProductSelection = (e) => {
        const productId = e.target.value;
        if (productId && !selectedProducts.includes(productId)) {
            const newSelectedProducts = [...selectedProducts, productId];
            setSelectedProducts(newSelectedProducts);
            setDiscount({
                ...discount,
                applicableProducts: newSelectedProducts
            });
        }
    };

    const handleRemoveProduct = (productId) => {
        const newSelectedProducts = selectedProducts.filter(id => id !== productId);
        setSelectedProducts(newSelectedProducts);
        setDiscount({
            ...discount,
            applicableProducts: newSelectedProducts
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Format data for API
            const updatedDiscount = {
                ...discount,
                discountPercent: Number(discount.discountPercent),
                maxDiscountAmount: Number(discount.maxDiscountAmount),
                usageLimit: Number(discount.usageLimit),
                updatedAt: new Date().toISOString(), // Update the updatedAt field
            };

            await axios.put(`${URL_API}discounts/update/${id}`, updatedDiscount);
            navigate('/admin/discounts'); // Navigate back to the discounts list
        } catch (error) {
            console.error('Error updating discount:', error);
            alert('Có lỗi khi cập nhật khuyến mãi. Vui lòng thử lại sau!');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (!discount) {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-16 text-center">
                <h2 className="text-xl text-red-600">Không tìm thấy thông tin khuyến mãi!</h2>
                <button
                    onClick={() => navigate('/admin/discounts')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Quay lại danh sách
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-16">
            <h1 className="text-2xl font-bold mb-6 text-center">Cập Nhật Khuyến Mãi</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID</label>
                        <input
                            type="text"
                            value={discount._id}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mã Khuyến Mãi <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            name="code"
                            value={discount.code}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô Tả</label>
                    <input
                        type="text"
                        name="description"
                        value={discount.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phần Trăm Giảm Giá (%) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="discountPercent"
                            value={discount.discountPercent}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giới Hạn Giảm Giá Tối Đa (VNĐ)</label>
                        <input
                            type="number"
                            name="maxDiscountAmount"
                            value={discount.maxDiscountAmount || 0}
                            onChange={handleInputChange}
                            min="0"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0 = không giới hạn"
                        />
                        <p className="text-sm text-gray-500 mt-1">Để 0 nếu không giới hạn số tiền giảm</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày Bắt Đầu <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="validFrom"
                            value={discount.validFrom ? discount.validFrom.substring(0, 10) : ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày Kết Thúc <span className="text-red-500">*</span></label>
                        <input
                            type="date"
                            name="validUntil"
                            value={discount.validUntil ? discount.validUntil.substring(0, 10) : ''}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Giới Hạn Sử Dụng <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            name="usageLimit"
                            value={discount.usageLimit}
                            onChange={handleInputChange}
                            min="1"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                        <select
                            name="status"
                            value={discount.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sản Phẩm Áp Dụng</label>
                    <div className="flex gap-2 mb-3">
                        <select
                            onChange={handleProductSelection}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value=""
                        >
                            <option value="">-- Chọn sản phẩm --</option>
                            {products.map(product => (
                                <option key={product._id} value={product._id}>
                                    {product.name} - {product._id}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selected products display */}
                    <div className="border rounded-md p-3 bg-gray-50">
                        <p className="font-medium mb-2">Sản phẩm đã chọn: {selectedProducts.length}</p>
                        {selectedProducts.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {selectedProducts.map(productId => {
                                    const product = products.find(p => p._id === productId);
                                    return (
                                        <div key={productId} className="flex justify-between items-center bg-white p-2 rounded border">
                                            <span>{product ? product.name : productId}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProduct(productId)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">Chưa có sản phẩm nào được chọn. Để trống nếu áp dụng cho tất cả sản phẩm.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                        <input
                            type="text"
                            value={discount.createdAt}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                        <input
                            type="text"
                            value={discount.updatedAt}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/discounts')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Khuyến Mãi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateDiscountForm;