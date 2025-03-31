import React from "react";
import { FaStar } from "react-icons/fa";

const CardTopProduct = ({ image, name, price, rating }) => {
  // Hàm render đánh giá sao


  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < rating ? <FaStar key={i} color="gold" /> : <FaStar key={i} color="gray" />);
    }
    return stars;
  };

  return (
    <div className="card" style={{display: "flex", padding: "10px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", textAlign: "center", flexDirection: "column",alignItems: "center", }}>
      <img src={image} alt={name} style={{ width: "260px", height: "300px", objectFit: "cover", borderRadius: "8px", marginBottom: "10px", }} />
      <h3 style={{marginTop: "10px", fontSize: "18px", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis"}}>{name}</h3>
      <p style={{ color: "#333", fontSize: "16px", fontWeight: "bold" }}>{price} VNĐ</p>
      <div style={{ marginTop: "5px", display: "flex", justifyContent: "center" }}>{renderStars(rating)}</div> {/* Sử dụng display: flex */}
    </div>
  );
};

export default CardTopProduct;
