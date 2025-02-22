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
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOriginalPrice, setSelectedOriginalPrice] = useState(null);
  const [selectedSalePrice, setSelectedSalePrice] = useState(null);
  const [percentDiscount, setPercentDiscount] = useState(0);
  const roundNumber = (num) => Math.round(num);

  const themes = variations
    ? Array.from(new Set(variations.map((v) => v.theme)))
    : [];
  const categories = variations
    ? Array.from(new Set(variations.map((v) => v.category)))
    : [];
  const isSelectionRequired = themes.length > 0 && categories.length > 0;
  const isDisabled =
    isSelectionRequired && (!selectedTheme || !selectedCategory);

  useEffect(() => {
    if (!variations) return;
    let foundVariation;
    if (selectedTheme && selectedCategory) {
      foundVariation = variations.find(
        (v) => v.theme === selectedTheme && v.category === selectedCategory
      );
    } else if (selectedCategory) {
      // Chỉ tìm theo category nếu không có theme
      foundVariation = variations.find((v) => v.category === selectedCategory);
    }
    setSelectedOriginalPrice(
      foundVariation ? foundVariation.originalPrice : null
    );
    setSelectedSalePrice(foundVariation ? foundVariation.salePrice : null);

    setPercentDiscount(
      roundNumber(100 - (selectedSalePrice / selectedOriginalPrice) * 100)
    );
  }, [selectedTheme, selectedCategory, variations]);

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
      <div className="flex justify-around container items-center w-3/4 mx-auto">
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
          <h1 className="font-normal text-xl">{name}</h1>

          <div className="flex items-center justify-st">
            <p className="text-2xl font-semibold my-3 de">
              {selectedSalePrice !== null
                ? formatCurrency(selectedSalePrice) // Hiển thị giá khi chọn category + theme
                : minPrice === maxPrice
                ? formatCurrency(minPrice)
                : `${formatCurrency(minPrice)} - ${formatCurrency(
                    maxPrice
                  )}`}{" "}
              VND
            </p>

            {selectedOriginalPrice ? (
              <p className="text-dec line-through text-gray-400 ml-3">
                {formatCurrency(selectedOriginalPrice)} VND{" "}
              </p>
            ) : null}

        
              {percentDiscount ? <p className="text-red-600 ml-3 border border-red-500 px-3 rounded-xl bg-red-200">- {Math.round(percentDiscount)} %</p> : null}
            
          </div>

          <div className="border-b border-gray-300 my-3 rounded-lg "></div>

          {themes.length > 0 && (
            <>
              <p className="my-3">Loại hàng</p>
              <div className="flex ml-2">
                {themes.map((theme, index) => (
                  <button
                    key={index}
                    className={`rounded-3xl py-1 px-5 mr-4 transition-all duration-200 ${
                      selectedTheme === theme
                        ? "bg-primary text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </>
          )}

          {categories.length > 0 && (
            <>
              {" "}
              <p className="my-3">Phân loại</p>
              <div className="flex ml-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`rounded-3xl py-1 px-5 mr-4 transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="border-b border-gray-300 my-3 rounded-lg "></div>

          <div className="flex items-center my-7 w-11/12 justify-start ">
            <div className="flex bg-gray-200 w-1/5 h-9 justify-around rounded-2xl items-center ">
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

            <button
              className={`rounded-2xl w-1/2 ml-3 h-9 ${
                isDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary text-white"
              }`}
              disabled={isDisabled}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
