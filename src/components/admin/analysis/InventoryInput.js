import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStock, setNewStock] = useState({});
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}inventory/${productId}`);
        setProduct(response.data);
        setNewStock(
          response.data.variations.reduce((acc, variation) => {
            acc[variation.theme] = 0;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleStockChange = (theme, value) => {
    setNewStock((prevStock) => ({ ...prevStock, [theme]: value }));
  };

  const handleUpdateStock = async () => {
    try {
      await axios.put(`${API_URL}inventory/${productId}/update-stock`, { newStock });
      alert("Cập nhật số lượng thành công!");
      navigate("/inventory");
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng tồn kho:", error);
    }
  };

  const handleRowClick = (theme) => {
    navigate(`/inventory/${productId}/add-stock?theme=${theme}`);
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <div className="bg-white p-6 border rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">Mã sản phẩm: {product.productId}</p>
          <h3 className="mt-4 text-lg font-medium">Biến thể sản phẩm:</h3>
          <table className="w-full mt-2 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Theme</th>
                <th className="border p-2">Loại</th>
                <th className="border p-2">Số lượng hiện tại</th>
                <th className="border p-2">Nhập thêm</th>
              </tr>
            </thead>
            <tbody>
              {product.variations.map((variant) => (
                <tr key={variant.theme} className="border-b cursor-pointer hover:bg-gray-200" onClick={() => handleRowClick(variant.theme)}>
                  <td className="border p-2">{variant.theme}</td>
                  <td className="border p-2">{variant.category}</td>
                  <td className="border p-2 text-blue-600 font-semibold">{variant.stock}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={newStock[variant.theme]}
                      onChange={(e) => handleStockChange(variant.theme, Number(e.target.value))}
                      className="border p-1 rounded w-16 text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleUpdateStock} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Cập nhật tồn kho
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
