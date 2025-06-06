import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    FaPen, FaBell, FaUser, FaIdCard, FaUniversity,
    FaMapMarkerAlt, FaKey, FaCog, FaLock, FaBox,
    FaTicketAlt, FaCoins, FaShoppingBag, FaDumbbell,
    FaBars, FaTimes
} from 'react-icons/fa';

const navItems = [
    { to: "#", label: "Thông Báo", icon: FaBell, textColor: "text-black" },
    { to: "/profile", label: "Hồ Sơ", icon: FaIdCard, textColor: "text-black" },
    { to: "#", label: "Ngân Hàng", icon: FaUniversity, textColor: "text-black" },
    { to: "#", label: "Địa Chỉ", icon: FaMapMarkerAlt, textColor: "text-black" },
    { to: "/change-password", label: "Đổi Mật Khẩu", icon: FaKey, textColor: "text-black" },
    { to: "#", label: "Cài Đặt Thông Báo", icon: FaCog, textColor: "text-black" },
    { to: "#", label: "Những Thiết Lập Riêng Tư", icon: FaLock, textColor: "text-black" },
    { to: "/my-orders", label: "Lịch Sử Đơn Hàng", icon: FaShoppingBag, textColor: "text-black" },
    { to: "/my-membership", label: "Hội Viên", icon: FaDumbbell, textColor: "text-black" },
    { to: "/gymz-coin", label: "GymZ Xu", icon: FaCoins, textColor: "text-black" }
];

function SidebarProfile({ isMobileOpen, toggleMobileSidebar }) {
    const [user, setUser] = useState(null);
    const location = useLocation();
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch user profile
        axios.get(`${URL_API}users/profile`, {
            withCredentials: true
        })
            .then(response => {
                setUser(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching user profile:', error);
            });
    }, []);

    if (!user) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className={`bg-white shadow-md transition-all duration-300 ${isMobileOpen ? 'fixed inset-0 z-40 overflow-y-auto' : 'hidden md:block md:w-64 lg:w-72'}`}>
            {/* Mobile Close Button */}
            {isMobileOpen && (
                <div className="flex justify-end p-4 md:hidden">
                    <button
                        onClick={toggleMobileSidebar}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
            )}

            <div className="p-4">
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
                            className={`flex items-center p-4 mb-2 rounded-lg transition-all duration-200 
                            ${location.pathname === item.to
                                    ? 'bg-primary text-secondary font-medium shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                                }`}
                            onClick={isMobileOpen ? toggleMobileSidebar : undefined}
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
        </div>
    );
}

export default SidebarProfile;