import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const OrderProgressPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const URL_API = process.env.REACT_APP_API_URL; // Sửa lỗi

  useEffect(() => {
    if (orderId) {
      setSuccessMessage(
        "🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý."
      );

      const processOrder = async () => {
        // await updateOrderStatus(); // Cập nhật trạng thái đơn hàng
        await createPayment(); // Tạo payment
        await updateStockAfterPayment(); // Trừ stock sau khi thanh toán
        await clearPaidItemsFromCart(orderId); 
        fetchOrderStatus(); // Lấy trạng thái đơn hàng
      };

      processOrder();

      const interval = setInterval(fetchOrderStatus, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  // const updateOrderStatus = async () => {
  //   try {
  //     await axios.put(`${URL_API}orderClient/update-status`, {
  //       orderId,
  //       status: "Đã thanh toán",
  //     });
  //     console.log(
  //       "✅ Trạng thái đơn hàng đã được cập nhật thành 'Đã thanh toán'"
  //     );
  //   } catch (error) {
  //     console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", error);
  //   }
  // };

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

        console.log("✅ Xoá thành công:", response.data);
    } catch (error) {
        console.error("❌ Lỗi khi xoá sản phẩm trong giỏ hàng:", error.response?.data || error);
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
      await axios.post(`${URL_API}paymentClient/create`, { orderId });
      console.log("Payment đã được tạo!");
    } catch (error) {
      console.error("Lỗi tạo payment:", error);
    }
  };
  const updateStockAfterPayment = async () => {
    try {
      const response = await axios.put(`${URL_API}productClient/update-stock`, {
        orderId,
      });
      console.log(
        "✅ Đã cập nhật số lượng sản phẩm sau khi thanh toán",
        response.data
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng sản phẩm:", error);
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
