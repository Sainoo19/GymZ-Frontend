import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import expand_left_icon from "../../../assets/icons/Expand_left_light.svg";
import expand_right_icon from "../../../assets/icons/Expand_right_light.svg";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const TopProductPage = () => {
  const URL_API = process.env.REACT_APP_API_URL;
  const [stockPredictions, setStockPredictions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${URL_API}analysis/predict-stock`)
      .then((response) => {
        if (response.data.status === "success") {
          const sortedData = response.data.data.sort(
            (a, b) => b.stockNeeded - a.stockNeeded
          );
          setStockPredictions(sortedData);
        }
      })
      .catch((error) =>
        console.error("Lỗi khi lấy dữ liệu dự đoán nhập hàng:", error)
      );
  }, []);

  // Nhóm sản phẩm theo tên để tránh lặp lại
  const groupedProducts = stockPredictions.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  // Phân trang
  const totalProducts = Object.keys(groupedProducts).length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfFirstItem = (currentPage - 1) * productsPerPage;
  const indexOfLastItem = indexOfFirstItem + productsPerPage;
  const displayedProducts = Object.entries(groupedProducts).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Dữ liệu biểu đồ
  const chartData = {
    labels:
      stockPredictions.length > 0
        ? stockPredictions.map((p) => p.name)
        : ["Không có dữ liệu"],
    datasets: [
      {
        label: "Cần nhập thêm",
        data:
          stockPredictions.length > 0
            ? stockPredictions.map((p) => p.stockNeeded)
            : [0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  return (
    <div className="p-6 mt-20 w-full max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Dự Đoán Số Lượng Cần Nhập</h2>
      <Bar data={chartData} />

    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-8"></div>
        <h2 className=" font-bold text-2xl">Bảng dự đoán nhập hàng</h2>
            <p className="text-xs text-primary">Đây là dự kiến của web, thông tin chỉ mang tính chất tham khảo</p>
      {/* Bảng dự đoán số lượng cần nhập */}
      <table className="w-full border-collapse border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border p-3">ID</th>
            <th className="border p-3">Sản phẩm</th>
            <th className="border p-3">Phân loại</th>
            <th className="border p-3">Đã bán</th>
            <th className="border p-3">Tồn kho</th>
            <th className="border p-3">Cần nhập thêm</th>
          </tr>
        </thead>
        <tbody>
          {displayedProducts.map(([productName, variations]) => (
            <>
              {variations.map((variation, index) => (
                <tr
                  key={`${variation.productId}-${variation.category}-${variation.theme}`}
                  className="border-b last:border-0"
                >
                  {index === 0 && (
                    <>
                      <td
                        className="border p-3 text-sm align-middle"
                        rowSpan={variations.length}
                      >
                        {variations[0].productId}
                      </td>
                      <td
                        className="border p-3 font-bold text-base align-middle"
                        rowSpan={variations.length}
                      >
                        {productName}
                      </td>
                    </>
                  )}

                  <td className="border p-3">
                    {variation.category}{" "}
                    {variation.theme !== "Không có"
                      ? `- ${variation.theme}`
                      : ""}
                  </td>
                  <td className="border text-base p-3">{variation.totalSold}</td>
                  <td className="border text-base p-3">{variation.currentStock}</td>
                  <td
                    className={`border p-3 text-base font-bold ${
                      variation.stockNeeded > 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {variation.stockNeeded > 0
                      ? variation.stockNeeded
                      : "Đủ hàng"}
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">{indexOfFirstItem + 1}</span>{" "}
            đến{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, totalProducts)}
            </span>{" "}
            trong tổng số <span className="font-medium">{totalProducts}</span>{" "}
            sản phẩm
          </p>
          <nav
            aria-label="Pagination"
            className="isolate inline-flex -space-x-px rounded-md shadow-xs"
          >
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
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-gray-300 ring-inset focus:z-20 focus:outline-offset-0 ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 hover:bg-gray-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <img src={expand_right_icon} alt="Next" className="size-5" />
            </button>
          </nav>
        </div>
      <div className=" justify-center hidden">
         <button
        className=" px-4 float-right mt-10 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        Quay Lại
      </button>
      </div>
      </div>
       
    </div>
  );
};

export default TopProductPage;
