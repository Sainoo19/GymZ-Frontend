import axios from "axios";
import { React, useState } from "react";
import { FaStar } from "react-icons/fa"; // Import icon sao
import { useAuth } from "../../../pages/client/AuthContext";

const ProductReview = ({ ProductId, updateReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false); // Thêm trạng thái đang submit
  const [message, setMessage] = useState({ type: "", text: "" }); // Thêm state để hiện thông báo
  const { isLoggedIn } = useAuth();
  const URL_API = process.env.REACT_APP_API_URL;

  const handleSubmitReview = async () => {
    // Xóa thông báo cũ nếu có
    setMessage({ type: "", text: "" });

    // Dùng trạng thái isLoggedIn để kiểm tra
    if (!isLoggedIn) {
      setMessage({ type: "error", text: "Bạn cần đăng nhập để gửi đánh giá!" });
      return;
    }

    if (!rating) {
      setMessage({ type: "error", text: "Vui lòng chọn số sao đánh giá!" });
      return;
    }

    if (!comment.trim()) {
      setMessage({ type: "error", text: "Vui lòng nhập nội dung đánh giá!" });
      return;
    }

    setSubmitting(true); // Bắt đầu submit

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
        setMessage({ type: "success", text: "Đánh giá đã được gửi thành công!" });
        setRating(0); // Reset form
        setComment("");

        // Gọi hàm cập nhật review từ component cha
        await updateReviews();
      } else {
        setMessage({ type: "error", text: reviewResponse.data.message || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!" });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage({ type: "error", text: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!" });
      } else {
        console.error("Lỗi khi gửi đánh giá:", error.response?.data);
        setMessage({ type: "error", text: error.response?.data?.message || "Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!" });
      }
    } finally {
      setSubmitting(false); // Kết thúc submit
    }
  };

  const renderStarsReview = (currentRating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-yellow-400 cursor-pointer ${index < currentRating ? "opacity-100" : "opacity-30"}`}
        onClick={() => setRating(index + 1)}
        style={{ fontSize: "25px" }}
      />
    ));
  };

  return (
    <div>
      {/* Form nhập review mới */}
      <div className="mt-6 px-16 p-4 border-t border-gray-300">
        <h3 className="text-2xl font-semibold">ĐÁNH GIÁ</h3>
        <p className="mt-2">Bạn cảm thấy thế nào về sản phẩm?</p>

        {/* Hiển thị thông báo */}
        {message.text && (
          <div className={`p-3 my-3 rounded-md ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-400" :
            "bg-red-100 text-red-700 border border-red-400"
            }`}>
            {message.text}
          </div>
        )}

        <div className="flex mt-2">{renderStarsReview(rating)}</div>

        <p className="mt-4">Để lại đánh giá:</p>
        <textarea
          className="w-full mt-2 p-4 border border-gray-300 rounded-xl"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập đánh giá của bạn ở đây..."
          disabled={submitting}
        ></textarea>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmitReview}
            className={`px-4 py-2 bg-secondary text-black border-2 border-black rounded-full hover:bg-black hover:text-white transition-colors duration-100 ${submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            disabled={submitting}
          >
            {submitting ? "Đang gửi..." : "Gửi Đánh Giá"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;