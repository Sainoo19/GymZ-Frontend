import { CheckCircle } from "lucide-react";
import { useState } from "react";

const CartPackage = ({ type, name, description, features, prices, onRegister }) => {
  const [selectedDuration, setSelectedDuration] = useState(1); // Default to 1 month

  // Format price with comma separators
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Handle duration selection
  const handleDurationChange = (months) => {
    setSelectedDuration(months);
  };

  // Handle registration button click
  const handleRegisterClick = () => {
    onRegister({
      type,
      duration: selectedDuration,
      price: prices[selectedDuration],
      packageName: name
    });
  };

  return (
    <div className="border-2 border-accent rounded-lg p-6 w-96 h-full flex flex-col items-center">
      {/* Tên gói */}
      <div className="bg-primary text-secondary text-lg font-bold p-3 w-full text-center mb-2">
        {name}
      </div>

      {/* Mô tả ngắn */}
      <p className="text-gray-600 text-sm text-center mb-4 h-12 flex items-center justify-center">{description}</p>

      {/* Giá tiền */}
      <p className="text-red-500 text-2xl font-bold mt-2">{formatPrice(prices[selectedDuration])} VND</p>

      {/* Thời hạn gói */}
      <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
        {Object.keys(prices).map((months) => (
          <button
            key={months}
            onClick={() => handleDurationChange(parseInt(months))}
            className={`px-2 py-1 text-xs rounded-md ${selectedDuration === parseInt(months)
              ? "bg-secondary text-white"
              : "bg-gray-100 text-gray-600"
              }`}
          >
            {months} tháng
          </button>
        ))}
      </div>

      {/* Danh sách tính năng */}
      <div className="mt-2 w-full flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 mb-2 text-xs">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Button đăng ký ngay */}
      <button
        onClick={handleRegisterClick}
        className="border-2 border-accent text-gray-800 px-6 py-2 mt-4 rounded-lg hover:bg-secondary hover:text-white transition w-full">
        Đăng ký ngay
      </button>
    </div>
  );
};

export default CartPackage;