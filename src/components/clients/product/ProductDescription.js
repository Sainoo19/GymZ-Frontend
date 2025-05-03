import { React, useState } from "react";
import { FaStar } from "react-icons/fa";
import RatingProgressBar from "../product/RatingProgressBar";
import ReviewCommentCard from "./ReviewCommentCard";
import Pagination from "../../admin/layout/Pagination";
import ProductReview from "./ProductReview";
import ProductUserReviews from "./ProductUserReviews";

const ProductDescription = ({ description, ProductId }) => {
  const [activeTab, setActiveTab] = useState("details");

  const {
    reviews,
    users,
    avgStar,
    totalReviews,
    ratings,
    currentPage,
    totalPages,
    handlePageChange,
    refreshData
  } = ProductUserReviews(activeTab);

  const getUserName = (userId) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.name : "Người dùng ẩn danh";
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillPercentage = Math.min(Math.max(avgStar - (i - 1), 0), 1) * 100;

      stars.push(
        <div key={i} className="relative w-3 h-3 md:w-4 md:h-4">
          <FaStar className="absolute text-gray-300 w-full h-full" />
          <FaStar
            className="absolute text-yellow-500 w-full h-full md:"
            style={{
              clipPath: `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0% 100%)`,
            }}
          />
        </div>
      );
    }
    return stars;
  };

  // Hàm này sẽ được gọi sau khi người dùng đăng đánh giá thành công
  const updateReviews = async () => {
    // Đặt về trang 1 để hiển thị bình luận mới nhất
    handlePageChange(1);

    // Refresh toàn bộ dữ liệu: số liệu thống kê và danh sách đánh giá
    await refreshData();
  };

  return (
    <div>
      <div className="w-4/5 container mx-auto my-10 border-b pb-3 border-gray-300">
        <div className="w-3/4 justify-around flex container mx-auto ">
          <button
            className={`text-base sm:text-lg pb-1 ${activeTab === "details" ? "border-b-2 border-black font-medium" : ""
              }`}
            onClick={() => setActiveTab("details")}
            type="button"
          >
            Chi tiết sản phẩm
          </button>
          <div className=" border-r-2"></div>
          <button
            className={`text-base sm:text-lg pb-1 ${activeTab === "reviews" ? "border-b-2 border-black font-medium" : ""
              }`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá
          </button>
        </div>
      </div>

      <div className="w-4/5 pl-5  container mx-auto mb-10">
        {activeTab === "details" ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <div className="">
            <div className="flex ml-20">
              <h1>Toàn bộ đánh giá</h1>
              <p className="text-gray-500 ml-2">({totalReviews})</p>
            </div>

            <div className=" mt-8 container mx-auto  flex justify-around">
              <div
                style={{ background: "#EDEDED" }}
                className="py-6 md:py-10  rounded-3xl w-1/3 justify-center flex-col items-center"
              >
                <p className="text-3xl md:text-5xl font-bold text-center ">{avgStar}</p>
                <div className="flex  mt-3 justify-center">{renderStars()}</div>
                <p className="text-sm md:text-base mt-2 text-center">Đánh giá</p>
              </div>

              <div
                style={{ background: "#EDEDED" }}
                className="py-6 md:py-10 rounded-3xl w-full ml-3 "
              >
                {ratings.map((rating, index) => (
                  <RatingProgressBar
                    key={index}
                    star={rating.star}
                    percentage={rating.percentage}
                    total={rating.total}
                  />
                ))}
              </div>
            </div>
            <div className="w-4/5 mx-auto mt-6 p-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
              ) : (
                <div className="">
                  {reviews
                    .filter((review) => review.status === "active")
                    .map((review) => (
                      <ReviewCommentCard
                        key={review._id}
                        review={review}
                        userName={getUserName(review.user_id)}
                      />
                    ))}
                </div>
              )}
            </div>

            {/* Phân trang */}
            {totalPages > 1 && (
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}

            {/* Form nhập review mới */}
            <ProductReview ProductId={ProductId} updateReviews={updateReviews} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescription;