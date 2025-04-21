import { React, useEffect, useState, useContext } from "react";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CartContext } from "../../../components/clients/contexts/CartContext";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
const ProductImage = ({
  avatar,
  images,
  name,
  minPrice,
  maxPrice,
  variations,
}) => {
  const [quantity, setQuantity] = useState(1);
  const increase = () => {
    setQuantity((prev) => (stock !== null && prev < stock ? prev + 1 : prev));
  };
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const { productId } = useParams();
  const URL_API = process.env.REACT_APP_API_URL;
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOriginalPrice, setSelectedOriginalPrice] = useState(null);
  const [selectedSalePrice, setSelectedSalePrice] = useState(null);
  const [percentDiscount, setPercentDiscount] = useState(0);
  const [stock, setStock] = useState(null);
  const location = useLocation();

  const roundNumber = (num) => Math.round(num);

  const allThemes = variations
    ? Array.from(new Set(variations.map((v) => v.theme)))
    : [];
  const allCategories = variations
    ? Array.from(new Set(variations.map((v) => v.category)))
    : [];

  const validCategories = variations
    ? Array.from(
        new Set(variations.filter((v) => v.theme).map((v) => v.category))
      )
    : [];

  const filteredThemes = selectedCategory
    ? Array.from(
        new Set(
          variations
            .filter((v) => v.category === selectedCategory)
            .map((v) => v.theme)
        )
      )
    : allThemes;

  const hasThemes = allThemes.length > 0; // Kiểm tra xem sản phẩm có theme hay không
  const isSelectionRequired = allCategories.length > 0 && hasThemes;
  const isDisabled =
    isSelectionRequired && (!selectedTheme || !selectedCategory);

  useEffect(() => {
    if (!variations) return;

    let foundVariation = null;
    if (hasThemes) {
      if (selectedCategory && selectedTheme) {
        foundVariation = variations.find(
          (v) => v.category === selectedCategory && v.theme === selectedTheme
        );
      }
    } else {
      if (selectedCategory) {
        foundVariation = variations.find(
          (v) => v.category === selectedCategory
        );
      }
    }

    setSelectedOriginalPrice(
      foundVariation ? foundVariation.originalPrice : null
    );
    setSelectedSalePrice(foundVariation ? foundVariation.salePrice : null);
    setStock(foundVariation ? foundVariation.stock : null); // Cập nhật stock

    // Chỉ tính phần trăm giảm giá khi đã chọn đủ điều kiện
    if (foundVariation?.originalPrice && foundVariation?.salePrice) {
      setPercentDiscount(
        foundVariation.originalPrice !== foundVariation.salePrice
          ? roundNumber(
              100 -
                (foundVariation.salePrice / foundVariation.originalPrice) * 100
            )
          : 0
      );
    } else {
      setPercentDiscount(0);
    }
  }, [selectedTheme, selectedCategory, variations]);

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 1) {
      setQuantity(
        stock !== null && Number(value) > stock ? stock : Number(value)
      );
    } else if (value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedTheme || !selectedCategory) {
      alert("Vui lòng chọn phân loại và loại hàng trước khi thêm vào giỏ hàng");
      return;
    }
    try {
      const response = await axios.post(
        `${URL_API}cartClient/add`,
        {
          product_id: productId,
          quantity,
          theme: selectedTheme,
          category: selectedCategory,
        },
        { withCredentials: true } // Tự động gửi cookie
      );

      alert("Thêm vào giỏ hàng thành công!");

      addToCart(quantity);
    } catch (error) {
      const token = Cookies.get("accessToken");
      console.log("accessToken:", token);
      if (!token) {
        alert("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng");
        navigate("/login-user", { state: { from: location } });
        return;
      } else {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-around  items-start w-11/12 lg:w-3/4 mx-auto px-4">
        {/* <div className="w-1/2 lg:w-3/5 md:w-4/5 2xl:border-pink-800  xl:border-blue-500 lg:border-green-600 md:border-red-700 sm:border-yellow-700 xs:border-purple-800 md:border"> */}
        <div className="w-full md:w-3/4 mb-4 md:mb-0 mx-auto text-center">
        <Zoom>
          <img src={avatar} className="mx-auto w-full max-w-xs" alt={name} />

        </Zoom>
          <div className="flex items-center mt-4 justify-center flex-wrap gap-2">
          {images && images.length > 0 ? (
  images.map((img, index) => (
    <Zoom key={index}>
      <img src={img} className="w-20 h-20 object-cover" alt="" />
    </Zoom>
  ))
) : (
  <p>No image</p>
)}

          </div>
        </div>
        <div className="w-full md:ml-8">
          <h1 className="font-normal text-xl">{name}</h1>

          <div className="flex items-center">
            <p className="text-2xl font-semibold my-3">
              {selectedSalePrice !== null
                ? formatCurrency(selectedSalePrice)
                : minPrice === maxPrice
                ? formatCurrency(minPrice)
                : `${formatCurrency(minPrice)} - ${formatCurrency(
                    maxPrice
                  )}`}{" "}
              VND
            </p>

            {selectedOriginalPrice &&
              selectedOriginalPrice !== selectedSalePrice && (
                <p className="line-through text-gray-400 ml-3">
                  {formatCurrency(selectedOriginalPrice)} VND
                </p>
              )}

            {percentDiscount ? (
              <p className="text-red-600 ml-3 border border-red-500 px-3 rounded-xl bg-red-200">
                - {percentDiscount} %
              </p>
            ) : null}
          </div>

          {stock !== null && (
            <p className="text-gray-600 text-sm mt-2">
              Số lượng còn lại: {stock}
            </p>
          )}
          <div className="border-b border-gray-300 my-3 rounded-lg"></div>

          {/* Hiển thị category */}
          {validCategories.length > 0 && (
            <>
              <p className="my-3">Phân loại</p>
              <div className="flex ml-2">
                {validCategories.map((category, index) => (
                  <button
                    key={index}
                    className={`rounded-3xl py-1 px-5 mr-4 transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Hiển thị theme */}
          {filteredThemes.length > 0 && (
            <>
              <p className="my-3">Loại hàng</p>
              <div className="flex ml-2">
                {filteredThemes.map((theme, index) => (
                  <button
                    key={index}
                    className={`rounded-3xl py-1 px-5 mr-4 transition-all duration-200 ${
                      selectedTheme === theme
                        ? "bg-primary text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="border-b border-gray-300 my-3 rounded-lg"></div>

          <div className="flex flex-row items-center my-7 w-full md:w-11/12 justify-start gap-3">
  <div className="flex px-3 bg-gray-200 h-9 rounded-2xl items-center">
    <button
      className="font-medium px-3 border text-2xl"
      onClick={decrease}
    >
      -
    </button>
    <input
      type="text"
      value={quantity}
      onChange={handleChangeQuantity}
      className="font-medium text-base w-16 border bg-transparent text-center focus:outline-none"
    />
    <button
      className="font-medium px-3 border text-xl"
      onClick={increase}
    >
      +
    </button>
  </div>

  <button
    className={`rounded-2xl w-full md:w-1/2 text-sm h-9 ${
      isDisabled
        ? "bg-gray-300 cursor-not-allowed"
        : "bg-primary text-white"
    }`}
    disabled={isDisabled}
    onClick={handleAddToCart}
  >
    Thêm vào giỏ hàng
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ProductImage;
