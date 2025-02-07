import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../../components/admin/Table';

const Payment = () => {
    const [columns] = useState([
        { field: '_id', label: 'PAYMENT ID' },
        { field: 'orderId', label: 'ORDER ID' },
        { field: 'user_id', label: 'USER ID' },
        { field: 'amount', label: 'AMOUNT' },
        { field: 'paymentMethod', label: 'PAYMENT METHOD' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ]);

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/payments/all');
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

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Hóa Đơn</h1>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all">
                    Thêm Hóa Đơn
                </button>
            </div>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default Payment;