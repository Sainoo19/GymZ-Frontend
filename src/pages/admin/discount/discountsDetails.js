import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDiscountForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [discount, setDiscount] = useState(null);

    useEffect(() => {
        const fetchDiscount = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/discounts/${id}`);
                setDiscount(response.data.data); // Access the data field
            } catch (error) {
                console.error('Error fetching discount:', error);
            }
        };

        fetchDiscount();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDiscount({
            ...discount,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedDiscount = {
                ...discount,
                updatedAt: new Date().toISOString(), // Update the updatedAt field
            };
            await axios.put(`http://localhost:3000/discounts/update/${id}`, updatedDiscount);
            navigate('/discounts'); // Navigate back to the discounts list
        } catch (error) {
            console.error('Error updating discount:', error);
        }
    };

    if (!discount) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cập Nhật Khuyến Mãi</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block text-sm font-medium text-gray-700">Mã Khuyến Mãi</label>
                    <input
                        type="text"
                        name="code"
                        value={discount.code}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phần Trăm Giảm Giá</label>
                    <input
                        type="number"
                        name="discountPercent"
                        value={discount.discountPercent}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Bắt Đầu</label>
                    <input
                        type="date"
                        name="validFrom"
                        value={discount.validFrom}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Kết Thúc</label>
                    <input
                        type="date"
                        name="validUntil"
                        value={discount.validUntil}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giới Hạn Sử Dụng</label>
                    <input
                        type="number"
                        name="usageLimit"
                        value={discount.usageLimit}
                        onChange={handleInputChange}
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
                <div>
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