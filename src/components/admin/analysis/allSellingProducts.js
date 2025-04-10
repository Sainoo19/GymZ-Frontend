import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const URL_API = process.env.REACT_APP_API_URL;
  useEffect(() => {
    axios
      .get(`${URL_API}analysis/best-selling-products`, {
        withCredentials: true,
      })
      .then((response) => {
        setProducts(response.data.bestSellingProducts);
      })
      .catch((error) => console.error("Lỗi khi lấy sản phẩm:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        📊 Thống Kê Tất Cả Sản Phẩm Bán Chạy
      </h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Danh mục</th>
            <th className="border p-2">Chủ đề</th>
            <th className="border p-2">Đã bán</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} className="text-center border-b">
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2 flex items-center gap-2">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                {product.name}
              </td>
              <td className="border p-2">{product.category}</td>
              <td className="border p-2">{product.theme || "Không có"}</td>
              <td className="border p-2 font-semibold text-green-500">
                {product.soldCount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        Quay Lại
      </button>
    </div>
  );
};

export default AllSellingProducts;
