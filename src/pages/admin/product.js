import React from 'react';
import Table from '../../components/admin/Table';

const Product = () => {
    const columns = [

        { field: 'name', label: 'NAME' },
        { field: 'description', label: 'DESCRIPTION' },
        { field: 'category_id', label: 'CATEGORY ID' },
        { field: 'price', label: 'PRICE' },
        { field: 'stock', label: 'STOCK' },
        { field: 'images', label: 'IMAGES' },
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
        { field: 'status', label: 'STATUS' },
    ];

    const data = [
        {

            name: "Product 1",
            description: "Description for product 1",
            category_id: "cat001",
            price: 100,
            stock: 50,
            images: ["image1.jpg", "image2.jpg"],
            createdAt: "2024-01-06T01:32:00",
            updatedAt: "2024-01-06T01:32:00",
            status: "Published",
        },
        {

            name: "Product 2",
            description: "Description for product 2",
            category_id: "cat002",
            price: 200,
            stock: 30,
            images: ["image3.jpg", "image4.jpg"],
            createdAt: "2024-01-07T15:06:00",
            updatedAt: "2024-01-07T15:06:00",
            status: "Processing",
        },
        {

            name: "Product 3",
            description: "Description for product 3",
            category_id: "cat003",
            price: 150,
            stock: 20,
            images: ["image5.jpg", "image6.jpg"],
            createdAt: "2024-06-12T09:33:00",
            updatedAt: "2024-06-12T09:33:00",
            status: "Published",
        },
    ];

    return (
        <div>

            <Table columns={columns} data={data} />
        </div>
    );
};

export default Product;