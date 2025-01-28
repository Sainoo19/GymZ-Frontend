import React from 'react';
import Table from '../../components/admin/Table';

const Order = () => {
    const columns = [
        { field: '_id', label: 'ORDER ID' },
        { field: 'user_id', label: 'USER ID' },
        { field: 'totalPrice', label: 'TOTAL PRICE' },
        { field: 'status', label: 'STATUS' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
    ];

    const data = [
        {
            _id: "order001",
            user_id: "user001",
            totalPrice: 150,
            status: "Processing",
            createdAt: "2024-01-06T01:32:00",
            updatedAt: "2024-01-06T01:32:00",
            items: [
                { product_id: "prod001", quantity: 2, price: 50 },
                { product_id: "prod002", quantity: 1, price: 50 },
            ],
        },
        {
            _id: "order002",
            user_id: "user002",
            totalPrice: 200,
            status: "Completed",
            createdAt: "2024-01-07T15:06:00",
            updatedAt: "2024-01-07T15:06:00",
            items: [
                { product_id: "prod003", quantity: 4, price: 50 },
            ],
        },
        {
            _id: "order003",
            user_id: "user003",
            totalPrice: 100,
            status: "Cancelled",
            createdAt: "2024-06-12T09:33:00",
            updatedAt: "2024-06-12T09:33:00",
            items: [
                { product_id: "prod004", quantity: 2, price: 50 },
            ],
        },
    ];

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Đơn Hàng</h1>
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all">
                    Thêm Đơn Hàng
                </button>
            </div>
            <Table columns={columns} data={data} />
        </div>
    );
};

export default Order;