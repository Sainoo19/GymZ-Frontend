import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import ExpandDown from "../../../assets/icons/Expand_down_light.svg";
import ExpandUp from "../../../assets/icons/Expand_up_light.svg";
const Search = ({ onSearch, onFilter, brands, categories, onSort }) => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // 🔥 Dùng mảng thay vì string

  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileFiltersBrand, setShowMobileFiltersBrand] = useState(false);
  const [showMobileSort, setShowMobileSort] = useState(false);

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
    <div className="w-full lg:w-1/4 mt-5 border rounded-md">
      <div className=" bg-white w-full h-full shadow-lg p-5 rounded-lg  z-50  overflow-y-auto">
        <h3 className="font-semibold mb-3">Tìm kiếm</h3>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />

        {/* Button hiển thị trên mobile */}
        <h4 className="font-medium mt-3">Tiêu chí</h4>
        <div className=" w-full flex lg:flex-col justify-between gap-2 ">
          <h3 className="font-semibold  hidden lg:block">Danh mục:</h3>
          <div className=" w-full  justify-end mt-1">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="border items-center flex justify-between border-gray-300 px-4 py-2 rounded-md w-full lg:hidden text-sm xs:text-xs"
            >
              Danh mục
              <img
                src={ExpandDown}
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  showMobileFilters ? "rotate-180" : "rotate-0"
                }`}
                alt="toggle icon"
              />
            </button>

            {/* Nội dung danh mục */}
            <div
              className={`${
                showMobileFilters ? "block" : "hidden"
              } lg:block w-full mt-1 border relative rounded-md px-2 `}
            >
              <div className="mb-4">
                <div className="flex flex-wrap lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-2 mt-2 w-full overflow-x-auto">
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
            </div>
          </div>
          <h3 className="font-semibold mt-2 hidden lg:block xl:block 2xl:block ">
            Thương hiệu:
          </h3>
          <div className=" w-full  justify-end mt-1">
            <button
              onClick={() => setShowMobileFiltersBrand(!showMobileFiltersBrand)}
              className="border  items-center flex justify-between border-gray-300 px-4 py-2  rounded-md w-full lg:hidden text-sm xs:text-xs"
            >
              Thương hiệu
              <img
                src={ExpandDown}
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  showMobileFiltersBrand ? "rotate-180" : "rotate-0"
                }`}
                alt="toggle icon"
              />
            </button>

            {/* Nội dung danh mục */}
            <div
              className={`${
                showMobileFiltersBrand ? "block" : "hidden"
              } lg:block w-full mt-1 border relative rounded-md px-2 `}
            >
              <div className="mb-4">
                <div className="flex flex-wrap lg:grid lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-2 w-full overflow-x-auto">
                  {brands.map((brand, index) => (
                    <button
                      key={index}
                      onClick={() => handleBrandSelect(brand)}
                      className={`px-1 py-2 rounded-lg border text-xs text-center min-w-[100px] 
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
            </div>
          </div>

          <h3 className="font-semibold mt-2 hidden lg:block xl:block 2xl:block ">
  Sắp xếp:
</h3>
<div className="w-full justify-end mt-1">
  <button
    onClick={() => setShowMobileSort(!showMobileSort)}
    className="border items-center flex justify-between border-gray-300 px-4 py-2 rounded-md w-full lg:hidden text-sm xs:text-xs"
  >
    Sắp xếp
    <img
      src={ExpandDown}
      className={`h-6 w-6 transform transition-transform duration-300 ${
        showMobileSort ? "rotate-180" : "rotate-0"
      }`}
      alt="toggle icon"
    />
  </button>

  <div
    className={`${
      showMobileSort ? "block" : "hidden"
    } lg:block w-full mt-1 border relative rounded-md px-2 `}
  >
    <div className="flex gap-2 my-2 w-full justify-start">
      {[
        { label: "A - Z", value: "asc" },
        { label: "Z - A", value: "desc" },
      ].map((option) => (
        <button
          key={option.value}
          onClick={() => {
            setSortOrder(option.value);
            onSort(option.value);
            setShowMobileSort(false); // Đóng lại sau khi chọn
          }}
          className={`px-2 py-2 rounded-lg border text-xs text-center w-full ${
            sortOrder === option.value
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
</div>

        </div>

        {/* Bộ lọc sắp xếp */}
        <div className="mt-4"></div>

        {/* Bộ lọc giá */}
        <div className="mt-4">
          <h4 className="font-medium">Khoảng giá</h4>
          <div className="flex gap-2 mt-2 justify-start items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceChange}
              className="border px-4 py-2 rounded-md w-full"
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={handlePriceChange}
              className="border px-4 py-2 rounded-md w-full"
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
