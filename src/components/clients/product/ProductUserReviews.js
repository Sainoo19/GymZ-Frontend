import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import useFetchAllReviews from "./useFetchAllReviews";
import { useAuth } from "../../../pages/client/AuthContext";

const ProductUserReviews = (activeTab = null) => {
  const { productId } = useParams();
  const URL_API = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { avgStar, totalReviews, ratings, fetchAllReviews } = useFetchAllReviews(productId);
  const { user } = useAuth();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${URL_API}users/all/nopagination`);
      if (response.data.status === "success") {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const role = user?.role || "user";
      const limit = role === "admin" ? 10 : 3;
      const response = await axios.get(`${URL_API}reviews/all/${productId}`, {
        params: { page: currentPage, limit }
      });

      if (response.data.status === "success") {
        const reviewData = response.data.data;
        setReviews(reviewData.reviews || []);
        setTotalPages(reviewData.totalPages);
      } else {
        console.error("Lỗi khi lấy đánh giá:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
    }
  };

  useEffect(() => {
    if (!activeTab || activeTab === "reviews") {
      fetchReviews();
      fetchUsers();
    }
  }, [productId, currentPage, activeTab, user?.role]);

  // Hàm refreshData sẽ làm mới cả reviews và số liệu thống kê
  const refreshData = async () => {
    await fetchAllReviews(); // Cập nhật ratings, avgStar và totalReviews
    await fetchReviews(); // Cập nhật reviews
  };

  return {
    reviews,
    users,
    avgStar,
    totalReviews,
    ratings,
    totalPages,
    currentPage,
    handlePageChange,
    fetchReviews,
    refreshData, // Export hàm này để component cha có thể làm mới dữ liệu
  };
};

export default ProductUserReviews;