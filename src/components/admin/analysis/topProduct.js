import axios from "axios";
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { truncateString } from "../../utils/truncateString";
const TopProduct = () => {
    const URL_API = process.env.REACT_APP_API_URL;
    const [topProducts, setTopProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${URL_API}analysis/best-selling-products`)
        .then(response => {
            setTopProducts(response.data.bestSellingProducts.slice(0, 5)); // Lấy 5 sản phẩm đầu tiên
          })
          .catch(error => console.error("Lỗi khi lấy sản phẩm bán chạy:", error));
      }, []);
      return (
        <div className="p-6 ml-4 w-1/3 border bg-white  shadow-xl  rounded-lg">
          <h2 className="text-xl font-bold mb-4">Top Sản Phẩm Bán Chạy</h2>
            {topProducts.map((product, index) => (
              <div
                key={product._id}
                className="flex mt-2 items-center gap-4 p-2 border  rounded-lg shadow-sm hover:shadow-md transition"
              >
                <img
                  src={product.avatar}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{truncateString(product.name,13)}</p>
                  <p className="text-gray-500 text-xs">{product.category}</p>
                  <p className="text-gray-500 text-xs">{product.theme}</p>
                </div>
                <p className="font-semibold text-sm text-primary">{product.soldCount} đã bán</p>
              </div>
            ))}
    
          <button
            className="mt-6 px-4 py-2 mx-auto bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
            onClick={() => navigate("/all-products")}
          >
            Xem Chi Tiết
          </button>
        </div>
      );
    };
    
export default TopProduct;