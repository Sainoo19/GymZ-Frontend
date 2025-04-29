import { useState, useEffect } from "react";
import axios from "axios";

const useFetchAllReviews = (ProductId) => {
  const [avgStar, setAvgStar] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [reviewsAll, setReviewsAll] = useState([]);
  const URL_API = process.env.REACT_APP_API_URL;



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
    const ratings = ratingCounts
      .map((count, index) => ({
        star: 1 + index,
        total: count,
        percentage:
          totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
      }))
      .sort((a, b) => b.star - a.star);
    return ratings;
  };

  const fetchAllReviews = async () => {
    try {
      const response = await axios.get(`${URL_API}reviews/all/nopagination/${ProductId}`);

      if (response.data.status === "success") {
        const reviewData = response.data.data;
        setReviewsAll(response.data.data.reviews || []);
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

        // setTotalPages(reviewData.totalPages);
        // setCurrentPage(currentPage);
        // console.log(reviewData);
      } else {
        console.error("Lỗi khi lấy tất cả đánh giá:", response.data.message);
      }


    } catch (error) {
      console.error("Lỗi khi lấy danh sách tất cả review:", error);
    }
  };


  useEffect(() => {
    fetchAllReviews();
  }, [ProductId]);

  return { reviewsAll, avgStar, totalReviews, ratings};
};

export default useFetchAllReviews;
