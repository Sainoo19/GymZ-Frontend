import { useEffect, useState } from "react";
import axios from "axios";
import formatCurrency from "../../../src/components/utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import CheckOutPage from "./checkOutPage";

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({}); // Trạng thái checkbox  
  const URL_API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
const [selectedItems, setSelectedItems] = useState(new Set());
  const [quantity, setQuantity] = useState(1);

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

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (!cart || !cart.items) return <p>Không có dữ liệu giỏ hàng.</p>;

  const handleCheckBoxChange = (productId) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId); // Bỏ chọn
      } else {
        newSelected.add(productId); // Chọn
      }
      return newSelected;
    });
  };
  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 1) {
      setQuantity(Number(value));
    } else if (value === "") {
      setQuantity(1);
    }
  };
  const totalPrice = Array.from(selectedItems).reduce((sum, productId) => {
    const item = cart.items.find((item) => item.product_id === productId);
    return sum + (item ? (item.price || 0) * (item.quantity || 1) : 0);
  }, 0);
  
  
  const handleCheckOutClick = () => {
    const selectedProducts = cart.items.filter((item) =>
      selectedItems.has(item.product_id)
    );
    navigate("/checkout", { state: { selectedItems: selectedProducts } });
  };
  
  const handleRemoveItem = (product_id, category, theme) => {
    axios
      .delete(`${URL_API}cartClient/remove`, {
        data: { product_id, category, theme },
        withCredentials: true,
      })
      .then((response) => {
        setCart(response.data.cart); // Cập nhật lại giỏ hàng
      })
      .catch((error) => console.error("Lỗi khi xoá sản phẩm:", error));
  };

  const updateQuantity = (productId, category, theme, newQuantity) => {
    if (!productId || !category || newQuantity < 1) {
      console.error("Dữ liệu gửi lên API không hợp lệ:", {
        productId,
        category,
        theme,
        newQuantity,
      });
      return;
    }
  
    console.log("🔍 Gửi request cập nhật số lượng:", {
      product_id: productId,
      category,
      theme: theme || "",
      quantity: newQuantity,
    });
  
    axios
      .put(
        `${URL_API}cartClient/updateQuantity`,
        {
          product_id: productId,
          category,
          theme: theme || "",
          quantity: newQuantity,
        },
        { withCredentials: true }
      )
      .then((response) => {
        console.log("Cập nhật thành công:", response.data);
        setCart(response.data.cart);
      })
      .catch((error) => {
        console.error(
          "Lỗi khi cập nhật số lượng:",
          error.response?.data || error.message
        );
      });
  };
  
  const increase = (item) =>
    updateQuantity(
      item.product_id,
      item.category,
      item.theme,
      item.quantity + 1
    );
  const decrease = (item) =>
    updateQuantity(
      item.product_id,
      item.category,
      item.theme,
      item.quantity - 1
    );

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
  checked={selectedItems.has(item.product_id)}
  onChange={() => handleCheckBoxChange(item.product_id)}
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
                <button className="font-medium text-xl" onClick={() =>decrease(item)}>
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={handleChangeQuantity}
                  className="font-medium text-base w-1/4 bg-transparent text-center focus:outline-none"
                />
                <button className="font-medium text-xl" onClick={() =>increase(item)}>
                  +
                </button>
              </div>
              <span>{formatCurrency(item.price * item.quantity)}₫</span>
              <button
                onClick={() =>
                  handleRemoveItem(item.product_id, item.category, item.theme)
                }
                className="text-red-500 text-xl"
              >
                🗑️
              </button>
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
              Tổng Tiền:{" "}
              <span className="float-right">{formatCurrency(totalPrice)}₫</span>
            </p>
          </div>
          <button
            className="w-full bg-black text-white py-2 mt-4"
            onClick={handleCheckOutClick}
          >
            Mua hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
