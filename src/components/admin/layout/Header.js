import React, { useState } from 'react';
import { FaBell, FaSearch, FaUser } from 'react-icons/fa';

const Header = () => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [accountMenuVisible, setAccountMenuVisible] = useState(false);

    const toggleSearch = () => {
        setSearchVisible(!searchVisible);
    };

    const toggleAccountMenu = () => {
        setAccountMenuVisible(!accountMenuVisible);
    };

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
                    <FaUser className="text-xl cursor-pointer" onClick={toggleAccountMenu} />
                    {accountMenuVisible && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg">
                            <p className="p-4 border-b">Xin chào, User</p>
                            <button className="w-full text-left p-4 hover:bg-gray-200">Thông tin tài khoản</button>
                            <button className="w-full text-left p-4 hover:bg-gray-200">Đăng xuất</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;