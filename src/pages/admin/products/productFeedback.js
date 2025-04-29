import { React } from "react";
import { FaStar } from "react-icons/fa"; // Import icon sao
import RatingProgressBar from "../../../components/clients/product/RatingProgressBar";
import ReviewCommentCard from "../../../components/clients/product/ReviewCommentCard";
import Pagination from "../../../components/admin/layout/Pagination";
import ProductReview from "../../../components/clients/product/ProductReview";
import { useParams } from "react-router-dom"; // import đúng
import ProductUserReviews from "../../../components/clients/product/ProductUserReviews";
import { useAuth } from "../../client/AuthContext";




const ProductFeedbackReview = () => {

    const { reviews, users, avgStar, totalReviews, ratings, currentPage, totalPages, handlePageChange } = ProductUserReviews();

    const { productId } = useParams();
    const { user } = useAuth(); 
    const isUser = user === 'user';
    
    // const URL_API = process.env.REACT_APP_API_URL;
    // const [ reviews, setReviews] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(1);
    // const [users, setUsers] = useState([]);
    // const { avgStar, totalReviews, ratings } = useFetchAllReviews(productId);

    // const handlePageChange = (page) => {
    //     setCurrentPage(page);
    //   };

    //   const fetchUsers = async () => {
    //     try {
    //       const response = await axios.get(`${URL_API}users/all/nopagination`);
    //       if (response.data.status === "success") {
    //         setUsers(response.data.data);
    //         // console.log(response.data.data)
    //       }
    //     } catch (error) {
    //       console.error("Lỗi khi lấy danh sách người dùng:", error);
    //     }
    //   };
      
    //   const fetchReviews = async () => {
    //     try {
    //       const response = await axios.get(`${URL_API}reviews/${productId}`,
    //         {
    //           params: {
    //             page: currentPage,
    //             limit: 10
    //           },
    //           withCredentials: true
    //         }
    //       );
    //       if (response.data.status === "success") {
    //         const reviewData = response.data.data;
    //         setReviews(response.data.data.reviews || []);
    //         setTotalPages(reviewData.totalPages);
    //         setCurrentPage(currentPage);
    //         console.log(reviewData);
    //       } else {
    //         console.error("Lỗi khi lấy đánh giá:", response.data.message);
    //       }
    //     } catch (error) {
    //       console.error("Lỗi khi lấy đánh giá:", error);
    //     }
    //   };

    //     useEffect(() => {
          
    //         fetchReviews();
    //         fetchUsers();
    //         window.scrollTo(0, 0)
          
    //     }, [ productId, currentPage]);

      const getUserName = (userId) => {
        const user = users.find((u) => u._id === userId);
    
        return user ? user.name : "Người dùng ẩn danh";
      };

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

      const updateReviews = () => {
        handlePageChange(1); 
    };


    return(
        <div className="">
        <div className="flex ml-20">
          <h1>Toàn bộ đánh giá</h1>
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
            <div className="">
            {reviews.map((review) => (
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
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

        {/* Form nhập review mới */}
        {isUser && (
        <ProductReview ProductId={productId} updateReviews={updateReviews} />
      )}      

      </div>

    );
};

export default ProductFeedbackReview;
