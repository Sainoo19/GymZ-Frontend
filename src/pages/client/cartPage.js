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
        setMaxDiscountAmount(data.maxDiscountAmount);
        setApplicableProducts(new Set(data.applicableProducts || []));
        alert(
          `Mã giảm giá đã được áp dụng! Giảm ${data.discountPercent
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
      const [productId] = key.split("-"); // Chỉ lấy productId
      if (applicableProducts.has(productId)) { // So sánh productId với applicableProducts
        const item = cart.items.find((item) => item.product_id === productId);
        return sum + (item ? item.price * item.quantity : 0);
      }
      return sum;
    },
    0
  );



  let discountAmount = (totalApplicableProductPrice * discountPercent) / 100;
  console.log("totalApplicableProductPrice", totalApplicableProductPrice)
  console.log("discountPercent", discountPercent)
  console.log("discountAmount", discountAmount)
  console.log("applicableProducts", applicableProducts)
  console.log("--")

  // Nếu discountAmount lớn hơn maxDiscountAmount, thì set lại discountAmount
  if (discountAmount > maxDiscountAmount) {
    discountAmount = maxDiscountAmount;
  }

  console.log("maxDiscountAmount", maxDiscountAmount)
  const discountedTotal = totalAllProdctCartPrice - discountAmount;
  totalPrice = discountedTotal;
  // Cart page grid layout fix

  // Cart page với sản phẩm to và cao hơn

  return (
    <div className="container mx-auto w-4/5">
      <h1 className="text-2xl font-bold text-center mt-8 mb-8">
        GIỎ HÀNG CỦA TÔI
      </h1>
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Danh sách sản phẩm */}
        <div className="w-full lg:w-8/12 border rounded-lg p-6 bg-white shadow-sm">
          <div className="grid grid-cols-12 text-base font-bold border-b pb-4 mb-2">
            <div className="col-span-5">Sản Phẩm</div>
            <div className="col-span-2 text-center">Giá</div>
            <div className="col-span-2 text-center">Số Lượng</div>
            <div className="col-span-2 text-center">Tổng Tiền</div>
            <div className="col-span-1 text-center"></div>
          </div>
          {cart.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center py-6 border-b"
            >
              {/* Sản phẩm (hình ảnh + thông tin) */}
              <div className="col-span-5 flex items-center gap-4">
                <input
                  type="checkbox"
                  className="w-6 h-6"
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
                  className="w-24 h-24 object-contain"
                />
                <div>
                  <h2 className="font-semibold text-base mb-1 line-clamp-2">{item.productName}</h2>
                  <p className="text-sm text-gray-600 mb-1">Phân Loại: {item.category}</p>
                  <p className="text-sm text-gray-600">Loại: {item.theme}</p>
                </div>
              </div>

              {/* Giá */}
              <div className="col-span-2 text-center font-medium">
                {formatCurrency(item.price)}₫
              </div>

              {/* Số lượng */}
              <div className="col-span-2">
                <div className="flex items-center justify-center border rounded-md w-32 h-10 mx-auto">
                  <button
                    className="px-3 py-2 border-r text-lg font-medium"
                    onClick={() => decrease(item)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    onChange={handleChangeQuantity}
                    className="w-14 h-full text-center focus:outline-none font-medium"
                  />
                  <button
                    className="px-3 py-2 border-l text-lg font-medium"
                    onClick={() => increase(item)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="col-span-2 font-medium text-center text-base">
                {formatCurrency(item.price * item.quantity)}₫
              </div>

              {/* Nút xóa */}
              <div className="col-span-1 text-center">
                <button
                  onClick={() =>
                    handleRemoveItem(item.product_id, item.category, item.theme)
                  }
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <span aria-label="Xóa" className="text-xl">🗑️</span>
                </button>
              </div>
            </div>
          ))}

          {cart.items.length === 0 && (
            <div className="text-center py-12 text-gray-500 text-lg">
              Giỏ hàng của bạn đang trống
            </div>
          )}
        </div>

        {/* Thanh toán */}
        <div className="w-full lg:w-4/12 border rounded-lg p-6 bg-white shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-4">Mã Khuyến Mãi</h2>
          <div className="flex mb-6">
            <input
              type="text"
              className="border w-full text-base p-3 flex-1 rounded-l"
              placeholder="Nhập mã"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <button
              className="bg-black text-white px-5 py-3 rounded-r font-medium"
              onClick={applyDiscount}
            >
              Áp dụng
            </button>
          </div>
          <div className="pt-4 space-y-3">
            <p className="flex justify-between border-b pb-3 text-base">
              <span>Tạm tính:</span>
              <span>{formatCurrency(totalAllProdctCartPrice)}₫</span>
            </p>

            {discountPercent > 0 && (
              <p className="flex justify-between text-green-600 text-base pb-2">
                <span>Khuyến Mãi ({discountPercent}%):</span>
                <span>- {formatCurrency(discountAmount)}₫</span>
              </p>
            )}

            <p className="flex justify-between text-xl font-bold pt-3 border-t mt-2">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(totalPrice)}₫</span>
            </p>
          </div>
          <button
            className="w-full bg-black text-white py-4 mt-6 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400 text-lg font-medium"
            onClick={handleCheckOutClick}
            disabled={selectedItems.size === 0}
          >
            Mua hàng ({selectedItems.size})
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
