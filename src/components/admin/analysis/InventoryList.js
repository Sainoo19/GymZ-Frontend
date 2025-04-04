import React, { useEffect, useState } from "react";
import axios from "axios";
import expand_left_icon from "../../../assets/icons/Expand_left_light.svg";
import expand_right_icon from "../../../assets/icons/Expand_right_light.svg";
import { useNavigate } from "react-router-dom";

const InventoryListPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${API_URL}analysis/inventory-report`,  {withCredentials: true});
        setInventory(response.data.inventory);
        setTotalProducts(response.data.totalProducts);
      } catch (error) {
        console.error("Lỗi khi lấy hàng tồn kho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const totalPages = Math.ceil(inventory.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventory.slice(indexOfFirstItem, indexOfLastItem);
  const handleItemClick = (productId) => {
    navigate(`/admin/inventory/addinventory/${productId}`);
  };

  return (
    <div className="container mx-auto rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Quản lý hàng tồn kho</h2>
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="text-lg font-medium mb-2">Tổng số sản phẩm: {totalProducts}</p>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-base">ID</th>
                <th className="border p-2 text-base">Tên sản phẩm</th>
                <th className="border p-2 text-base">Tổng số lượng</th>
                <th className="border p-2">Biến thể</th>
                <th className="border p-2">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                item.variations.map((variant, index) => (
                  <tr key={`${item.productId}-${index}`} className="text-center border-b cursor-pointer hover:bg-gray-100" onClick={() => handleItemClick(item.productId, variant.theme)}>
                    {index === 0 && <td className="border p-1 text-sm" rowSpan={item.variations.length}>{item.productId}</td>}
                    {index === 0 && <td className="border p-1 text-sm" rowSpan={item.variations.length}>{item.name}</td>}
                    {index === 0 && <td className="border p-1 text-sm" rowSpan={item.variations.length}>{item.totalStock}</td>}
                    <td className="border p-2 text-sm">{variant.theme} - {variant.category}</td>
                    <td className="border p-2 font-semibold text-blue-600">{variant.stock}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastItem, totalProducts)}</span> trong tổng số <span className="font-medium">{totalProducts}</span> sản phẩm
              </p>
              <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md shadow-xs">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <img src={expand_left_icon} alt="Previous" className="size-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'text-gray-900 hover:bg-gray-50'}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <img src={expand_right_icon} alt="Next" className="size-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryListPage;
