import React from 'react';

const HeaderClient = () => {
    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <div className="flex items-center">
                    <img
                        alt="Gym-Z logo with a dumbbell icon"
                        className="h-10 w-10"
                        height="50"
                        src="https://storage.googleapis.com/a1aa/image/TUCdiqaTMKUFywRldIvyyODSZp_7ZOGyqRXnFp9VgVU.jpg"
                        width="50"
                    />
                    <span className="ml-2 text-yellow-500 font-bold text-xl">
                        GYM-Z
                    </span>
                </div>
                <div className="flex-grow mx-4">
                    <input
                        className="w-full py-2 px-4 rounded-full text-gray-800"
                        placeholder="Start typing to search"
                        type="text"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <a className="text-yellow-500" href="/">
                        <i className="fas fa-shopping-cart"></i>
                    </a>
                    <button className="bg-yellow-500 text-gray-800 px-6 py-2 rounded-md hover:bg-yellow-600 transition-all font-bold">
                        Đăng nhập
                    </button>
                </div>
            </div>
            <nav className="bg-gray-800 text-yellow-500">
                <div className="container mx-auto flex justify-center space-x-6 py-2">
                    <a className="hover:text-white" href="/">
                        Trang chủ
                    </a>
                    <a className="hover:text-white" href="/productsclient">
                        Sản phẩm
                    </a>
                    <a className="hover:text-white" href="/">
                        Tin tức
                    </a>
                    <a className="hover:text-white" href="/">
                        Chi Nhánh
                    </a>
                    <a className="hover:text-white" href="/">
                        Về chúng tôi
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default HeaderClient;