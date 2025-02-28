import { useEffect, useState } from "react";
import axios from "axios";
import formatCurrency from "../../../src/components/utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import CheckOutPage from "./checkOutPage";


const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItem] = useState([]);
  const URL_API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${URL_API}cartClient/get`, { withCredentials: true })
      .then((response) => {
        setCart(response.data.cart);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy giỏ hàng:", error);
        setLoading(false);
      });
  }, []);
  const handleCheckBoxChange = (item) => {
    setSelectedItem((prevSelected) => {
      if (prevSelected.includes(item)) {
        return prevSelected.filter((i) => i !== item); // Bỏ chọn
      } else {
        return [...prevSelected, item];
      }
    });
  };

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (!cart || !cart.items) return <p>Không có dữ liệu giỏ hàng.</p>;

  const handleCheckOutClick = () =>{
    navigate("/checkout", { state: { selectedItems }} )
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">GIỎ HÀNG CỦA TÔI</h1>
      <div className="flex gap-6">
        {/* Danh sách sản phẩm */}
        <div className="w-3/4 border rounded-lg p-4 bg-white">
          <div className="grid grid-cols-4 text-lg font-semibold border-b pb-2">
            <span>Sản Phẩm</span>
            <span>Giá</span>
            <span>Số Lượng</span>
            <span>Tổng Tiền</span>
          </div>
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-4 items-center py-4 border-b"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={selectedItems.includes(item)}
                  onChange={() => handleCheckBoxChange(item)}
                />
                <img
                  src={item.productAvatar}
                  alt={item.productName}
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="font-semibold">{item.productName}</h2>
                  <p className="text-sm">Phân Loại: {item.category}</p>
                </div>
              </div>
              <span>{formatCurrency(item.price)}₫</span>
              <div className="flex items-center gap-2">
                <button className="px-2 border">-</button>
                <span>{item.quantity}</span>
                <button className="px-2 border">+</button>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}₫</span>
            </div>
          ))}
        </div>
        {/* Thanh toán */}
        <div className="w-1/4 border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">Mã Khuyến Mãi</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border p-2 flex-1"
              placeholder="Nhập mã"
            />
            <button className="bg-black text-white px-4">Nhập</button>
          </div>
          <div className="border-t pt-4">
            <p>
              Tạm Tính: <span className="float-right">{cart.subTotal}₫</span>
            </p>
            <p>
              Thuế: <span className="float-right">{cart.tax}₫</span>
            </p>
            <p>
              Khuyến Mãi: <span className="float-right">-{cart.discount}₫</span>
            </p>
            <p className="font-semibold text-lg border-t pt-2">
              Tổng Tiền: <span className="float-right">{formatCurrency(totalPrice)}₫</span>
            </p>
          </div>
          <button className="w-full bg-black text-white py-2 mt-4" onClick={handleCheckOutClick}>
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
