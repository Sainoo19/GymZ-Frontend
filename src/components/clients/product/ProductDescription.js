import axios from "axios";
import { React, use, useState, useEffect } from "react";

const ProductDescription = ({ description, ProductId }) => {
  const [activeTab, setActiveTab] = useState("details");
  const URL_API = process.env.REACT_APP_API_URL;
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${URL_API}reviews/${ProductId}`);
      if (response.data.status === "success") {
        setReviews(response.data.data);
        setTotalReviews(response.data.data.totalReviews);
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
  return (
    <div>
      <div className="w-4/5 container mx-auto  my-10 border-b border-gray-300">
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

      <div className="w-4/5 container mx-auto">
        {activeTab === "details" ? (
          <div dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <div>
            <div className="flex">
              <h1>All reviews</h1>
              <p className= "text-gray-500 ml-2">({totalReviews})</p>
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
