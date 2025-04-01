import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderProgressPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const URL_API = process.env.REACT_APP_API_URL; // Sửa lỗi
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (orderId && !isProcessing) {
      setSuccessMessage(
        "🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý."
      );

      setIsProcessing(true);
      processOrder();

      const interval = setInterval(fetchOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const processOrder = async () => {
    if (!isPaymentCreated) {
      setIsPaymentCreated(true); // Đánh dấu đã tạo payment
      await createPayment(); // Tạo payment
    }
    await clearPaidItemsFromCart(orderId);
    fetchOrderStatus();
  };
  
  const clearPaidItemsFromCart = async (orderId) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${URL_API}cartClient/clear`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { orderId },
        withCredentials: true, // Đảm bảo gửi cookie/token nếu có
      });
    } catch (error) {
      console.error(
        "Lỗi khi xoá sản phẩm trong giỏ hàng:",
        error.response?.data || error
      );
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.post(
        `${URL_API}payment/transaction-status`,
        { orderId }
      );
      setStatusHistory(response.data.statusHistory);
    } catch (error) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };
  const createPayment = async () => {
    try {
      await axios.post(`${URL_API}paymentClient/create`, {
        orderId,
        paymentMethod,
      });
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
