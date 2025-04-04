import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmailChangeModal from './EmailChangeModal';
import ChangeAddress from "./ChangeAddressModal";
import { AvatarUploader } from './AvatarUploader';

function ProfileContent() {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [address, setAddress] = useState({ province: '', district: '', ward: '', street: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
                setAddress(userData.address || { province: '', district: '', ward: '', street: '' });
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    const handleSave = async () => {
        try {
            const response = await axios.put('http://localhost:3000/profileUser/myprofile', {
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

    const handleAddressUpdate = (newAddress) => {
        setAddress(newAddress);
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-gray-100 via-white to-gray-200 rounded-2xl shadow-2xl transform transition-all duration-500">
            <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-700 mb-3 animate-fade-in-down">
                Hồ Sơ Của Tôi
            </h1>
            <p className="text-center text-gray-600 mb-10 font-medium">Quản lý thông tin cá nhân của bạn</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="relative flex flex-col items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-gray-100 opacity-10 rounded-xl"></div>
                    <img
                        src={avatar || user.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                        alt="User avatar"
                        className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-md object-cover mb-4 transition-transform duration-300 hover:scale-110"
                    />
                    <AvatarUploader onFileUpload={(url) => setAvatar(url)} />
                    <p className="text-gray-500 text-sm mt-3">Dung lượng tối đa: 1MB</p>
                    <p className="text-gray-500 text-sm mt-1">Định dạng: .JPEG, .PNG</p>
                </div>
                {/* Profile Info Section */}
                <div className="col-span-2 bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-gray-50 opacity-10"></div>
                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Tên</label>
                            <input
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-200"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-gray-900 font-medium">{email}</span>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="text-yellow-600 hover:text-yellow-800 font-semibold transition-all duration-200 hover:scale-105"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Số điện thoại</label>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-gray-900 font-medium">{phone}</span>
                                <button className="text-yellow-600 hover:text-yellow-800 font-semibold transition-all duration-200 hover:scale-105">
                                    Thay đổi
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Địa chỉ</label>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-gray-900 font-medium">
                                    {address.street}, {address.ward}, {address.district}, {address.province}
                                </span>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-yellow-600 hover:text-yellow-800 font-semibold transition-all duration-200 hover:scale-105"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black rounded-lg font-semibold shadow-md hover:shadow-xl hover:from-yellow-600 hover:to-yellow-800 transition-all duration-300 transform hover:scale-105"
                        >
                            Lưu Thay Đổi
                        </button>
                    </div>
                </div>
            </div>
            <EmailChangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onEmailChange={handleEmailChange} />
            <ChangeAddress isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} currentAddress={address} onUpdate={handleAddressUpdate} />
        </div>
    );
}

export default ProfileContent;