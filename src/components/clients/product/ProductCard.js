import React from "react";
 import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const isValidUrl = (url) => {
  return url && (url.startsWith("http") || url.startsWith("https"));
};

const ProductCard = ({ product, minSalePrice }) => {
  
  // Nhận minSalePrice từ prop
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/productsclient/${product._id}`);
  };
  const avatarUrl = isValidUrl(product.avatar) ? product.avatar : "/whey.png";

  return (
    <div
    className="w-full sm:w-64 border rounded-lg shadow-md bg-white p-3 flex flex-col justify-between"
    onClick={handleClick}
  >
  
      {/* Hình ảnh sản phẩm */}
      <img
  src={avatarUrl}
  alt={product.name}
  className="w-full h-48 sm:h-56 object-contain rounded-xl sm:rounded-2xl"
/>



      {/* Tên sản phẩm (Giữ độ cao cố định) */}
      <h3 className="text-center text-lg font-semibold mt-2 min-h-[48px] leading-tight">
        {product.name}
      </h3>

      {/* Giá sản phẩm, hiển thị giá thấp nhất */}
      <p className="text-center text-xl font-bold text-gray-800 mt-1">
        {formatCurrency(minSalePrice) ? `${formatCurrency(minSalePrice)} VND` : "Price not available"}{" "}
        {/* {minSalePrice ? `${minSalePrice} VND` : "Price not available"}{" "} */}
        {/* Hiển thị minSalePrice */}
      </p>

      {/* Đánh giá sao (rỗng) */}
      <div className="flex justify-center mt-2">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-gray-400 text-xl">
            ☆
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
