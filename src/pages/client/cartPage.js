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
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(0);
  const [applicableProducts, setApplicableProducts] = useState(new Set());

  const taxPercent = 5;
  var totalPrice = 0;
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

  const handleCheckBoxChange = (productId, category, theme) => {
    setSelectedItems((prevSelected) => {
      const newSelected = new Set(prevSelected);
      const itemKey = `${productId}-${category}-${theme || ""}`; // Tạo key duy nhất

      if (newSelected.has(itemKey)) {
        newSelected.delete(itemKey); // Bỏ chọn
      } else {
        newSelected.add(itemKey); // Chọn sản phẩm chính xác
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

  const handleCheckOutClick = () => {
    const selectedProducts = cart.items.filter((item) =>
      selectedItems.has(
        `${item.product_id}-${item.category}-${item.theme || ""}`
      )
    );

    navigate("/checkout", {
      state: { selectedItems: selectedProducts, discountAmount, taxPercent },
    });
  };

  const handleRemoveItem = (product_id, category, theme) => {
    axios
      .delete(`${URL_API}cartClient/remove`, {
        data: { product_id, category, theme },
        withCredentials: true,
      })
      .then((response) => {
        console.log("Cart after removing item:", response.data.cart);

        // Xóa đúng sản phẩm dựa trên product_id, category và theme
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.filter(
            (item) =>
              !(
                item.product_id === product_id &&
                item.category === category &&
                item.theme === theme
              )
          ),
        }));
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

    console.log("Gửi request cập nhật số lượng:", {
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
        console.log("Cập nhật thành công:", response.data.cart);
        setCart((prevCart) => ({
          ...prevCart,
          items: prevCart.items.map((item) =>
            item.product_id === productId &&
            item.category === category &&
            item.theme === theme
              ? { ...item, quantity: newQuantity }
              : item
          ),
        }));
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

  const applyDiscount = async () => {
    const trimmedCode = discountCode.trim();

    if (!trimmedCode) {
      alert("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const response = await axios.get(`${URL_API}discounts/getVoucher`, {
        params: { code: trimmedCode },
      });

      const { status, data } = response.data;

      if (
        status === "success" &&
        data?.discountPercent > 0 &&
        data?.usageLimit > 0
      ) {
        setDiscountPercent(data.discountPercent);
        setMaxDiscountAmount(data.maxDiscountAmount || 0); // Lưu maxDiscountAmount
        setApplicableProducts(new Set(data.applicableProducts || []));
        alert(
          `Mã giảm giá đã được áp dụng! Giảm ${
            data.discountPercent
          }%, giảm tối đa ${formatCurrency(data.maxDiscountAmount)}đ`
        );
       
      } else {
        alert("Mã giảm giá không hợp lệ, đã hết hạn hoặc hết lượt sử dụng.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy mã giảm giá:", error);

      const errorMessage =
        error.response?.data?.message || "Lỗi hệ thống, vui lòng thử lại!";
      alert(errorMessage);
    }
  };

  const totalAllProdctCartPrice = Array.from(selectedItems).reduce(
    (sum, key) => {
      const [productId, category, theme] = key.split("-");
      const item = cart.items.find(
        (item) =>
          item.product_id === productId &&
          item.category === category &&
          (item.theme || "") === theme
      );
      return sum + (item ? item.price * item.quantity : 0);
    },
    0
  );

  // Tổng tiền chỉ cho các sản phẩm được áp dụng giảm giá
  const totalApplicableProductPrice = Array.from(selectedItems).reduce(
    (sum, key) => {
      if (applicableProducts.has(key)) {
        const [productId, category, theme] = key.split("-");
        const item = cart.items.find(
          (item) =>
            item.product_id === productId &&
            item.category === category &&
            (item.theme || "") === theme
        );
        return sum + (item ? item.price * item.quantity : 0);
      }
      return sum;
    },
    0
  );

  let discountAmount = (totalApplicableProductPrice * discountPercent) / 100;
  console.log("totalApplicableProductPrice",totalApplicableProductPrice)
  console.log("discountPercent",discountPercent)
  console.log("discountAmount",discountAmount)
  console.log("--")

// Nếu discountAmount lớn hơn maxDiscountAmount, thì set lại discountAmount
if (discountAmount > maxDiscountAmount) {
  discountAmount = maxDiscountAmount;
}

  console.log("maxDiscountAmount",maxDiscountAmount)
  const discountedTotal = totalAllProdctCartPrice - discountAmount;
  totalPrice = discountedTotal;

  return (
    <div className="container mx-auto  w-4/5 ">
      <h1 className="text-2xl font-bold text-center mt-6 mb-6">
        GIỎ HÀNG CỦA TÔI
      </h1>
      <div className="flex gap-4">
        {/* Danh sách sản phẩm */}
        <div className="w-11/12 border rounded-lg p-4 bg-white">
          <div className="grid grid-cols-5 text-base font-semibold border-b pb-2">
            <span>Hình ảnh</span>
            <span>Sản Phẩm</span>
            <span>Giá</span>
            <span>Số Lượng</span>
            <span>Tổng Tiền</span>
          </div>
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center py-4 border-b"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={selectedItems.has(
                    `${item.product_id}-${item.category}-${item.theme || ""}`
                  )}
                  onChange={() =>
                    handleCheckBoxChange(
                      item.product_id,
                      item.category,
                      item.theme
                    )
                  }
                />

                <img
                  src={item.productAvatar}
                  alt={item.productName}
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="font-semibold text-sm">{item.productName}</h2>
                  <p className="text-sm">Phân Loại: {item.category}</p>
                  <p className="text-sm">Loại: {item.theme}</p>
                </div>
              </div>
              <span>{formatCurrency(item.price)}₫ </span>
              <div className="flex items-center gap-2">
                <button
                  className="font-medium text-xl"
                  onClick={() => decrease(item)}
                >
                  -
                </button>
                <input
                  type="text"
                  value={item.quantity}
                  onChange={handleChangeQuantity}
                  className="font-medium text-base w-1/4 bg-transparent text-center focus:outline-none"
                />
                <button
                  className="font-medium text-xl"
                  onClick={() => increase(item)}
                >
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
        <div className="w-1/3 border rounded-lg p-4 bg-white">
          <h2 className="text-lg font-semibold mb-2">Mã Khuyến Mãi</h2>
          <div className="flex mb-4">
            <input
              type="text"
              className="border w-full text-base p-2 flex-1"
              placeholder="Nhập mã"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              className="bg-black text-white px-4"
              onClick={applyDiscount}
            >
              Nhập
            </button>
          </div>
          <div className=" pt-4">
            {discountPercent > 0 && (
              <p className="text-sm  mt-2">
                Khuyến Mãi: -{discountPercent}%
                <span className="float-right">
                  - {formatCurrency(discountAmount)}₫
                </span>
              </p>
            )}
            <p className="font-semibold  mt-2 text-lg border-t pt-2">
              Tạm tính:{" "}
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
