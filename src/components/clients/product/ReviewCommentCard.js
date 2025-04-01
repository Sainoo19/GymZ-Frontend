import { React, useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../../pages/client/AuthContext";
import { MoreHorizontal } from "lucide-react";
import { FaEyeSlash } from 'react-icons/fa';


// Component hiển thị từng review
const ReviewCommentCard = ({ review, userName }) => {
  const { user, isLoggedIn } = useAuth();
  const URL_API = process.env.REACT_APP_API_URL;
  const [isMenuVisible, setMenuVisible] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState(""); // Nội dung phản hồi
  const [replyModal, setReplyModal] = useState(null); // Chứa review đang phản hồi
  const [showFullReply, setShowFullReply] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentReviewToDelete, setCurrentReviewToDelete] = useState(null);



  // Hàm xử lý các hành động từ menu
  const handleMenuAction = async (action, review) => {
    let newStatus;

    // Xử lý ẩn bình luận
    if (action === "hidden") {
      newStatus = "hidden";
    } else if (action === "unhidden") {
      newStatus = "active";
    }

    try {
      if (action === "hidden" || action === "unhidden") {
        const response = await axios.put(
          `${URL_API}reviews/updStatus/${review._id}`,
          { status: newStatus }
        );

        if (response.status === 200) {
          review.status = newStatus;
          alert(action === "hidden" ? "Bình luận đã bị ẩn!" : "Bình luận đã được hiện lại!");
          setReviews((prevReviews) =>
            prevReviews.map((rev) =>
              rev._id === review._id ? { ...rev, status: newStatus } : rev
            )
          );
        }
      } else if (action === "reply") {
        if (!isLoggedIn) {
          alert("Bạn cần đăng nhập để phản hồi.");
          return;
        }
        setReplyModal(review); // Mở modal cho review này
        setReplyText(""); // Reset input khi mở modal
      } else if (action === "delete") {
        // Kiểm tra nếu người dùng đã đăng nhập trước khi xóa
        if (!isLoggedIn) {
          alert("Bạn cần đăng nhập để xóa bình luận.");
          return;
        }
        // Mở modal xác nhận xóa
        setCurrentReviewToDelete(review);
        setDeleteModalVisible(true);
      } else {
        console.log(`Action clicked: ${action}`);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
    }

    setMenuVisible(null); // Ẩn menu sau khi chọn hành động
  };

  const handleSendReply = async () => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để phản hồi.");
      return;
    }

    if (!replyText.trim()) return; // Không gửi phản hồi rỗng

    try {
      const response = await axios.post(
        `${URL_API}reviews/reply/${review._id}`,
        {
          user_id: user._id,
          comment: replyText,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("Phản hồi đã được gửi!");
        const updatedReview = { ...review, replies: [...review.replies, response.data] };
        setReviews(prevReviews =>
          prevReviews.map(r => (r._id === updatedReview._id ? updatedReview : r))
        );


        setReplyText(""); // Xóa nội dung input
        setReplyModal(null);
      }
    } catch (error) {
      console.error("Lỗi khi gửi phản hồi:", error);
    }
  };

  const handleDeleteComment = async (reviewId) => {
    try {
      // Gửi yêu cầu xóa bình luận
      const response = await axios.delete(`${URL_API}reviews/delete/${reviewId}`, { withCredentials: true });

      if (response.status === 200) {
        // Cập nhật lại UI sau khi xóa
        setReviews((prevReviews) =>
          prevReviews.filter((rev) => rev._id !== reviewId) // Xóa review khỏi state
        );
        alert("Bình luận đã bị xóa thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };


  // Render số sao
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-yellow-400 ${index < rating ? "opacity-100" : "opacity-30"}`}
      />
    ));
  };

  useEffect(() => {
    // console.log("User data in ReviewCommentCard:", user);
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuVisible(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);




  const handleMenuClick = (reviewId) => {
    if (isMenuVisible === reviewId) {
      // Nếu review này đã có menu mở, đóng menu
      setMenuVisible(null);
    } else {
      // Nếu review này chưa có menu mở, mở menu cho review này
      setMenuVisible(reviewId);
    }
  };

  return (
    <div className="relative border-b px-6 py-4 mb-4 bg-white shadow-md rounded-lg border border-gray-200 mx-auto " style={{ maxWidth: "800px" }}>
      {/* Dấu 3 chấm cố định góc trên phải */}
      {user?.role === "admin" && (
        <div className="absolute top-4 right-4 z-40">
          <MoreHorizontal
            size={20}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(review._id);
            }}
          />

          {review.status === "hidden" && (
            <div className="absolute right-8 top-0 flex items-center justify-center">
              <FaEyeSlash className="text-red-500 text-xl" />

            </div>
          )}

          {/* Menu dropdown xuất hiện bên dưới */}
          {isMenuVisible === review._id && (
            <div className="absolute right-0 mt-8 w-40 bg-white shadow-lg rounded-lg border border-gray-300">
              <ul className="text-m text-gray-700">
                <li
                  onClick={() => handleMenuAction(review.status === "hidden" ? "unhidden" : "hidden", review)}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  {review.status === "hidden" ? "Hiện bình luận" : "Ẩn bình luận"}
                </li>
                <li
                  onClick={() => handleMenuAction("reply", review)}
                  className="text-yellow-600 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Phản hồi
                </li>
                <li
                  onClick={() => handleMenuAction("delete", review)}
                  className="text-red-500 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Xóa
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Nội dung review */}
      <div className="flex mt-2">{renderStars(review.rating)}</div>
      <div className="flex items-center space-x-3">
        <p className="font-semibold mt-3">{userName}</p>
      </div>

      <p className="mt-2 text-gray-700 break-words">{review.comment}</p>

      <p className="text-sm text-gray-500 mt-3">
        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
      </p>

      {/* Đoạn modal để xác nhận xóa bình luận */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Bạn có chắc chắn muốn xóa bình luận?</h2>
            <p className="text-sm mb-4">
              Bình luận của khách hàng: <strong>{userName}</strong>
              <br />
              với số sao: <strong>{review.rating}</strong>
              <br />
              Nội dung: <span className="italic">"{review.comment}"</span>
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalVisible(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteComment(review._id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Xóa bình luận
              </button>
            </div>
          </div>
        </div>
      )}




      {/* Hiển thị các phản hồi */}
      {review.replies && review.replies.length > 0 && (
        <div className="mt-4">
          {review.replies.map((reply) => (
            <div key={reply._id} className="border-l-2 pl-4 py-2">
              <div className="flex items-center space-x-2">
                <img
                  src={reply.adminAvatarUrl || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                  alt="Admin Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <p className="font-semibold text-gray-700">Hệ thống Gym Z</p>
              </div>
              <p className="text-gray-700 mt-2">
                {showFullReply ? reply.comment : (reply.comment.length > 170 ? reply.comment.slice(0, 170) + "..." : reply.comment)}
              </p>
              {reply.comment.length > 100 && (
                <button
                  className="text-blue-500 text-sm mt-1"
                  onClick={() => setShowFullReply(!showFullReply)}
                >
                  {showFullReply ? "Rút gọn" : "Xem thêm"}
                </button>
              )}
              <div className="flex mt-2">
                <span className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          ))}
        </div>
      )}


      {replyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto" style={{ width: "500px", maxHeight: "450px" }}>
            <h2 className="text-xl font-semibold mb-8 text-center">PHẢN HỒI BÌNH LUẬN KHÁCH HÀNG</h2>
            <h2 className="text-lg font-semibold mb-2"> {userName}</h2>


            <p className="text-sm text-gray-500 mb-2">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</p>



            {/* Hiển thị nội dung review trong modal */}
            <div className="flex mt-2 ">
              <span className="text-m font-medium text-gray-700 mr-2">Số sao:</span>
              <span className="text-yellow-400">{review.rating}</span>
              {/* <div className="ml-2">{renderStars(review.rating)}</div> */}
            </div>
            <p className="mt-2 mb-4 font-medium text-gray-700 break-words">Nội dung: "{review.comment}"</p>

            <textarea
              className="w-full p-2 border rounded mt-1"
              rows="4"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            ></textarea>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setReplyModal(null)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSendReply}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReviewCommentCard;
