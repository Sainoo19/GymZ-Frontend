import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailChangeModal from './EmailChangeModal';

function ProfileContent() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [address, setAddress] = useState({ street: '', city: '', country: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Fetch user profile
        axios.get('http://localhost:3000/users/profile', {
            withCredentials: true // Ensure cookies are sent with the request
        })
            .then(response => {
                const userData = response.data.data;
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
                setPhone(userData.phone);
                setAvatar(userData.avatar);
                setAddress(userData.address || { street: '', city: '', country: '' });
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.put('http://localhost:3000/profileUser/profile', {
                name,
                phone,
                avatar,
                address
            }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            if (response.data.status === "success") {
                setUser(response.data.data);
                alert('Profile updated successfully');
                window.location.reload(); // Reload the page after successful update
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    const handleEmailChange = (newEmail) => {
        setEmail(newEmail);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">Hồ Sơ Của Tôi</h1>
            <p className="text-gray-500 mb-6 text-center">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
                    <img
                        src={avatar}
                        alt="User avatar"
                        className="rounded-full w-32 h-32 border-2 border-gray-300 shadow-sm mb-4"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                        Chọn Ảnh
                    </button>
                    <p className="text-gray-500 text-xs mt-3">
                        Dụng lượng file tối đa 1 MB
                    </p>
                    <p className="text-gray-500 text-xs">Định dạng: .JPEG, .PNG</p>
                </div>
                <div className="flex-1 bg-gray-50 p-8 rounded-lg shadow-lg space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Tên</label>
                        <input
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <p className="text-gray-900 flex items-center">
                            {email}
                            {/* <a href="#" className="text-blue-500 ml-2" onClick={() => setIsModalOpen(true)}>
                                Thay Đổi
                            </a> */}
                            {/* Đổi <a> thành <button> */}
                            <button href="#" className="ml-3 text-blue-500 hover:underline font-semibold" onClick={() => setIsModalOpen(true)}>
                                Thay Đổi
                            </button>
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Số điện thoại</label>
                        <p className="text-gray-900 ">
                            {phone}
                            {/* <a href="#" className="text-blue-500 ml-2">
                                Thay Đổi
                            </a> */}
                            {/* Đổi <a> thành <button> */}
                            <button href="#" className="ml-3 text-blue-500 hover:underline font-semibold">
                                Thay Đổi
                            </button>
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Địa chỉ</label>
                        <p className="text-gray-900">
                            {address.street}, {address.city}, {address.country}
                            {/* <a href="#" className="text-blue-500 ml-2">
                                Thay Đổi
                            </a> */}
                            {/* Đổi <a> thành <button> */}
                            <button href="#" className="ml-3 text-blue-500 hover:underline font-semibold">
                                Thay Đổi
                            </button>
                        </p>
                    </div>
                    <button className="w-full bg-red-500 text-white py-2 rounded-md font-bold hover:bg-red-600 transition" onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
            <EmailChangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEmailChange={handleEmailChange}
            />
        </div>
    );
}

export default ProfileContent;