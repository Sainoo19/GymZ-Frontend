import React, { useState, useEffect } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const Header = ({ setIsSidebarHidden, isSidebarHidden }) => {
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();
  const socket = io("http://localhost:3000")
  useEffect(() => {
    axios
      .get("http://localhost:3000/employees/profile", {
        withCredentials: true,
      })
      .then((response) => {
        setEmployee(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const toggleAccountMenu = () => {
    setAccountMenuVisible(!accountMenuVisible);
  };

  const handleLogoutClick = () => {
    axios
      .post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const defaultAvatar = "/assets/images/avatar.png";

  return (
    <header className=" fixed top-0 left-0 w-full bg-primary text-white p-4 flex justify-between items-center z-50">
      {/* Nút mở Sidebar */}
      <button className="" onClick={() => setIsSidebarHidden(!isSidebarHidden)}>
        {isSidebarHidden ? (
          <FaBars className="text-2xl" />
        ) : (
          <FaTimes className="text-2xl" />
        )}
      </button>
      {/* Tiêu đề */}
      <div className="text-xl font-bold">Dashboard</div>

      {/* Phần phải */}
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl cursor-pointer" />

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
              <button className="w-full text-left p-4 hover:bg-gray-200">
                Thông tin tài khoản
              </button>
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
