import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";

const Search = ({ onSearch, onFilter, brands, categories, onSort }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // 🔥 Dùng mảng thay vì string

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const dropdownRef = useRef(null);

  const handleClearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]); // Đặt thành mảng rỗng thay vì chuỗi rỗng

    setSortOrder("");
    setMinPrice("");
    setMaxPrice("");

    onFilter({ brands: [], categories: "", minPrice: "", maxPrice: "" });
    onSearch("");
    onSort("");
  };

  const hasFilters =
    selectedBrands.length > 0 ||
    selectedCategories.length > 0 ||
    minPrice ||
    maxPrice;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBrandSelect = (brand) => {
    let updatedBrands =
      brand === "Tất cả"
        ? []
        : selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands.filter((b) => b !== "Tất cả"), brand];

    setSelectedBrands(updatedBrands);

    // Nếu chọn "Tất cả", gửi danh sách rỗng để hiển thị toàn bộ sản phẩm
    onFilter({
      brands: brand === "Tất cả" ? [] : updatedBrands,
      categories: selectedCategories,
      minPrice,
      maxPrice,
    });
  };

  const handleCategorySelect = (category) => {
    let updatedCategories = selectedCategories.includes(category._id)
      ? selectedCategories.filter((id) => id !== category._id) // Bỏ chọn nếu đã chọn
      : [...selectedCategories, category._id]; // Thêm vào danh sách nếu chưa có

    setSelectedCategories(updatedCategories);
    onFilter({
      brands: selectedBrands,
      categories: updatedCategories,
      minPrice,
      maxPrice,
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    onSort(e.target.value);
  };

  const handlePriceChange = () => {
    onFilter({
      brands: selectedBrands,
      categories: selectedCategories,
      minPrice,
      maxPrice,
    });
  };

  return (
    <div className="flex mt-5 gap-4 w-1/4  justify-center border rounded-md  mr-2">
      <div className=" bg-white w-full h-full shadow-lg p-5 rounded-lg  z-50  overflow-y-auto">
        <h3 className="font-semibold mb-3">Tìm kiếm</h3>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        <h3 className="font-semibold mb-3">Lọc theo:</h3>

        {/* Bộ lọc danh mục */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Danh mục</h4>
          {/* <div className="grid grid-cols-3 gap-2 mt-2 w-full"> */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-2 w-full">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => handleCategorySelect(category)}
                className={`px-1 py-2 rounded-lg border text-xs text-center min-w-[100px] 
             ${
               selectedCategories.includes(category._id)
                 ? "bg-red-600 text-white"
                 : "bg-gray-200"
             }
           `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Bộ lọc thương hiệu */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Thương hiệu</h4>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-2 w-full">
            {brands.map((brand, index) => (
              <button
                key={index}
                onClick={() => handleBrandSelect(brand)}
                className={`px-1 py-2 rounded-lg border text-xs  text-center min-w-[100px] 
          ${
            selectedBrands.includes(brand)
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }
        `}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Bộ lọc sắp xếp */}
        <div className="mt-4">
          <h4 className="font-medium">Sắp xếp</h4>
          <select
            className="border px-4 py-2 rounded-md w-full mt-2 text-xs "
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option className="text-xs " value="asc">
              A - Z
            </option>
            <option className="text-xs " value="desc">
              Z - A
            </option>
          </select>
        </div>

        {/* Bộ lọc giá */}
        <div className="mt-4">
          <h4 className="font-medium">Khoảng giá</h4>
          <div className="flex gap-2 mt-2 justify-center items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceChange}
              className="border px-4 py-2 rounded-md w-2/5"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceChange}
              className="border px-4 py-2 rounded-md w-2/5"
            />
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className={`my-4 px-4 py-2 rounded-md w-full text-white ${
            hasFilters ? "bg-red-600" : "bg-gray-400"
          }`}
          disabled={!hasFilters}
        >
          Xoá bộ lọc
        </button>
      </div>
    </div>
  );
};

export default Search;
