import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [shippingFee, setShippingFee] = useState(null);

  const { selectedItems, discountAmount, taxPercent } = location.state || {
    selectedItems: [],
    discountAmount: 0,
    taxPercent: 5,
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${URL_API}userClient/inforDelivery`, {
          withCredentials: true,
        });
        setUserInfo(response.data.data);
        console.log("check", userInfo);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin giao hàng:", error);
      }
    };

    fetchUserData();
  }, []);

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
  const handlePaymentSelection = (method, amount) => {
    console.log("Phương thức thanh toán:", method, "Số tiền:", amount);
  };
  const cancelOrder = async () => {
    try {
      await axios.put(
        `${URL_API}orderClient/cancel/${orderId}`,
        { status: "Đã hủy" },
        { withCredentials: true }
      );
      console.log(" Đơn hàng đã bị hủy do quá thời gian thanh toán.");
    } catch (error) {
      console.error(" Lỗi khi hủy đơn hàng:", error);
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
      <DeliveryAddress user={userInfo} setDeliveryAddress={setDeliveryAddress} />
    
      
      <ProductsOrdered
        onTotalAmountChange={(amount) => {
          setTotalAmount(amount);
        }}
        selectedItems={selectedItems}
        discountAmount={discountAmount}
        taxPercent={taxPercent}
        deliveryAddress={deliveryAddress} 
        shippingFee={shippingFee}
        setShippingFee={setShippingFee}
      />
      <PaymentMethods
        totalAmount={totalAmount}
        userInfo={userInfo}
        selectedItems={selectedItems}
        onSelectPayment={handlePaymentSelection} 
        deliveryAddress={deliveryAddress} 
        shippingFee={shippingFee}
      />
    </div>
  );
};

export default CheckOutPage;
