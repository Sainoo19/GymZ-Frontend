import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FrequentlyBoughtTogether = () => {
  const [products, setProducts] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}analysis/frequently-bought-together`, {
        withCredentials: true,
      })
      .then((response) => setProducts(response.data.recommendations))
      .catch((error) => console.error("Lỗi khi tải dữ liệu:", error));
  }, []);

  const toggleCombo = (product1, product2) => {
    const combo = `${product1._id}-${product2._id}`;
    setSelectedCombos((prev) =>
      prev.includes(combo) ? prev.filter((c) => c !== combo) : [...prev, combo]
    );
  };

  // Function to navigate to discount creation page
  const navigateToCreateDiscount = () => {
    navigate("/admin/discounts/create");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm thường mua cùng nhau</h2>

      {/* Kiểm tra nếu không có sản phẩm */}
      {products.length === 0 ? (
        <p className="text-center text-gray-500">Không có sản phẩm</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(({ product1, product2, count }) => (
            <div
              key={`${product1._id}-${product2._id}`}
              className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all ${selectedCombos.includes(`${product1._id}-${product2._id}`)
                ? "bg-blue-100"
                : "bg-white"
                }`}
              onClick={() => toggleCombo(product1, product2)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={product1.avatar}
                  alt={product1.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{product1.name}</p>
                  <p className="text-sm text-gray-500">
                    {product1.category?.join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product1.theme?.join(", ")}
                  </p>
                </div>
              </div>
              <div className="text-center text-gray-600 my-2">+</div>
              <div className="flex items-center gap-4">
                <img
                  src={product2.avatar}
                  alt={product2.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{product2.name}</p>
                  <p className="text-sm text-gray-500">
                    {product2.category?.join(", ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product2.theme?.join(", ")}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Đã mua cùng nhau {count} lần
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Ẩn nút tạo khuyến mãi nếu không có sản phẩm */}
      {products.length > 0 && (
        <button
          onClick={navigateToCreateDiscount}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Tạo khuyến mãi
        </button>
      )}
    </div>
  );
};

export default FrequentlyBoughtTogether;