import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';

const Order = () => {
    const [columns] = useState([
        { field: '_id', label: 'ORDER ID' },
        { field: 'user_id', label: 'USER ID' },
        { field: 'totalPrice', label: 'TOTAL PRICE' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);

    const [data, setData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/orders/all');
                if (Array.isArray(response.data.data)) {
                    setData(response.data.data);
                } else {
                    console.error('API response data is not an array:', response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (id) => {
        navigate(`/orders/${id}`);
    };

    const handleDelete = (id) => {
        // Implement delete functionality here
        console.log('Delete order with ID:', id);
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Đơn Hàng</h1>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all">
                    Thêm Đơn Hàng
                </button>
            </div>
            <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default Order;