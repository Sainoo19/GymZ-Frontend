import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPen, FaBell, FaUser, FaIdCard, FaUniversity, FaMapMarkerAlt, FaKey, FaCog, FaLock, FaBox, FaTicketAlt, FaCoins } from 'react-icons/fa';

const navItems = [
    { to: "#", label: "Thông Báo", icon: FaBell, textColor: "text-black" },
    { to: "/profile", label: "Hồ Sơ", icon: FaIdCard, textColor: "text-black" },
    { to: "#", label: "Ngân Hàng", icon: FaUniversity, textColor: "text-black" },
    { to: "#", label: "Địa Chỉ", icon: FaMapMarkerAlt, textColor: "text-black" },
    { to: "/change-password", label: "Đổi Mật Khẩu", icon: FaKey, textColor: "text-black" },
    { to: "#", label: "Cài Đặt Thông Báo", icon: FaCog, textColor: "text-black" },
    { to: "#", label: "Những Thiết Lập Riêng Tư", icon: FaLock, textColor: "text-black" },
    { to: "/my-orders", label: "Đơn Mua", icon: FaBox, textColor: "text-black" },
    { to: "#", label: "Kho Voucher", icon: FaTicketAlt, textColor: "text-black" },
    { to: "/gymz-coin", label: "Shopee Xu", icon: FaCoins, textColor: "text-black" }
];

function SidebarProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user profile
        axios.get('http://localhost:3000/users/profile', {
            withCredentials: true // Ensure cookies are sent with the request
        })
            .then(response => {
                setUser(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-4 min-h-screen">
            <div className="flex items-center mb-6">
                <img
                    src={user.avatar}
                    alt="User avatar"
                    className="rounded-full w-10 h-10"
                />
                <div className="ml-4">
                    <p className="font-bold">{user.name}</p>
                    <Link to="#" className="text-blue-500 text-sm flex items-center">
                        <FaPen className="mr-1" />
                        Sửa Hồ Sơ
                    </Link>
                </div>
            </div>

            <nav>
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.to}
                        className={`flex items-center p-4 mb-4 rounded-lg hover:bg-gray-100 ${item.textColor || 'text-gray-700'} hover:text-red-500 hover:text-lg`}
                    >
                        <item.icon className="mr-2" />
                        {item.badge && (
                            <span className={`rounded-full px-2 py-1 text-xs mr-2 ${item.badgeColor}`}>
                                {item.badge}
                            </span>
                        )}
                        <span>{item.label}</span>
                        {item.badgeNew && (
                            <span className={`rounded-full px-2 py-1 text-xs ml-2 ${item.badgeColor}`}>
                                {item.badgeNew}
                            </span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default SidebarProfile;