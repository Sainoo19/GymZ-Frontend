import { React, useEffect, useState } from "react";
import formatCurrency from "../../utils/formatCurrency";
const ProductImage = ({
  avatar,
  images,
  name,
  minPrice,
  maxPrice,
  variations,
}) => {
  const [quantity, setQuantity] = useState(1);
  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleChangeQuantity = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && Number(value) >= 1) {
      setQuantity(Number(value));
    } else if (value === "") {
      setQuantity(1);
    }
  };

  return (
    <div>
      <div className="flex justify-around container w-3/4 mx-auto">
        <div className=" w-1/2 ">
          <img src={avatar} className="  container mx-auto" />

          <div className="flex items-center justify-around">
            {images && images.length > 0 ? (
              images.map((img, index) => (
                <img key={index} src={img} className="w-1/4" />
              ))
            ) : (
              <p>No image</p>
            )}
          </div>
        </div>
        <div className="w-full ">
          <h1 className="font-semibold text-2xl">{name}</h1>
          <p>
            {minPrice === maxPrice
              ? formatCurrency(minPrice)
              : `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`}
          </p>

          <p>loại</p>
          <div className="flex ">
            {variations &&
              Array.from(new Set(variations.map((v) => v.theme))).map(
                (category, index) => (
                  <div key={index}>
                    <button className="bg-[#F0F0F0] text-gray-500 rounded-3xl py-1 px-5" value={category}>{category}</button>
                  </div>
                )
              )}
          </div>
          <div>
            {variations &&
              Array.from(new Set(variations.map((v) => v.category))).map(
                (category, index) => (
                  <div key={index}>
                    <p>{category}</p>
                  </div>
                )
              )}
          </div>

          <div className="flex bg-gray-200 w-2/12 h-9 justify-around rounded-2xl items-center ">
            <button className="font-medium text-2xl" onClick={decrease}>
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={handleChangeQuantity}
              className="font-medium text-base w-1/4 bg-transparent text-center focus:outline-none"
            ></input>
            <button className="font-medium text-xl" onClick={increase}>
              +
            </button>
          </div>
          <button className="bg-blue-500 text-white rounded-2xl w-2/12 h-9">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
