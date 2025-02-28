import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  // Xử lý callback khi thanh toán MoMo thành công
  useEffect(() => {
    const status = searchParams.get("status");
    const orderId = searchParams.get("orderId");
  
    if (status === "success" && orderId) {
      navigate(`/`);
    }
  }, [searchParams, navigate]);

  const handleTotalAmount = (amount) => {
    setTotalAmount(amount);
  };

  const handlePaymentSelection = async (method) => {
    setSelectedPayment(method);

    if (method === "momo") {
      try {
        const response = await axios.post(`${URL_API}payment/momopayment`, {
          amount: totalAmount,
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Thanh Toán</h1>
      <DeliveryAddress />
      <ProductsOrdered onTotalAmountChange={handleTotalAmount} />
      <PaymentMethods onSelectPayment={handlePaymentSelection} totalAmount={totalAmount} />
    </div>
  );
};

export default CheckOutPage;
