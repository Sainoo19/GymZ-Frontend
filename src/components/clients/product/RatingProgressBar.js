import React from "react";
import { FaStar } from "react-icons/fa";

const RatingProgressBar = ({ star, percentage, total }) => {
  return (
    <div className="flex items-center space-x-4 w-1/2">
      {/* Thanh tiến trình */}
      <div className="flex-1 h-2 bg-gray-200 rounded-lg w-full overflow-hidden">
        <div
          className="h-full bg-green-700 rounded-r-3xl"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Số sao */}
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-yellow-500 ${index < star ? "opacity-100" : "opacity-30"}`}
          />
        ))}
      </div>

      {/* Phần trăm */}
      <span className="text-blue-700 font-semibold">{percentage}%</span>

      {/* Số đánh giá */}
      <span className="text-gray-500">({total})</span>
    </div>
  );
};

export default RatingProgressBar;
