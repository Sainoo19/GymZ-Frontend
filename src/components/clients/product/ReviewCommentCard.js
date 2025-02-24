import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";



// Component hiển thị từng review
const ReviewCommentCard = ({ review,userName  }) => {
  // Render số sao
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={`text-yellow-400 ${index < rating ? "opacity-100" : "opacity-30"}`}
      />
    ));
  };

  return (
    <div className="border-b px-6  py-4 mb-4  bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex mt-2">{renderStars(review.rating)}</div>
      <div className="flex items-center space-x-3">  
        <p className="font-semibold mt-3">{userName}</p>
      </div>


      <p className="mt-2 text-gray-700 break-words">{review.comment}</p>

      <p className="text-sm text-gray-500 mt-3">
        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
      </p>
    </div>
  );
};

export default ReviewCommentCard;
