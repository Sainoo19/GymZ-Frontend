import { useState } from "react";
import { FaMoneyBillWave, FaMobileAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import MomoBadge from "../../../assets/icons/MomoBadge.svg";
import CODShipmentBadge from "../../../assets/icons/CODShipmentBadge.svg";

const PaymentMethods = ({
  totalAmount,
  selectedItems,
  userInfo,
  onSelectPayment,
  deliveryAddress,
  shippingFee,
}) => {
  const [selectedMethod, setSelectedMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook điều hướng
  const URL_API = process.env.REACT_APP_API_URL;
  const paymentOptions = [
    {
      id: "COD",
      label: "Thanh toán khi nhận hàng (COD)",
      icon: <img src={CODShipmentBadge} alt="MoMo" width={50} height={20} />,
    },
    {
      id: "MoMo",
      label: "MoMo",
      icon: <img src={MomoBadge} alt="MoMo" width={50} height={20} />,
    },
  ];

  const handleSelect = (method) => {
    setSelectedMethod(method);
  };

  const handlePurchase = async () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    if (
      !userInfo ||
      totalAmount === 0 ||
      !Array.isArray(selectedItems) ||
      selectedItems.length === 0
    ) {
      alert("Thông tin đơn hàng không hợp lệ!");
      return;
    }
    let localFee = totalAmount - shippingFee.fee.fee;
    setLoading(true);
    try {
      console.log("Gửi yêu cầu tạo đơn hàng...");

      const orderResponse = await axios.post(
        `${URL_API}orderClient/create`,
        {
          user_id: userInfo._id,
          totalPrice: localFee,
          status: "Đặt hàng thành công",
          paymentMethod: selectedMethod,
          deliveryAddress: {
            name: deliveryAddress.name,
            phone: deliveryAddress.phone,
            street: deliveryAddress.street || "",
            wardName: deliveryAddress.ward || "",
            districtName: deliveryAddress.district || "",
            provinceName: deliveryAddress.province || "",
          },
          items: selectedItems,
          shippingFee: shippingFee.fee.fee,
        },
        { withCredentials: true }
      );

      if (orderResponse.data.order) {
        const orderId = orderResponse.data.order._id;
        onSelectPayment(selectedMethod, totalAmount);

        if (selectedMethod === "MoMo") {
          const momoResponse = await axios.post(
            `${URL_API}payment/momopayment`,
            { amount: totalAmount, orderId: orderId, selectedMethod },
            { withCredentials: true }
          );

          if (momoResponse.data?.resultCode === 0) {
            window.location.href = momoResponse.data.payUrl;
          } else {
            alert("Không thể tạo thanh toán MoMo, vui lòng thử lại!");
          }
        } else {
          await axios.put(`${URL_API}orderClient/update-status`, {
            orderId,
            status: "Đặt hàng thành công",
          });

          alert(
            "Đơn hàng đã được tạo thành công! Vui lòng thanh toán khi nhận hàng."
          );
          navigate(`/order-progress?orderId=${orderId}&paymentMethod=${selectedMethod}`);
        }
      } else {
        alert("Không thể tạo đơn hàng!");
      }
    } catch (error) {
      console.error(
        "Lỗi khi tạo đơn hàng:",
        error?.response?.data || error.message
      );
      alert("Lỗi khi tạo đơn hàng! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border  mt-3 rounded-lg bg-white">
      <h2 className="text-lg font-semibold mb-3">
        Chọn phương thức thanh toán
      </h2>
      <div className="flex flex-col gap-3">
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${selectedMethod === option.id
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300"
              }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={() => handleSelect(option.id)}
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            {option.icon}
            <span className="text-md">{option.label}</span>
          </label>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-primary text-white rounded w-full hover:bg-secondary hover:text-primary transition disabled:bg-gray-400"
        onClick={handlePurchase}
        disabled={loading || !shippingFee?.fee?.fee} // Vô hiệu hóa nếu chưa có cước vận chuyển
      >
        {loading
          ? "Đang xử lý..."
          : !shippingFee?.fee?.fee
            ? "Đang tính cước vận chuyển"
            : "Thanh Toán"}
      </button>
    </div>
  );
};

export default PaymentMethods;