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
        <div className="w-3/4 bg-white p-8">
            <h1 className="text-2xl font-bold mb-2">Hồ Sơ Của Tôi</h1>
            <p className="text-gray-600 mb-6">
                Quản lý thông tin hồ sơ để bảo mật tài khoản
            </p>
            <div className="flex">
                <div className="w-2/3">
                    <div className="mb-4">
                        <label className="block text-gray-700">Tên</label>
                        <input
                            className="w-full border border-gray-300 p-2"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <p className="text-gray-900">
                            {email}
                            <a href="#" className="text-blue-500 ml-2" onClick={() => setIsModalOpen(true)}>
                                Thay Đổi
                            </a>
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Số điện thoại</label>
                        <p className="text-gray-900">
                            {phone}
                            <a href="#" className="text-blue-500 ml-2">
                                Thay Đổi
                            </a>
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Địa chỉ</label>
                        <p className="text-gray-900">
                            {address.street}, {address.city}, {address.country}
                            <a href="#" className="text-blue-500 ml-2">
                                Thay Đổi
                            </a>
                        </p>
                    </div>
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleSave}>
                        Lưu
                    </button>
                </div>
                <div className="w-1/3 flex flex-col items-center">
                    <img
                        src={avatar}
                        alt="User avatar"
                        className="rounded-[40px] mb-4 w-[100px] h-[100px]"
                    />
                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                        Chọn Ảnh
                    </button>
                    <p className="text-gray-600 text-sm mt-2">
                        Dụng lượng file tối đa 1 MB
                    </p>
                    <p className="text-gray-600 text-sm">Định dạng: .JPEG, .PNG</p>
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