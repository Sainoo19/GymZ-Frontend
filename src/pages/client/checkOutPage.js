import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams,useLocation  } from "react-router-dom";
import DeliveryAddress from "../../components/clients/checkout/deliveryAddress";
import ProductsOrdered from "../../components/clients/checkout/productsOrdered";
import PaymentMethods from "../../components/clients/checkout/paymentMethod";
import axios from "axios";

const CheckOutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const URL_API = process.env.REACT_APP_API_URL;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null); // Lưu thông tin giao hàng
  const [orderId, setOrderId] = useState(null); // Lưu orderId sau khi tạo đơn hàng
  const [timeLeft, setTimeLeft] = useState( 10); // 15 phút (900 giây)

  const { selectedItems, discountAmount, taxPercent } = location.state || {
    selectedItems: [],
    discountAmount: 0,
    taxPercent:5 ,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL_API}userClient/inforDelivery`, {
          withCredentials: true,
        });
        setUserInfo(response.data.data);
        console.log("check",userInfo);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giao hàng:", error);
      }
    };

    fetchUserData();
  }, []);

  // Gọi API tạo đơn hàng sau khi lấy thông tin giao hàng & tổng tiền
  useEffect(() => {
    if (!userInfo || totalAmount === 0 || selectedItems.length === 0) return;

    const createOrder = async () => {
      try {
        const response = await axios.post(
          `${URL_API}orderClient/create`,
          {
            user_id: userInfo._id, // ID người dùng
            totalPrice: totalAmount,
            status: "Chờ xác nhận",
            deliveryPhoneNumber: userInfo.phone, 
            deliveryAdress: `${userInfo.address.street}, ${userInfo.address.city}, ${userInfo.address.country}`,
            items: selectedItems,
          },
          {
            withCredentials: true, // ✅ Thêm để gửi cookie cùng request
          }
        );

        if (response.data.order) {
          setOrderId(response.data.order._id);
          console.log("✅ Đơn hàng đã tạo:", response.data.order);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tạo đơn hàng:", error);
      }
    };

    createOrder();
}, [userInfo, totalAmount, selectedItems]);





  // Xử lý callback khi thanh toán MoMo thành công
  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
  
    if (status === "success" && orderId) {
      navigate(`/order-progress?orderId=${orderId}`); // Chuyển đến trang theo dõi đơn hàng
    }
  }, [searchParams, navigate]);
  
  const handleTotalAmount = (amount) => {
    setTotalAmount(amount);
  };

  const handlePaymentSelection = async (method,amount, orderId) => {
    setSelectedPayment(method);

    if (method === "momo") {
      try {
        const response = await axios.post(`${URL_API}payment/momopayment`, {
          amount,
        });

        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl; // Chuyển hướng đến trang MoMo
        } else {
          alert("Không thể tạo thanh toán MoMo");
        }
      } catch (error) {
        console.error("Lỗi khi gọi API MoMo:", error);
        alert("Lỗi thanh toán MoMo");
      }
    }
  };
  // useEffect(() => {
  //   if (!orderId) return;

  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTime) => {
  //       if (prevTime <= 1) {
  //         clearInterval(timer);
  //         cancelOrder();
  //         return 0;
  //       }
  //       return prevTime - 1;
  //     });
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [orderId]);
  const cancelOrder = async () => {
    try {
      await axios.put(
        `${URL_API}orderClient/cancel/${orderId}`,
        { status: "Đã hủy" },
        { withCredentials: true }
      );
      console.log("🚨 Đơn hàng đã bị hủy do quá thời gian thanh toán.");
    } catch (error) {
      console.error("❌ Lỗi khi hủy đơn hàng:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Thanh Toán</h1>
      {/* {orderId && (
        <div className="text-center text-red-600 font-bold mb-4">
          ⏳ Thanh toán trong: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      )} */}
      <DeliveryAddress user = {userInfo} />
      <ProductsOrdered 
  onTotalAmountChange={(amount) => {
    console.log("🛒 Tổng tiền cập nhật:", amount);
    setTotalAmount(amount);
  }}
  selectedItems={selectedItems}
  discountAmount={discountAmount}
  taxPercent={taxPercent}
/>
<PaymentMethods onSelectPayment={(method) => handlePaymentSelection(method, totalAmount)} totalAmount={totalAmount} />
</div>
  );
};

export default CheckOutPage;
