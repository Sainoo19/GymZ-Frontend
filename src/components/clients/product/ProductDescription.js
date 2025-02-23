import axios from "axios";
import { React, use, useState, useEffect } from "react";
import { FaStar } from "react-icons/fa"; // Import icon sao
import RatingProgressBar from "../product/RatingProgressBar";
const ProductDescription = ({ description, ProductId }) => {
  const [activeTab, setActiveTab] = useState("details");
  const URL_API = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgStar, setAvgStar] = useState(0);
  const ratings = [
    { star: 5, percentage: 70, total: 140 },
    { star: 4, percentage: 20, total: 40 },
    { star: 3, percentage: 5, total: 10 },
    { star: 2, percentage: 3, total: 6 },
    { star: 1, percentage: 2, total: 4 },
  ];
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${URL_API}reviews/${ProductId}`);
      if (response.data.status === "success") {
        const reviewData = response.data.data;
        setReviews(response.data.data);
        setTotalReviews(response.data.data.totalReviews);

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

      <div className="w-f container mx-auto">
        {activeTab === "details" ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <div>
            <div className="flex">
              <h1>All reviews</h1>
              <p className="text-gray-500 ml-2">({totalReviews})</p>
            </div>

            <div className=" mt-8 border  w-full flex justify-around">
              <div
                style={{ background: "#EDEDED" }}
                className="py-14  rounded-3xl w-4/12 justify-center flex-col items-center  "
              >
                <p className="text-5xl font-bold text-center ">{avgStar}</p>
                <div className="flex  mt-3 justify-center">{renderStars()}</div>
                <p className="mt-2 text-center">Đánh giá</p>
              </div>

              <div
                style={{ background: "#EDEDED" }}
                className="py-14 rounded-3xl w-3/4"
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

            {/* {{reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b py-3">
                  <p className="font-semibold">{review.user}</p>
                  <p>{review.comment}</p>
                </div>
              )) */}
            {/* ) : (
              <p>Chưa có đánh giá nào.</p>
            )} } */}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDescription;
