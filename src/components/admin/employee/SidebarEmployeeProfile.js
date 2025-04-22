import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FaPen, FaBell, FaUser, FaIdCard, FaUniversity,
    FaMapMarkerAlt, FaKey, FaCog, FaLock, FaBox,
    FaTicketAlt, FaCoins, FaShoppingBag, FaDumbbell
} from 'react-icons/fa';

const navItems = [
    { to: "#", label: "Thông Báo", icon: FaBell, textColor: "text-black" },
    { to: "admin/profile", label: "Hồ Sơ", icon: FaIdCard, textColor: "text-black" },
    { to: "#", label: "Ngân Hàng", icon: FaUniversity, textColor: "text-black" },
    { to: "#", label: "Địa Chỉ", icon: FaMapMarkerAlt, textColor: "text-black" },
    { to: "/change-password-admin", label: "Đổi Mật Khẩu", icon: FaKey, textColor: "text-black" },
    { to: "#", label: "Cài Đặt Thông Báo", icon: FaCog, textColor: "text-black" },
    { to: "#", label: "Những Thiết Lập Riêng Tư", icon: FaLock, textColor: "text-black" },
]

function SidebarProfile() {
    const [user, setUser] = useState(null);
    const location = useLocation(); // Get current location

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
                    <Link to="#" className="text-primary text-sm flex items-center hover:text-secondary transition-colors">
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
                        className={`flex items-center p-4 mb-4 rounded-lg transition-all duration-200 
                        ${location.pathname === item.to
                                ? 'bg-primary text-secondary font-medium shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                            }`}
                    >
                        <item.icon className={`mr-2 ${location.pathname === item.to ? 'text-secondary' : ''}`} />
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