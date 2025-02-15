import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUp, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";
const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [minMaxPrices, setMinMaxPrices] = useState({});
  const [stocks, setStocks] = useState({}); // Thêm state lưu trữ stock
  const [isMenuVisible, setMenuVisible] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/all/nopagination",
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    const fetchMinMaxPrices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/products/minmaxprice",
          {
            headers: { "Cache-Control": "no-cache" },
          }
        );
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
  }, []);

  useEffect(() => {
    // Chỉ fetch stock khi đã có sản phẩm
    if (products.length === 0) return;

    const fetchStocks = async () => {
      try {
        const stockData = {};
        for (const product of products) {
          const response = await axios.get(
            `http://localhost:3000/products/stock/${product._id}`
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
        await axios.delete(
          `http://localhost:3000/products/delete/${productId}`
        );
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } catch (error) {
        console.error("Lỗi khi xoá sản phẩm:", error);
      }
    }
  };
  const handleEditProduct = (productId) => {
    navigate(`/editproduct/${productId}`); 
  }
  return (
    <div className="mt-5 flex flex-col items-center">
      <div className=" w-11/12 my-6 ">
      <button
        className="bg-primary items-center float-right flex text-white px-6 py-4 rounded-lg"
        onClick={() => navigate("/addproducts")} // Điều hướng khi nhấn nút
      >
        
        <PlusCircle size={20} className="mr-4"/>
        THÊM SẢN PHẨM
      </button>
      
      </div>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
        {products.length > 0 ? (
          products.map((product) => {
            const priceData = minMaxPrices[product._id];
            const stock = stocks[product._id] ?? "Đang tải...";

            // Nếu có API minmaxprice, ưu tiên hiển thị từ API
            let priceText = priceData
              ? `${priceData.min.toLocaleString()}đ - ${priceData.max.toLocaleString()}đ`
              : "N/A";

            // Nếu API minmaxprice chưa có dữ liệu, fallback về variations
            if (!priceData && product.variations?.length > 0) {
              const prices = product.variations.map((v) => v.salePrice);
              priceText = `${Math.min(
                ...prices
              ).toLocaleString()}đ - ${Math.max(...prices).toLocaleString()}đ`;
            }

            return (
              <div
                key={product._id}
                className="p-4 rounded-2xl shadow-md bg-white relative flex flex-col min-h-[320px] justify-between"
              >
                <div className="absolute top-2 right-2 cursor-pointer">
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
                  <div className="absolute top-10 right-2 bg-white shadow-md rounded-md w-40 z-10 menu-container">
                    <ul className="text-sm text-gray-700">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                    <p className="font-bold text-lg mt-2 mb-5">{priceText}</p>
                  </div>
                </div>

                <div className="mt-3 border-t pt-3 space-y-2 border rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between text-sm items-center">
                    <span className="font-base">Bán</span>
                    <div className="flex items-center gap-1 text-gray-700">
                      <ArrowUp size={14} className="text-yellow-500" />
                      <span>{product.status}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                  <div className="flex items-center text-sm w-full gap-2">
                    <span className="text-sm font-base whitespace-nowrap">
                      Sản phẩm còn
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 relative">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{
                            width:
                              stock !== "Đang tải..."
                                ? `${(stock / 100) * 100}%`
                                : "0%",
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-base text-right w-10">
                        {stock}
                      </span>
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
    </div>
  );
};

export default ProductCard;
