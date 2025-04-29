import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateProductCategory = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const [category, setcategory] = useState({
        id: '',
        name: '',
        description: '',
        createdAt: '',
        updatedAt: ''
    });
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchProductCategory = async () => {
            try {
                const response = await axios.get(`${URL_API}productCategory/${id}`);
                const categoryData = response.data.data;
                console.log(categoryData);
                setcategory({
                    ...categoryData,
                    createdAt: new Date(categoryData.createdAt).toISOString(),
                    updatedAt: new Date(categoryData.updatedAt).toISOString()
                });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu danh mục:', error);
            }
        };

        if (id) {
            fetchProductCategory();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setcategory((prevProductCategory) => ({
            ...prevProductCategory,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCategory = {
                ...category,
                updatedAt: new Date().toISOString(),
            };
            await axios.put(`${URL_API}productCategory/update/${id}`, updatedCategory);
            navigate('/admin/productCategories');
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin/productCategories');
      };

    return (
        <div className='bg-background_admin'>
            <h2 className='p-6 block text-xl font-semibold'>Cập nhật thông tin danh mục</h2>
            <div className='w-full flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-11/12 ml-6 mb-16 rounded-2xl bg-white'>
                    <div className='ml-6 flex justify-between'>
                        <div className='mt-4 w-2/4'>
                            <p className='block font-semibold text-base text-gray-400'>
                                Mã danh mục: {category._id}
                            </p>
                        </div>
                        <div className='mt-4 w-2/4'>
                            <div>
                                <p className='block font-semibold text-base text-gray-400'>
                                    Ngày tạo: {new Date(category.createdAt).toLocaleString('vi-VN', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
                                    })}
                                </p>
                            </div>
                            <div className='mt-2'>
                                <p className='block font-semibold text-base text-gray-400'>
                                    Thời gian cập nhật lần cuối: {new Date(category.updatedAt).toLocaleString('vi-VN', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='ml-6 w-2/4'>
                            <div className='mt-1 mb-4'>
                                <label className='block font-semibold text-base'>
                                    Tên danh mục
                                </label>
                                <input
                                    type='text'
                                    placeholder='Nhập tên danh mục'
                                    name='name' value={category.name}
                                    onChange={handleChange}
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Mô tả
                                </label>
                                <input
                                    type='text'
                                    placeholder='Nhập mô tả danh mục'
                                    name='description'
                                    value={category.description}
                                    onChange={handleChange}
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full mb-4'>
                        <div className='flex justify-center'>
                            <button type='submit' className='m-3 p-2 w-1/4 bg-secondary rounded-lg hover:bg-yellow-400 transition'>
                                Cập nhật
                            </button>
                            <button type='button' onClick={handleCancel} className='m-3 p-2 w-1/4 block border border-primary rounded-lg hover:bg-gray-300 transition'>
                                Hủy
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductCategory;