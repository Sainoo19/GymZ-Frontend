import React from "react";

const CardFacilities = ({ image, street, name }) => {
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-lg shadow-lg border border-secondary">
      {/* Hình ảnh cơ sở */}
      <img src={image} alt={name} className="w-full h-72 object-cover" />

      {/* Street ở góc trái trên */}
      <div className="absolute top-4 right-0 bg-yellow-100 bg-opacity-60  text-s px-2 py-1 rounded-tl rounded-bl">
        {street}
      </div>

      {/* Tên cơ sở dưới hình */}
      <div className="absolute bottom-0 w-full bg-yellow-100 bg-opacity-80 text-center py-2">
        <p className="text-lg font-bold">{name}</p>
      </div>
    </div>
  );
};

export default CardFacilities;
