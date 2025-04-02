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
    <div className="card" style={{ display: "flex", padding: "10px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center", flexDirection: "column", alignItems: "center", }}>
      <img src={image} alt={name} style={{ width: "260px", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px", }} />
      <h3 style={{ marginTop: "10px", fontSize: "18px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</h3>
      <p style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>{price} VNĐ</p>
      <div style={{ marginTop: "5px", display: "flex", justifyContent: "center" }}>
        {renderStars(rating)}
      </div>
    </div>
  );
};

export default CardTopProduct;