import axios from "axios";
import { React, use, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa"; // Import icon sao
import RatingProgressBar from "../product/RatingProgressBar";
import ReviewCommentCard from "./ReviewCommentCard";

const ProductDescription = ({ description, ProductId }) => {
  const [activeTab, setActiveTab] = useState("details");
  const URL_API = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgStar, setAvgStar] = useState(0);
  const [ratings, setRatings] = useState([]);

  const calculateRatings = (reviews) => {
    const totalReviews = reviews.length;
    const ratingCounts = [0, 0, 0, 0, 0]; 

    // Đếm số đánh giá cho từng mức sao
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    // Tính phần trăm và tạo danh sách ratings
    const ratings = ratingCounts.map((count, index) => ({
      star: 1 + index, 
      total: count,
      percentage:
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    })).sort((a, b) => b.star - a.star);;
console.log("ratings",ratings);
    return ratings;
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${URL_API}reviews/${ProductId}`);
      if (response.data.status === "success") {
        const reviewData = response.data.data;
        setReviews(response.data.data.reviews || []);
        setTotalReviews(response.data.data.totalReviews);
        setRatings(calculateRatings(reviewData.reviews));

        if (reviewData.reviews.length > 0) {
          const totalStars = reviewData.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          const average = totalStars / reviewData.reviews.length;
          setAvgStar(parseFloat(average.toFixed(1)));
        } else {
          setAvgStar(0);
        }
      } else {
        console.error("Lỗi khi lấy đánh giá:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };
  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, ProductId]);

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
    <div>
      <div className="w-4/5 container mx-auto   font-roboto my-10 border-b border-gray-300">
        <div className="w-1/2  justify-around flex container mx-auto  ">
          <button
            className={`text-lg pb-1 ${
              activeTab === "details" ? "borer border-black" : ""
            }`}
            onClick={() => setActiveTab("details")}
            type="button"
          >
            Chi tiết sản phẩm
          </button>
          <button
            className={`text-lg pb-1 ${
              activeTab === "reviews" ? "borer border-black" : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá
          </button>
        </div>
      </div>

      <div className="w-full container mx-auto">
        {activeTab === "details" ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <div>
            <div className="flex">
              <h1>All reviews</h1>
              <p className="text-gray-500 ml-2">({totalReviews})</p>
            </div>

            <div className=" mt-8 container mx-auto w-1/2 flex justify-around">
              <div
                style={{ background: "#EDEDED" }}
                className="py-10  rounded-3xl w-1/3 justify-center flex-col items-center  "
              >
                <p className="text-5xl font-bold text-center ">{avgStar}</p>
                <div className="flex  mt-3 justify-center">{renderStars()}</div>
                <p className="mt-2 text-center">Đánh giá</p>
              </div>

              <div
                style={{ background: "#EDEDED" }}
                className="py-10 rounded-3xl w-full ml-3 "
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
                reviews.map((review) => (
                  <ReviewCommentCard key={review._id} review={review} />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDescription;
