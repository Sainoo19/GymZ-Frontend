import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from "../../components/clients/layouts/ProductClient/ProductCard";
import Search from "../../components/clients/layouts/ProductClient/Search";
import Pagination from "../../components/admin/layout/Pagination";

const ProductsClient = () => {
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
      const response = await axios.get("http://localhost:3000/productClient/all/active", {
        params: { 
          page, 
          limit: 10,
          search: searchText,
          brands: filters.brands?.join(","), 
          categories: filters.categories?.join(","), // ✅ Đảm bảo gửi ID thay vì tên
          priceMin: filters.minPrice,
          priceMax: filters.maxPrice
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
      const response = await axios.get('http://localhost:3000/productClient/minprice', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      const priceMap = response.data.data.reduce((acc, item) => {
        acc[item._id] = item.minSalePrice;
        return acc;
      }, {});
      setMinMaxPrices(priceMap);
    } catch (error) {
      console.error('Error fetching min-max prices:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productClient/brands');
      if (response.data.status === 'success') {
        setBrands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productClient/categories");
      console.log("API response:", response.data);  // ✅ Kiểm tra dữ liệu trả về
  
      if (Array.isArray(response.data)) { //  Kiểm tra nếu dữ liệu trả về là mảng
        setCategories(response.data);  // Cập nhật danh mục đúng cách
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
  }, [currentPage]);  // ✅ Chỉ theo dõi `currentPage`
  

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
    fetchProducts(1, {}, searchText);
  };
  
  
  

  const handleFilter = (filters) => {
    let filtered = products;
  
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category?._id || product.category));

    }
    
  
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(product => filters.brands.includes(product.brand));
    }
  
    if (filters.minPrice) {
      filtered = filtered.filter((product) => minMaxPrices[product._id] >= Number(filters.minPrice));
    }
  
    if (filters.maxPrice) {
      filtered = filtered.filter((product) => minMaxPrices[product._id] <= Number(filters.maxPrice));
    }
  
    // Cập nhật lại danh sách sản phẩm đã lọc
    setFilteredProducts(filtered);
  
    // Cập nhật lại số trang dựa trên danh sách đã lọc
    setTotalPages(Math.ceil(filtered.length / 10));
  
    // Đặt lại trang hiện tại về 1 để tránh hiển thị trang trống
    setCurrentPage(1);
    fetchProducts(1, filters); // Gọi lại API với bộ lọc
    
  };
  
  const handleSort = (sortOrder) => {
    let sortedProducts = [...filteredProducts];

    if (sortOrder === "priceAsc") {
      sortedProducts.sort((a, b) => (minMaxPrices[a._id] || 0) - (minMaxPrices[b._id] || 0));
    } else if (sortOrder === "priceDesc") {
      sortedProducts.sort((a, b) => (minMaxPrices[b._id] || 0) - (minMaxPrices[a._id] || 0));
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
    <div className="ml-10 mt-10">
     

<Search
  onSearch={handleSearch}
  onFilter={handleFilter}
  onSort={handleSort}
  brands={brands}
  categories={[{ _id: "", name: "Tất cả" }, ...categories]} // ✅ Truyền danh mục vào Search
/>

      <div className="flex flex-wrap gap-3 mt-5">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} minSalePrice={minMaxPrices[product._id]} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
};

export default ProductsClient;


