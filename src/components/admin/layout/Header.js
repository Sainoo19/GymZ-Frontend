import React, { useState, useEffect } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { db } from "../../../firebase"; // Import Firestore

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const Header = ({ setIsSidebarHidden, isSidebarHidden }) => {
  const [accountMenuVisible, setAccountMenuVisible] = useState(false);
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();
  const [newOrders, setNewOrders] = useState(0); // Số đơn hàng mới
  const [notifications, setNotifications] = useState([]);
  const URL_API = process.env.REACT_APP_API_URL;

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    axios
      .get(`${URL_API}employees/profile`, {
        withCredentials: true,
      })
      .then((response) => {
        setEmployee(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  useEffect(() => {
    if (!employee?._id) return; // Kiểm tra nếu employee chưa load xong

    const q = query(
      collection(db, "notifications"),
      where("employee_id", "==", employee._id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notiList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notiList.filter(noti => !noti.isHandled));
      setNewOrders(notiList.length);
    });

    return () => unsubscribe();
  }, [employee]);

  useEffect(() => {
    const unsubscribeFCM = onMessage(messaging, (payload) => {
      console.log("📩 Nhận thông báo từ Firebase:", payload);
      setNotifications((prev) => [payload.notification, ...prev]);
      setNewOrders((prev) => prev + 1);
    });

    return () => unsubscribeFCM();
  }, []);

  const toggleAccountMenu = () => {
    setAccountMenuVisible(!accountMenuVisible);
  };

  const handleLogoutClick = () => {
    axios
      .post(
        `${URL_API}auth/logout`,
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
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

      {/* Phần phải */}
      <div className="flex items-center space-x-4">
        {/* 🔔 Biểu tượng thông báo */}

        <div className="relative">
          <button onClick={toggleNotifications} className="relative">
            <FaBell className="text-2xl cursor-pointer" />
            {newOrders > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {newOrders}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-lg p-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Đơn hàng mới
              </h3>
              {notifications.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.map((order, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={() => navigate(`/admin/orders/${order.orderId}`)} // Điều hướng khi click
                    >
                      <strong>{order.title}</strong>: {order.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 p-2">
                  Không có đơn hàng mới
                </p>
              )}
            </div>
          )}
        </div>

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
