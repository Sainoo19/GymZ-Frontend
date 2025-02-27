import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const HeaderClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by checking the token in cookies
    axios
      .get("http://localhost:3000/users/profile", {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        setUser(response.data.data);

        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      });
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate("/login-user");
  };

  const handleLogoutClick = () => {
    axios
      .post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      )
      .then(() => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  console.log(user);
  const defaultAvatar = "/assets/images/avatar.png";

  const handleCartClick = (event) => {
    navigate("/cart");
};
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
          <span className="ml-2 text-yellow-500 font-bold text-xl">GYM-Z</span>
        </div>
        <div className="flex-grow mx-4">
          <input
            className="w-full py-2 px-4 rounded-full text-gray-800"
            placeholder="Start typing to search"
            type="text"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-yellow-500" onClick={handleCartClick}>
            <i className="fas fa-shopping-cart" ></i>
          </button>
          {isLoggedIn ? (
            <div className="relative">
              <img
                src={user?.avatar || defaultAvatar}
                alt="User Avatar"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Quản lý tài khoản
                  </a>
                  <button
                    onClick={handleLogoutClick}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-yellow-500 text-gray-800 px-6 py-2 rounded hover:bg-yellow-600 transition-all font-bold"
              onClick={handleLoginClick}
            >
              Đăng nhập
            </button>
          )}
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
          <a className="hover:text-white" href="/branches">
            Chi Nhánh
          </a>
          <a className="hover:text-white" href="/about-us">
            Về chúng tôi
          </a>
        </div>
      </nav>
    </header>
  );
};
export default HeaderClient;
