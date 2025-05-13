import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../../../components/clients/product/ProductCard";
import Search from "../../../components/clients/product/Search";
import Pagination from "../../../components/admin/layout/Pagination";
import Banner from "../../../components/clients/product/Banner"; // Uncommented Banner import

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
  const [initialFilterApplied, setInitialFilterApplied] = useState(false);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchProducts(currentPage),
          fetchMinMaxPrices(),
          fetchBrands(),
          fetchCategories(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [currentPage]);

  // Handle pending category filter from RelatedProducts
  useEffect(() => {
    if (!initialFilterApplied && products.length > 0 && categories.length > 0) {
      const pendingCategoryFilter = sessionStorage.getItem('pendingCategoryFilter');
      if (pendingCategoryFilter) {
        console.log("Applying pending category filter:", pendingCategoryFilter);
        handleFilter({ categories: [pendingCategoryFilter] });
        sessionStorage.removeItem('pendingCategoryFilter');
        setInitialFilterApplied(true);
      }
    }
  }, [products, categories, initialFilterApplied]);

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
      return response.data.data.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
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
      console.log("Categories API response:", response.data);

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

  const handlePageChange = (page) => {
    if (page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearch = (searchText) => {
    if (searchText.trim() === "") {
      fetchProducts(currentPage);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredProducts(filtered);
      setTotalPages(Math.ceil(filtered.length / 8));
    }
    setCurrentPage(1);
  };

  const handleFilter = (filters) => {
    console.log("Applying filters:", filters);
    let filtered = [...products];

    if (
      (!filters.categories || filters.categories.length === 0) &&
      (!filters.brands || filters.brands.length === 0) &&
      !filters.minPrice &&
      !filters.maxPrice
    ) {
      setFilteredProducts(products);
      return;
    }

    if (filters.categories && filters.categories.length > 0) {
      console.log("Filtering by categories:", filters.categories);
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
      console.log("After category filter:", filtered.length, "products");
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

    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / 8));
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
      sortedProducts.sort((a, b) => b.name.localeCompare(b.name));
    }

    setFilteredProducts(sortedProducts);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 mb-10">
      <div className="mt-8">
        <Banner /> {/* Add Banner component here */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Tất Cả Sản Phẩm</h1>
      </div>
      <div className="flex flex-col lg:flex-row justify-around items-start sm:justify-center gap-4">
        <Search
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          brands={brands}
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