import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../../firebase";
import { db } from "../../../firebase"; // Import Firestore
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import close_ring from "../../../assets/icons/close_ring.svg";
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
  const notificationRef = useRef(null); // Tham chiếu đến vùng thông báo
  const bellButtonRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [orderNotifications, setOrderNotifications] = useState([]);
  const [paymentNotifications, setPaymentNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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
    if (!employee?._id) return;

    const q = query(
      collection(db, "notifications"),
      where("employee_id", "==", employee._id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🔥 All notis:", all);
      const orders = all.filter(
        (noti) => noti.type === "order" && !noti.isHandled
      );
      const payments = all.filter(
        (noti) => noti.type === "payment" && !noti.isHandled
      );
      setOrderNotifications(orders);
      setPaymentNotifications(payments);
      setNewOrders(orders.length + payments.length);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        bellButtonRef.current &&
        !bellButtonRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          <button
            ref={bellButtonRef}
            onClick={toggleNotifications}
            className="relative"
          >
            <FaBell className="text-2xl cursor-pointer" />
            {newOrders > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {newOrders}
              </span>
            )}
          </button>
          {showNotifications && (
            <div
              ref={notificationRef}
              className="absolute right-0 mt-2 w-96 bg-white text-black shadow-lg rounded-lg p-2  z-50"
            >
              {/* Tabs */}
              <div className="flex border-b mb-2">
                <button
                  className={`flex-1 p-2 text-sm font-semibold ${
                    activeTab === "orders"
                      ? "border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  Đơn hàng mới
                </button>
                <button
                  className={`flex-1 p-2 text-sm font-semibold ${
                    activeTab === "payments"
                      ? "border-b-2 border-blue-500"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("payments")}
                >
                  Thông báo thanh toán
                </button>
              </div>

              {/* Danh sách thông báo */}
              <div className="max-h-96 overflow-y-auto">
                {activeTab === "orders" ? (
                  orderNotifications.length > 0 ? (
                    <ul>
                      {orderNotifications.map((order, index) => (
                        <li
                          key={index}
                          className={`p-2 items-center hover:bg-gray-100 rounded cursor-pointer flex justify-between ${
                            order.title === "Đã huỷ"
                              ? "text-red-500 "
                              : !order.isRead
                              ? "font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          <div
                            className=" "
                            onClick={async () => {
                              try {
                                navigate(`/admin/orders/${order.orderId}`);
                                await updateDoc(
                                  doc(db, "notifications", order.id),
                                  { isRead: true }
                                );

                                setOrderNotifications((prev) =>
                                  prev.map((item) =>
                                    item.id === order.id
                                      ? { ...item, isRead: true }
                                      : item
                                  )
                                );
                              } catch (err) {
                                console.error(
                                  "Lỗi cập nhật isRead cho order:",
                                  err
                                );
                              }
                            }}
                          >
                            
                            <p className="font-semibold">{order.title}:</p> 
                            <p>{order.message}</p>
                          </div>

                          {/* Nếu đơn hàng bị huỷ thì hiện nút xoá */}
                          {order.title === "Đã huỷ" && (
                            <button
                              onClick={async (e) => {

                                e.stopPropagation(); // ngăn click lan sang navigate
                                try {
                                  await deleteDoc(
                                    doc(db, "notifications", order.id)
                                  );
                                  setOrderNotifications((prev) =>
                                    prev.filter((item) => item.id !== order.id)
                                  );
                                } catch (error) {
                                  console.error(
                                    "Lỗi khi xoá thông báo:",
                                    error
                                  );
                                }
                              }}
                              className="text-red-600 hover:text-red-800 ml-2 text-sm"
                            >
                               <img
                              src={close_ring}
                              alt="close"
                              className={`w-4 h-4 text-red-500`}
                            />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 p-2">
                      Không có đơn hàng mới
                    </p>
                  )
                ) : paymentNotifications.length > 0 ? (
                  <ul>
                    {paymentNotifications.map((noti, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 rounded flex justify-between items-start"
                      >
                        <div
                          className={`flex-1 cursor-pointer ${
                            !noti.isRead ? "font-medium" : "text-gray-500"
                          }`}
                          onClick={async () => {
                            try {
                              // Điều hướng đến chi tiết thanh toán
                              navigate(`/admin/payments/${noti.PaymentId}`);

                              // ✅ Cập nhật Firestore
                              await updateDoc(
                                doc(db, "notifications", noti.id),
                                {
                                  isRead: true,
                                }
                              );

                              // ✅ Cập nhật state React
                              setPaymentNotifications((prev) =>
                                prev.map((item) =>
                                  item.id === noti.id
                                    ? { ...item, isRead: true }
                                    : item
                                )
                              );
                            } catch (error) {
                              console.error("Lỗi khi cập nhật isRead:", error);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <div>
                              <strong>{noti.title} :</strong>
                              <p className="text-sm">{noti.message}</p>
                            </div>

                            <img
                              src={close_ring}
                              alt="close"
                              className={`w-4 h-4  ${
                                noti.isRead ? "block" : "hidden"
                              }`}
                              onClick={() => setConfirmDeleteId(noti.id)}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 p-2">
                    Không có thông báo thanh toán
                  </p>
                )}
              </div>
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
              <button
                className="w-full text-left p-4 hover:bg-gray-200"
                onClick={() => {
                  navigate("/admin/profile"); // Điều hướng đến trang profile
                  setAccountMenuVisible(false); // Ẩn menu
                }}
              >
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
