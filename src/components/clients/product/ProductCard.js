import { React, useEffect, useState } from "react";
import formatCurrency from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";
import useFetchAllReviews from "./useFetchAllReviews";
import { FaStar } from "react-icons/fa";

const isValidUrl = (url) => {
  return url && (url.startsWith("http") || url.startsWith("https"));
};

const ProductCard = ({ product, minSalePrice }) => {
  const navigate = useNavigate();
  const [avgStar, setAvgStar] = useState(0);

  // Gọi hook để lấy đánh giá sản phẩm
  const { reviewsAll } = useFetchAllReviews(product._id);

  useEffect(() => {
    // Tính toán điểm trung bình sao nếu có đánh giá
    if (reviewsAll.length > 0) {
      const totalStars = reviewsAll.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const average = totalStars / reviewsAll.length;
      setAvgStar(average);
    } else {
      setAvgStar(0); // Nếu không có đánh giá, set điểm trung bình là 0
    }
  }, [reviewsAll]);

  const handleClick = () => {
    navigate(`/productsclient/${product._id}`);
  };
  const avatarUrl = isValidUrl(product.avatar) ? product.avatar : "/whey.png";

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillPercentage = Math.min(Math.max(avgStar - (i - 1), 0), 1) * 100;

      stars.push(
        <div key={i} className="relative w-4 h-4">
          <FaStar className="absolute text-gray-300 w-full h-full" />
          <FaStar
            className="absolute text-yellow-500 w-full h-full"
            style={{
              clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)`,
            }}
          />
        </div>
      );
    }
    return stars;
  };

  return (
    <div
    className="border rounded-lg shadow-md  bg-white p-3 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer h-96"
    onClick={handleClick}
    >
      {/* Hình ảnh sản phẩm */}
      <img
        src={avatarUrl}
        alt={product.name}
        className="w-full h-48 sm:h-56 object-contain rounded-xl sm:rounded-2xl"
      />

      {/* Tên sản phẩm (Giữ độ cao cố định) */}
      <h3 className="text-center text-base font-semibold mt-2 leading-tight line-clamp-2 h-[48px]">
      {product.name.length > 25
          ? product.name.substring(0, 20) + "..."
          : product.name}
      </h3>

      {/* Giá sản phẩm, hiển thị giá thấp nhất */}
      <p className="text-center text-base font-bold text-gray-800">
        {formatCurrency(minSalePrice)
          ? `${formatCurrency(minSalePrice)} VND`
          : "Price not available"}{" "}
        {/* {minSalePrice ? `${minSalePrice} VND` : "Price not available"}{" "} */}
        {/* Hiển thị minSalePrice */}
      </p>

      {/* Đánh giá sao (rỗng) */}
      <div className="flex justify-center mt-2">
        {renderStars()}
        {/* {[...Array(5)].map((_, i) => (
          <span key={i} className="text-gray-400 text-xl">
            ☆
          </span>
        ))} */}
      </div>
    </div>
  );
};

export default ProductCard;
