import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBranchForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [branch, setBranch] = useState(null);

    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/branches/${id}`);
                setBranch(response.data.data); // Access the data field
            } catch (error) {
                console.error('Error fetching branch:', error);
            }
        };

        fetchBranch();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBranch({
            ...branch,
            [name]: value
        });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setBranch({
            ...branch,
            address: {
                ...branch.address,
                [name]: value
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedBranch = {
                ...branch,
                updatedAt: new Date().toISOString(), // Update the updatedAt field
            };
            await axios.put(`http://localhost:3000/branches/update/${id}`, updatedBranch);
            navigate('/branches'); // Navigate back to the branches list
        } catch (error) {
            console.error('Error updating branch:', error);
        }
    };

    if (!branch) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Cập Nhật Chi Nhánh</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                        type="text"
                        value={branch._id}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên Chi Nhánh</label>
                    <input
                        type="text"
                        name="name"
                        value={branch.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                    <input
                        type="text"
                        name="phone"
                        value={branch.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mã Quản Lý</label>
                    <input
                        type="text"
                        name="manager_id"
                        value={branch.manager_id}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
                    <select
                        name="status"
                        value={branch.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Địa Chỉ</label>
                    <input
                        type="text"
                        name="street"
                        placeholder="Đường"
                        value={branch.address.street}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="Thành phố"
                        value={branch.address.city}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                        type="text"
                        name="country"
                        placeholder="Quốc gia"
                        value={branch.address.country}
                        onChange={handleAddressChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                    <input
                        type="text"
                        value={branch.createdAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                    <input
                        type="text"
                        value={branch.updatedAt}
                        readOnly
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cập Nhật Chi Nhánh
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateBranchForm;