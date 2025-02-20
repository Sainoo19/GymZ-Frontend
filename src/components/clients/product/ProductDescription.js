import { React, useState } from "react";

const ProductDescription = ({ description, reviews }) => {
  const [activeTab, setActiveTab] = useState("details");

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
            {/* {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b py-3">
                  <p className="font-semibold">{review.user}</p>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              <p>Chưa có đánh giá nào.</p>
            )} */}
            <p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p><p>Chưa có đánh giá nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDescription;
