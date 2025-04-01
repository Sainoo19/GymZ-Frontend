import { useEffect, useState } from "react";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import Pagination from "../../../components/admin/layout/Pagination";
import ImportStockModal from "../../../components/admin/product/ImportStockModal";
import reformDateTime from '../../../components/utils/reformDateTime';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import truncateString from "../../../components/utils/truncateString"

const ProductCard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [minMaxPrices, setMinMaxPrices] = useState({});
  const [stocks, setStocks] = useState({}); // Thêm state lưu trữ stock
  const [isMenuVisible, setMenuVisible] = useState(null);
  const [search, setSearch] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [exportFilters, setExportFilters] = useState({
    branchId: '',
    type: '',
    startDate: '',
    endDate: ''
});
const toggleExportModal = () => {
    setIsExportModalOpen(!isExportModalOpen);
};

const handleExportFilterChange = (e) => {
    setExportFilters({
        ...exportFilters,
        [e.target.name]: e.target.value
    });
};

  //Tạo biến cho "Sản phẩm BÁN"
  const Selling = 100;

  const handleOpenImportModal = (product) => {
    setSelectedProduct(product);
    setMenuVisible(null); // Ẩn menu khi mở modal nhập hàng

  };

  const handleCloseImportModal = () => {
    setSelectedProduct(null);
  };

  const URL_API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${URL_API}products/all`, {
          params: {
            page: currentPage, // Đã có biến này nhưng useEffect chưa theo dõi nó
            limit: 12,
            search,
            ...filters,
            ...exportFilters
          },
        });
        if (response.data.status === "success") {
          setProducts(response.data.data.products);
          setTotalPages(response.data.metadata.totalPages);
        } else {
          console.error("API response error:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchMinMaxPrices = async () => {
      try {
        const response = await axios.get(`${URL_API}products/minmaxprice`, {
          headers: { "Cache-Control": "no-cache" },
        });
        const priceMap = response.data.data.reduce((acc, item) => {
          acc[item.productId] = {
            min: item.minSalePrice,
            max: item.maxSalePrice,
          };
          return acc;
        }, {});
        setMinMaxPrices(priceMap);
      } catch (error) {
        console.error("Lỗi khi lấy giá min-max:", error);
      }
    };

    fetchProducts();
    fetchMinMaxPrices();
  }, [currentPage, search, filters, exportFilters]);

  useEffect(() => {
    // Chỉ fetch stock khi đã có sản phẩm
    if (products.length === 0) return;

    const fetchStocks = async () => {
      try {
        const stockData = {};
        for (const product of products) {
          const response = await axios.get(
            `${URL_API}products/stock/${product._id}`
          );
          stockData[product._id] = response.data.totalStock;
        }
        setStocks(stockData);
      } catch (error) {
        console.error("Lỗi khi lấy stock sản phẩm:", error);
      }
    };

    fetchStocks();
  }, [products]);

  const handleMenuClick = (productId) => {
    setMenuVisible(isMenuVisible === productId ? null : productId);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuVisible(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await axios.delete(`${URL_API}products/delete/${productId}`);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } catch (error) {
        console.error("Lỗi khi xoá sản phẩm:", error);
      }
    }
  };
  const handleEditProduct = (productId) => {
    navigate(`/admin/editproduct/${productId}`);
  };
  //tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      setFilters({ category: "", minPrice: "", maxPrice: "" }); // Reset bộ lọc
    }
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };
  const handleExport = async () => {
    try {
        const response = await axios.get('http://localhost:3000/products/all', {
            params: {
                ...exportFilters,
                limit: 1000 // Giới hạn dữ liệu xuất
            },
            withCredentials: true
        });

        if (response.data.status === 'success') {
            const products = response.data.data.products.map(product => ({
                'PRODUCT ID': product._id,
                'NAME': product.name,
                'CATEGORY': product.category ? product.category.name : '',
                'PRICE RANGE': `${product.minPrice.toLocaleString()} - ${product.maxPrice.toLocaleString()}`, // Hiển thị giá min-max
                'CREATED AT': reformDateTime(product.createdAt),
                'UPDATED AT': reformDateTime(product.updatedAt),
            }));

            console.log("✅ Products Export:", products); // Kiểm tra dữ liệu trước khi xuất

            const ws = XLSX.utils.json_to_sheet(products);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Products_Report');

            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            saveAs(data, 'products_report.xlsx');
            alert('Xuất báo cáo thành công!');
              // Đóng modal và reset filters
              toggleExportModal(); // Đóng modal
              setExportFilters({
                  branchId: '',
                  type: '',
                  startDate: '',
                  endDate: ''
              }); // Reset filters
        } else {
            alert('Lỗi khi xuất báo cáo: ' + response.data.message);
        }
    } catch (error) {
        console.error('Lỗi khi xuất báo cáo:', error);
        alert('Xuất báo cáo thất bại!');
    }
};


  return (
    <div className="mt-24 mb-5">
      <div className="flex justify-between items-center mb-4 w-full">
        <h1 className="text-2xl font-bold">Tất Cả Sản Phẩm</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={handleSearchChange}
            className="px-4 py-2 border rounded"
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center"
            onClick={toggleFilterModal}
          >
            <FaFilter className="mr-2" /> Lọc
          </button>
          <button
            className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center"
            onClick={() => navigate("/admin/addproducts")}
          >
            <PlusCircle size={20} className="mr-2" />
            THÊM SẢN PHẨM
          </button>
          <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
                        onClick={toggleExportModal}
                    >
                        Xuất Báo Cáo
                    </button>
        </div>
      </div>

      {/* Grid danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
        {products.length > 0 ? (
          products.map((product) => {
            const priceData = minMaxPrices[product._id];
            const stock = stocks[product._id] ?? "Đang tải...";
            let priceText = priceData
              ? `${priceData.min.toLocaleString()}đ - ${priceData.max.toLocaleString()}đ`
              : "N/A";

            if (!priceData && product.variations?.length > 0) {
              const prices = product.variations.map((v) => v.salePrice);
              priceText = `${Math.min(
                ...prices
              ).toLocaleString()}đ - ${Math.max(...prices).toLocaleString()}đ`;
            }

            return (
              <div
                key={product._id}
                className="p-4 border rounded-2xl shadow-md bg-white relative flex flex-col min-h-[320px] justify-between"
              >
                <div className="absolute top-3 right-5 cursor-pointer">
                  <MoreHorizontal
                    size={20}
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuClick(product._id);
                    }}
                  />
                </div>

                {isMenuVisible === product._id && (
                  <div className="absolute top-10 right-2 bg-gray-100 shadow-md rounded-md w-40 z-10 menu-container">
                    <ul className="text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                        onClick={() => handleOpenImportModal(product)}
                      >
                        Nhập hàng
                      </li>

                      <li
                        className="px-4 py-2  hover:bg-primary hover:text-white cursor-pointer"
                        onClick={() => handleEditProduct(product._id)}
                      >
                        Chỉnh sửa
                      </li>
                      <li
                        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        Xóa
                      </li>
                    </ul>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <img
                    src={product.avatar || "/whey.png"}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex flex-col justify-between h-full flex-grow">
                    <p className="font-semibold text-[30px]">{product.name}</p>
                    <p className="font-base text-[30px]">{product.category}</p>
                    <p className="font-bold text-lg mt-2 mb-5">{priceText}</p>
                  </div>
                </div>

                <div className="mt-3 border-t pt-3 space-y-2 border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-base">Bán</span>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>{Selling}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-base">Sản phẩm còn</span>
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>{stock - Selling >= 0 ? stock - Selling : 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">Không có sản phẩm nào.</p>
        )}
      </div>

      {/* Di chuyển phân trang xuống cuối */}
      <div className="mt-6">
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Lọc Sản Phẩm</h2>
            <div className="mb-4">
              <label className="block mb-2">Danh mục</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Tất cả</option>
                <option value="Thời trang">Thời trang</option>
                <option value="Whey">Whey</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Sắp xếp theo giá</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Mặc định</option>
                <option value="priceAsc">Giá thấp đến cao</option>
                <option value="priceDesc">Giá cao đến thấp</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={toggleFilterModal}
              >
                Hủy
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                onClick={applyFilters}
              >
                Áp Dụng
              </button>
            </div>
          </div>
        </div>
      )}

{isExportModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Lọc Dữ Liệu Xuất Báo Cáo Sản Phẩm</h2>

            {/* Bộ lọc Danh Mục */}
            <div className="mb-4">
                <label className="block mb-2">Danh Mục</label>
                <select
                    name="category"
                    value={exportFilters.category}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Tất cả</option>
                    <option value="electronics">Điện tử</option>
                    <option value="fashion">Thời trang</option>
                    <option value="home">Nhà cửa</option>
                </select>
            </div>

            {/* Bộ lọc Khoảng Giá */}
            <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                    <label className="block mb-2">Giá Tối Thiểu</label>
                    <input
                        type="number"
                        name="priceMin"
                        value={exportFilters.priceMin}
                        onChange={handleExportFilterChange}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Từ"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block mb-2">Giá Tối Đa</label>
                    <input
                        type="number"
                        name="priceMax"
                        value={exportFilters.priceMax}
                        onChange={handleExportFilterChange}
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Đến"
                    />
                </div>
            </div>

            {/* Bộ lọc Ngày Tạo */}
            <div className="mb-4 flex space-x-4">
                <div className="w-1/2">
                    <label className="block mb-2">Từ Ngày</label>
                    <input
                        type="date"
                        name="startDate"
                        value={exportFilters.startDate}
                        onChange={handleExportFilterChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block mb-2">Đến Ngày</label>
                    <input
                        type="date"
                        name="endDate"
                        value={exportFilters.endDate}
                        onChange={handleExportFilterChange}
                        className="w-full px-4 py-2 border rounded"
                    />
                </div>
            </div>

            {/* Bộ lọc Sắp xếp */}
            <div className="mb-4">
                <label className="block mb-2">Sắp Xếp Theo</label>
                <select
                    name="sortBy"
                    value={exportFilters.sortBy}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                >
                    <option value="">Mặc định</option>
                    <option value="priceAsc">Giá tăng dần</option>
                    <option value="priceDesc">Giá giảm dần</option>
                </select>
            </div>

            {/* Nút Hủy và Xuất Báo Cáo */}
            <div className="flex justify-end space-x-2">
                <button
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={toggleExportModal}
                >
                    Hủy
                </button>
                <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                    onClick={handleExport}
                >
                    Xuất Báo Cáo
                </button>
            </div>
        </div>
    </div>
)}

      {selectedProduct && (
  <ImportStockModal
    product={selectedProduct}
    onClose={handleCloseImportModal}
    onStockUpdate={(updatedProduct) => {
      setStocks((prevStocks) => ({
        ...prevStocks,
        [updatedProduct._id]: updatedProduct.totalStock,
      }));
    }}
  />
)}

    </div>
    
  );
};

export default ProductCard;
