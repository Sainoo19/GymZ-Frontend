import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../../components/admin/Table';
import { useNavigate } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const columns = [
        { field: '_id', label: 'USER ID' },
        { field: 'name', label: 'NAME' },
        { field: 'address', label: 'ADDRESS'},
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
        { field: 'status', label: 'STATUS' },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/all');
                console.log('Fetched Data:', response.data);
    
                // Kiểm tra xem response.data.data có tồn tại và có phải là mảng không
                if (Array.isArray(response.data.data)) {
                    setUsers(response.data.data);
                } else {
                    setUsers([]); // Đảm bảo set giá trị mặc định là mảng
                    console.error("API response does not contain an array:", response.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    
    const handleEdit = (id) => {
        navigate(`/users/${id}`);
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất cả khách hàng</h1>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all">
                    Thêm khách hàng
                </button>
            </div>
            {/* Hiển thị trạng thái loading hoặc lỗi */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : error ? (
                <p className="text-red-500">Lỗi: {error}</p>
            ) : (
                <Table columns={columns} 
                data={users.map(user => ({
                    ...user,
                    address: user.address
                        ? `${user.address.street}, ${user.address.city}, ${user.address.country}`
                        : 'N/A'
                }))}
                onEdit={handleEdit}
                />
            )
            }
        </div>
    );
};

export default User;