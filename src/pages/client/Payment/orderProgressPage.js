import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const OrderProgressPage = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");
  const URL_API = process.env.REACT_APP_API_URL;

  const [status, setStatus] = useState("Đang xử lý...");

  useEffect(() => {
    if (orderId) {
      const fetchOrderStatus = async () => {
        try {
          const response = await axios.post(`${URL_API}payment/transaction-status`, { orderId });
          setStatus(response.data.status);
        } catch (error) {
          console.error("Lỗi khi lấy trạng thái đơn hàng:", error);
        }
      };

      fetchOrderStatus();

      // Cập nhật trạng thái đơn hàng theo thời gian thực (mỗi 5 giây)
      const interval = setInterval(fetchOrderStatus, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Tiến trình đơn hàng</h1>
      <div className="p-4 border rounded-lg bg-white text-center">
        <p className="text-lg font-semibold">{status}</p>
      </div>
    </div>
  );
};

export default OrderProgressPage;
