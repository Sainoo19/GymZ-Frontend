import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/clients/product/ProductCard";
import Search from "../../../components/clients/product/Search";
import Pagination from "../../../components/admin/layout/Pagination";
// import Banner from "../../components/clients/product/Banner"

const ProductsClient = () => {
  const URL_API = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minMaxPrices, setMinMaxPrices] = useState({});
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page, filters = {}, searchText = "") => {
    try {
      const response = await axios.get(`${URL_API}productClient/all/active`, {
        params: {
          page,
          limit: 8,
          search: searchText,
          brands: filters.brands?.join(","),
          categories: Array.isArray(filters.categories)
            ? filters.categories
              .map((cat) => (typeof cat === "string" ? cat : cat._id))
              .join(",")
            : "",

          priceMin: filters.minPrice,
          priceMax: filters.maxPrice,
        },
      });

      if (response.data.status === "success") {
        setProducts(response.data.data.products);
        setFilteredProducts(response.data.data.products);
        setTotalPages(response.data.metadata.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMinMaxPrices = async () => {
    try {
      const response = await axios.get(`${URL_API}productClient/minprice`, {
        headers: { "Cache-Control": "no-cache" },
      });
      const priceMap = response.data.data.reduce((acc, item) => {
        acc[item._id] = item.minSalePrice;
        return acc;
      }, {});
      setMinMaxPrices(priceMap);
    } catch (error) {
      console.error("Error fetching min-max prices:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get(`${URL_API}productClient/brands`);
      if (response.data.status === "success") {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${URL_API}productClient/categories`);
      console.log("API response:", response.data); // ✅ Kiểm tra dữ liệu trả về

      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else if (
        response.data.status === "success" &&
        Array.isArray(response.data.data)
      ) {
        setCategories(response.data.data);
      } else {
        console.error("Invalid category data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    fetchMinMaxPrices();
    fetchBrands();
    fetchCategories();
  }, [currentPage]); // ✅ Chỉ theo dõi `currentPage`

  const handlePageChange = (page) => {
    if (page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (searchText) => {
    if (searchText.trim() === "") {
      // Nếu xóa tìm kiếm, gọi lại API để lấy danh sách sản phẩm đầy đủ
      fetchProducts(currentPage);
    } else {
      // Nếu có nội dung tìm kiếm, lọc danh sách sản phẩm
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / 10)); // Cập nhật lại số trang
    }
    setCurrentPage(1); // Luôn quay về trang đầu tiên khi tìm kiếm
  };

  const handleFilter = (filters) => {
    let filtered = products;
    console.log("Filters:", filters); // ✅ Kiểm tra giá trị của filters
    if (
      !filters.categories &&
      (!filters.brands || filters.brands.length === 0) &&
      !filters.minPrice &&
      !filters.maxPrice
    ) {

      setFilteredProducts(products);
      return;
    }
    console.log("products:", products); // ✅ Kiểm tra giá trị của products
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => minMaxPrices[product._id] >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => minMaxPrices[product._id] <= Number(filters.maxPrice)
      );
    }

    // Cập nhật lại danh sách sản phẩm đã lọc
    setFilteredProducts(filtered);
    console.log("Filtered products by categories:", filteredProducts); // ✅ Kiểm tra giá trị của filtered


    // Cập nhật lại số trang dựa trên danh sách đã lọc
    setTotalPages(Math.ceil(filtered.length / 10));

    // Đặt lại trang hiện tại về 1 để tránh hiển thị trang trống
    setCurrentPage(1);
  };

  const handleSort = (sortOrder) => {
    let sortedProducts = [...filteredProducts];

    if (sortOrder === "priceAsc") {
      sortedProducts.sort(
        (a, b) => (minMaxPrices[a._id] || 0) - (minMaxPrices[b._id] || 0)
      );
    } else if (sortOrder === "priceDesc") {
      sortedProducts.sort(
        (a, b) => (minMaxPrices[b._id] || 0) - (minMaxPrices[a._id] || 0)
      );
    } else if (sortOrder === "asc") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "desc") {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(sortedProducts);
  };

  if (loading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20  mb-10 ">
      {/* <div className='flex justify-center items-center'> */}
      <div className="flex flex-col lg:flex-row justify-around items-start  sm:justify-center gap-4">
        <Search
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          brands={brands}
          // categories={[{ _id: "", name: "Tất cả" }, ...categories]}
          categories={categories}
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-start mt-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                minSalePrice={minMaxPrices[product._id]}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No products found.</p>
          )}
        </div>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductsClient;
