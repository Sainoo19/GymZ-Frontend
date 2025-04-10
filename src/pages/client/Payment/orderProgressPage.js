import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderProgressPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const URL_API = process.env.REACT_APP_API_URL;
  const [isProcessing, setIsProcessing] = useState(false);
  

  // 🔥 Dùng useRef để đảm bảo createPayment chỉ gọi 1 lần
  const isPaymentCreated = useRef(false);

  useEffect(() => {
    if (orderId && !isProcessing) {
      console.log("🚀 Running processOrder() once..."); // Debug log
      setSuccessMessage("🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      setIsProcessing(true);
      processOrder();
    }
  }, [orderId]);

  const processOrder = async () => {
    if (!isPaymentCreated.current) {
      isPaymentCreated.current = true; // ✅ Đánh dấu để ngăn gọi API nhiều lần
      await createPayment();
    }

    await clearPaidItemsFromCart(orderId);
    

    if (paymentMethod === "momo") {
      fetchOrderStatus();
    }
  };

  const clearPaidItemsFromCart = async (orderId) => {
    try {
      await axios.delete(`${URL_API}cartClient/clear`, {
        headers: { "Content-Type": "application/json" },
        data: { orderId },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm trong giỏ hàng:", error.response?.data || error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.post(`${URL_API}payment/transaction-status`, { orderId });
      setStatusHistory(response.data.statusHistory);
    } catch (error) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async () => {
    try {
      await axios.post(`${URL_API}paymentClient/create`, { orderId, paymentMethod });
      console.log("✅ Payment created successfully!");
    } catch (error) {
      console.error("Lỗi tạo payment:", error);
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
