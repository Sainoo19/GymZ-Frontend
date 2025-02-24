import React from "react";
import { FaStar } from "react-icons/fa";

const RatingProgressBar = ({ star, percentage, total }) => {
  return (
    <div className=" justify-center flex items-center w-5/6 mx-auto space-x-4">
    

      {/* Thanh tiến trình */}
      <div className="w-2/4">
        <div className="h-2 bg-gray-300 rounded-lg overflow-hidden">
          <div
            className="h-full bg-green-700 rounded-lg"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
  {/* Số sao */}
  <div className="w-1/6 flex justify-end">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-yellow-500 text-lg ${
              index < star ? "opacity-100" : "opacity-30"
            }`}
          />
        ))}
      </div>
      {/* Phần trăm + số lượng đánh giá */}
      <div className="w-1/6 flex items-start">
        <span className="text-blue-700 font-semibold">{percentage}%</span>
        <span className="ml-3 text-gray-500 text-sm">({total})</span>
      </div>
    </div>
  );
};

export default RatingProgressBar;
