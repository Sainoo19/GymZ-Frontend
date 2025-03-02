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
  const { selectedItems, discountAmount, taxPercent } = location.state || {
    selectedItems: [],
    discountAmount: 0,
    taxPercent:5 ,
  };
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

  const handlePaymentSelection = async (method,amount) => {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Thanh Toán</h1>
      <DeliveryAddress />
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
