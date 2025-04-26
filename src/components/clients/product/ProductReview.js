import axios from "axios";
import { React, useState } from "react";
import { FaStar } from "react-icons/fa"; // Import icon sao
import { useAuth } from "../../../pages/client/AuthContext";

const ProductReview = ({ProductId, updateReviews}) => {
    const [rating, setRating] = useState(0); 
    const [comment, setComment] = useState("");
    const { isLoggedIn } = useAuth();
    const URL_API = process.env.REACT_APP_API_URL;


  const handleSubmitReview = async () => {
    // Dùng trạng thái isLoggedIn để kiểm tra
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để gửi đánh giá!");
      return;
    }

    if (!rating || !comment) {
      alert("Vui lòng nhập đầy đủ thông tin đánh giá!");
      return;
    }

    const reviewData = {
      product_id: ProductId,
      rating,
      comment,
    };

    try {
      const reviewResponse = await axios.post(
        `${URL_API}reviews/create`,
        reviewData,
        {
          withCredentials: true,
        }
      );

      if (reviewResponse.data.status === "success") {
        alert("Đánh giá đã được gửi thành công!");
        setRating(0); // Reset form nếu cần
        setComment("");

        updateReviews();
      } else {
        alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
      } else {
        console.error("Lỗi khi gửi đánh giá:", error.response?.data);
        alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!");
      }
    }
  };


  const renderStarsReview = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-yellow-400 ${index < rating ? "opacity-100" : "opacity-30"}`}
        onClick={() => setRating(index + 1)} // Cập nhật rating khi click vào sao
        style={{ fontSize: "25px"}}
      />
    ));
  };
return(
    <div>
        {/* Form nhập review mới */}
        <div className="mt-6 px-16 p-4 border-t border-gray-300">
              <h3 className="text-2xl font-semibold">ĐÁNH GIÁ</h3>
              <p className="mt-2">Bạn cảm thấy thế nào về sản phẩm?</p>
              <div className="flex mt-2">{renderStarsReview(rating)}</div>

              <p className="mt-4">Để lại đánh giá:</p>
              <textarea
                className="w-full mt-2 p-4 border border-gray-300 rounded-xl"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập đánh giá của bạn ở đây..."
              ></textarea>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-secondary text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors duration-100"
                >
                  Gửi Đánh Giá
                </button>
              </div>
            </div>

    </div>
);
  
};
export default ProductReview;
  