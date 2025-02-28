import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderProgressPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (orderId) {
      setSuccessMessage("🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      fetchOrderStatus();
      
      // Cập nhật trạng thái đơn hàng mỗi 10 giây
      const interval = setInterval(fetchOrderStatus, 10000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.post("http://localhost:3000/payment/transaction-status", { orderId });
      setStatusHistory(response.data.statusHistory);
    } catch (error) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Theo Dõi Đơn Hàng</h1>
      
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {loading ? (
        <p>Đang tải trạng thái đơn hàng...</p>
      ) : (
        <ul className="border p-4 rounded-md">
          {statusHistory.length > 0 ? (
            statusHistory.map((status, index) => (
              <li key={index} className="py-2 border-b last:border-b-0">
                ✅ {status}
              </li>
            ))
          ) : (
            <p>Không có trạng thái đơn hàng.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default OrderProgressPage;
