import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FileDropUser } from './FileDropUser';

const AddUserForm = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        status: 'Active',
        role: 'User',   
        address: { street: '', city: '', country: '' },
        createdAt: '',
        updateAt: ''
    });

    const [selected, setSelected] = useState('');
    const statusOption = ['Active', 'Inactive']
    const roleOption = ['User', 'Silver', 'Gold']
    const [newFileName, setNewFileName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            address: {
                ...prevUser.address,
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const newUser = {
                ...user,
                avatar: newFileName || user.avatar,
                createdAt: user.createdAt && user.createdAt !== "" ? user.createdAt : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            console.log("Dữ liệu gửi đi:", newUser);

            const response = await axios.post('http://localhost:3000/users/create', newUser);
            console.log('User created successfully', response.data);
            navigate('/users');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        navigate('/users'); // Quay lại trang danh sách
    };

    const getAvatarURL = (fileName) => {
        if (!fileName)
          return "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"; // Ảnh mặc định
        return `https://firebasestorage.googleapis.com/v0/b/gymz-image.firebasestorage.app/o/users%2F${encodeURIComponent(
          fileName
        )}?alt=media&token=b6198647-fb1c-4852-a628-9a6c5882f7a7`;
    };

    return (
        <div className='bg-background_admin'>
            <h2 className='p-6 block text-xl font-semibold'>Thêm khách hàng</h2>
            <div className='w-full flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-11/12 ml-6 mb-16 rounded-2xl bg-white'>
                    <div className='flex'>
                        <div className='ml-6 w-2/4'>
                            <div className='mt-1 mb-4'>
                                <label className='block font-semibold text-base'>
                                    Tên khách hàng
                                </label>
                                <input 
                                    type='text' 
                                    placeholder='Nhập tên khách hàng'
                                    name='name' value={user.name} 
                                    onChange={handleChange} 
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Email
                                </label>
                                <input 
                                    type='email'
                                    placeholder='Nhập email khách hàng'
                                    name='email' 
                                    value={user.email} 
                                    onChange={handleChange} 
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Mật khẩu
                                </label>
                                <input 
                                    type='password'
                                    name='password' 
                                    value={user.password} 
                                    onChange={handleChange} 
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 bg-gray-200 shadow-sm'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Số điện thoại
                                </label>
                                <input 
                                    type='text'
                                    placeholder='Nhập số điện thoại khách hàng'
                                    name='phone'
                                    value={user.phone} 
                                    onChange={handleChange} 
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Status
                                </label>
                                <select 
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className='mt-2 border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option disabled>
                                        Tình trạng khách hàng
                                    </option>
                                    {statusOption.map((status, index) => (
                                        <option key={index} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Hạng mức khách hàng
                                </label>
                                <select 
                                    value={selected}
                                    onChange={(e) => setSelected(e.target.value)}
                                    className='mt-2 border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option disabled>
                                        Hạng mức khách hàng
                                    </option>
                                    {roleOption.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Địa chỉ
                                </label>
                                <input 
                                    type='text'
                                    name='street'
                                    value={user.address.street} 
                                    onChange={handleAddressChange} 
                                    placeholder='Số nhà, đường'
                                    className='mt-2 w-11/12 px-3 py-2 border rounded'
                                />
                                <input 
                                    type='text'
                                    name='city'
                                    value={user.address.city} 
                                    onChange={handleAddressChange} 
                                    placeholder='Thành phố' 
                                    className='mt-2 w-11/12 px-3 py-2 border rounded'
                                />
                                <input 
                                    type='text'
                                    name='country'
                                    value={user.address.country} 
                                    onChange={handleAddressChange} 
                                    placeholder='Quốc gia'
                                    className='mt-2 w-11/12 px-3 py-2 border rounded'
                                />
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <label className="block font-medium">Ảnh đại diện</label>
                            <div className="flex justify-center w-full">
                                <img
                                src={getAvatarURL(newFileName || user.avatar)}
                                alt="Avatar"
                                className="w-24 h-24 rounded mb-2"
                                />
                            </div>
                            <FileDropUser onFileUpload={setNewFileName} />
                        </div>
                    </div>
                    
                    <div className='w-full mb-4'>
                        <div className='flex justify-center'>
                            <button type='submit' className='m-3 p-2 w-1/4 bg-secondary rounded-lg hover:bg-yellow-400 transition'>
                                Lưu
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

export default AddUserForm;