import { useState } from "react";
import { FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import axios from "axios";

const PaymentMethods = ({ onSelectPayment, totalAmount }) => {
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const URL_API = process.env.REACT_APP_API_URL;

  const paymentOptions = [
    { id: "cash", label: "Tiền mặt", icon: <FaMoneyBillWave size={20} /> },
    { id: "momo", label: "MoMo", icon: <FaMobileAlt size={20} /> },
  ];

  const handleSelect = async (method) => {
    setSelectedMethod(method);
    onSelectPayment(method,totalAmount);

    if (method === "momo") {
      try {
        const response = await axios.post(`${URL_API}payment/momopayment`, {
          amount: totalAmount,
        });

        if (response.data && response.data.payUrl) {
          window.location.href = response.data.payUrl; // Chuyển hướng MoMo
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
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-3">Chọn phương thức thanh toán</h2>
      <div className="flex flex-col gap-3">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
              selectedMethod === option.id ? "border-blue-500 bg-blue-100" : "border-gray-300"
            }`}
            onClick={() => handleSelect(option.id)}
          >
            {option.icon}
            <span className="text-md">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;
