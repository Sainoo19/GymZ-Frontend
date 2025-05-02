import React from "react";
import { FaStar } from "react-icons/fa";

const CardTopProduct = ({ image, name, price, rating }) => {
  // Render stars with partial filling like in ProductCard.js
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const fillPercentage = Math.min(Math.max(rating - (i - 1), 0), 1) * 100;

      stars.push(
        <div key={i} className="relative inline-block w-4 h-4 mx-[1px]">
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
    <div className="flex flex-col items-center p-3 border border-gray-200 rounded-lg shadow-md text-center transition-all duration-300 hover:shadow-lg hover:border-secondary transform hover:-translate-y-1">
      <div className="overflow-hidden rounded-lg w-full h-[300px] mb-3">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain rounded-lg transition-transform duration-500 hover:scale-105"
        />
      </div>
      <h3 className="mt-2 text-lg font-semibold text-primary line-clamp-1 w-full">{name}</h3>
      <p className="text-primary font-bold text-base mt-1">{price} VNĐ</p>
      <div className="mt-2 flex justify-center">
        {renderStars(rating)}
      </div>
    </div>
  );
};

export default CardTopProduct;