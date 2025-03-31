import { CheckCircle } from "lucide-react"; // Import icon từ lucide-react

const CartPackage = ({ name, price, features }) => {
  return (
    <div className="border-2 border-accent rounded-lg p-6 w-70 mx-auto flex flex-col items-center">
      {/* Tên gói */}
      <div className="bg-primary text-secondary text-lg font-bold p-3 w-full text-center">
        {name}
      </div>

      {/* Giá tiền */}
      <p className="text-red-500 text-3xl font-bold mt-4">{price}</p>

      {/* Thanh toán hàng tháng */}
      <p className="text-sm text-gray-600">Thanh toán hàng tháng</p>

      {/* Danh sách tính năng */}
      <div className="mt-4 w-full">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 mb-2 text-xs">
            <CheckCircle className="text-green-500" size={20} />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Button đăng ký ngay */}
      <button className="border-2 border-accent text-gray-800 px-6 py-2 mt-6 rounded-lg hover:bg-secondary transition">
        Đăng ký ngay
      </button>
    </div>
  );
};

export default CartPackage;
