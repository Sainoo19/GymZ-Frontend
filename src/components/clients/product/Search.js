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
  const [showMobileFiltersCategory, setShowMobileFiltersCategory] =
    useState(false);
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
    let updatedBrands = [];

    if (brand === "Tất cả") {
      // Khi chọn "Tất cả", xóa tất cả các lựa chọn trước đó
      updatedBrands = selectedBrands.includes("Tất cả") ? [] : ["Tất cả"];
    } else {
      // Nếu chọn một thương hiệu cụ thể
      updatedBrands = selectedBrands.includes(brand)
        ? selectedBrands.filter((b) => b !== brand) // Nếu đã chọn, bỏ chọn
        : [...selectedBrands, brand]; // Nếu chưa chọn, thêm vào mảng
    }

    setSelectedBrands(updatedBrands);

    // Cập nhật bộ lọc
    onFilter({
      brands: updatedBrands.includes("Tất cả") ? [] : updatedBrands, // Nếu "Tất cả" được chọn, gửi mảng rỗng
      categories: selectedCategories,
      minPrice,
      maxPrice,
    });
  };

  const handleCategorySelect = (category) => {
    if (category.name === "Tất cả") {
      setSelectedCategories([]);
      onFilter({
        brands: selectedBrands,
        categories: [],
        minPrice,
        maxPrice,
      });
      return;
    }

    let updatedCategories = selectedCategories.includes(category._id)
      ? selectedCategories.filter((id) => id !== category._id)
      : [...selectedCategories.filter((id) => id !== "Tất cả"), category._id];

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
        <h3 className="text-base lg:text-lg font-semibold mb-3">Tìm kiếm</h3>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchText}
          onChange={handleSearchChange}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />

        {/* Button hiển thị trên mobile */}
        <h3 className="font-semibold mt-2 block text-base lg:text-lg  lg:hidden xl:hidden 2xl:hidden">
          Lọc theo
        </h3>
        <div className=" w-full flex lg:flex-col justify-between gap-2 ">
          <h3 className="font-semibold mt-2 hidden lg:block">Danh mục:</h3>
          <div className="w-full justify-end mt-1">
            <button
              onClick={() =>
                setShowMobileFiltersCategory(!showMobileFiltersCategory)
              }
              className="border items-center flex justify-between border-gray-300 px-4 py-1 rounded-md w-full lg:hidden text-sm xs:text-xs"
            >
              Danh mục
              <img
                src={ExpandDown}
                className={`h-6 w-6 transform transition-transform duration-300 ${
                  showMobileFiltersCategory ? "rotate-180" : "rotate-0"
                }`}
                alt="toggle icon"
              />
            </button>
            {/* Nội dung thương hiệu */}
            <div
              className={`${
                showMobileFiltersCategory ? "block" : "hidden"
              } lg:block w-full mt-1 relative rounded-md px-2`}
            >
              <div className="mb-4">
                <div className="flex flex-col gap-2 mt-2 w-full">
                  {categories.map((category, index) => {
                    const isSelected = selectedCategories.includes(
                      category._id
                    );

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 cursor-pointer text-sm select-none"
                        onClick={() => handleCategorySelect(category)}
                        tabIndex={0} 
                        onFocus={(e) => e.currentTarget.blur()} 
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-200 mr-1
    ${
      isSelected
        ? "border-2 border-orange-500 ring-4 ring-yellow-500"
        : "border border-gray-400"
    }
  `}
                          style={{ outline: "none" }}
                        ></div>

                        <span className="text-xs lg:text-sm">
                          {category.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-semibold mt-2 hidden lg:block xl:block 2xl:block">
            Thương hiệu:
          </h3>
          <div className="w-full justify-end mt-1">
            <button
              onClick={() => setShowMobileFiltersBrand(!showMobileFiltersBrand)}
              className="border items-center flex justify-between border-gray-300 px-4 py-1 rounded-md w-full lg:hidden text-sm xs:text-xs"
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

            {/* Nội dung thương hiệu */}
            <div
              className={`${
                showMobileFiltersBrand ? "block" : "hidden"
              } lg:block w-full mt-1 relative rounded-md px-2`}
            >
              <div className="mb-4">
                <div className="flex flex-col gap-2 mt-2 w-full">
                  {brands.map((brand, index) => {
                    const isSelected = selectedBrands.includes(brand);

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 cursor-pointer text-sm select-none"
                        onClick={() => handleBrandSelect(brand)}
                        tabIndex={0} // 👈 Thêm để div có thể nhận focus (nếu bạn cần focus)
                        onFocus={(e) => e.currentTarget.blur()} // 👈 Tắt focus để chặn outline xanh
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-all duration-200 mr-1
    ${
      isSelected
        ? "border-2 border-orange-500 ring-4 ring-yellow-500"
        : "border border-gray-400"
    }
  `}
                          style={{ outline: "none" }}
                        ></div>

                        <span className="text-xs lg:text-sm">{brand}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="border border-gray-100 w-full mt-1 rounded-lg hidden lg:block"></div>

          <h3 className="font-semibold mt-2 hidden lg:block xl:block 2xl:block ">
            Sắp xếp:
          </h3>
          <div className="w-full justify-end mt-1">
            <button
              onClick={() => setShowMobileSort(!showMobileSort)}
              className="border items-center flex justify-between border-gray-300 px-4 py-1 rounded-md w-full lg:hidden text-sm xs:text-xs"
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
              } lg:block w-full mt-1 relative rounded-md px-2 `}
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
          <h4 className="font-medium text-base lg:text-lg ">Khoảng giá</h4>
          <div className="flex gap-2 mt-2 justify-start items-center">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={handlePriceChange}
              className="border px-4 py-1 rounded-md w-full "
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
