import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [accountMenuVisible, setAccountMenuVisible] = useState(false);
    const [employee, setEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch employee profile
        axios.get('http://localhost:3000/employees/profile', {
            withCredentials: true // Ensure cookies are sent with the request
        })
            .then(response => {
                setEmployee(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching employee data:', error);
            });
    }, []);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const toggleAccountMenu = () => {
        setAccountMenuVisible(!accountMenuVisible);
    };

    const handleLogoutClick = () => {
        axios.post('http://localhost:3000/auth/logout', {}, {
            withCredentials: true // Ensure cookies are sent with the request
        })
            .then(() => {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                navigate('/');
                window.location.reload(); // Reload the page after navigating to home
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    const defaultAvatar = '/assets/images/avatar.png';

    return (
        <header className="bg-primary text-white p-4 flex justify-between items-center">
            {/* Phần trái */}
            <div className="text-xl font-bold"></div>

            {/* Phần phải */}
            <div className="flex items-center space-x-4">
                {/* Biểu tượng thông báo */}
                <FaBell className="text-xl cursor-pointer" />

                {/* Menu tài khoản */}
                <div className="relative">
                    <img
                        src={employee?.avatar || defaultAvatar}
                        alt="Employee Avatar"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        onClick={toggleAccountMenu}
                    />
                    {accountMenuVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                            <p className="p-4 border-b">Xin chào, {employee?.name}</p>
                            <button className="w-full text-left p-4 hover:bg-gray-200">Thông tin tài khoản</button>
                            <button
                                className="w-full text-left p-4 hover:bg-gray-200"
                                onClick={handleLogoutClick}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;