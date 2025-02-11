import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUp, MoreHorizontal } from "lucide-react";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/all", {
          headers: { "Cache-Control": "no-cache" },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

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
        await axios.delete(`http://localhost:3000/products/delete/${productId}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      } catch (error) {
        console.error("Lỗi khi xoá sản phẩm:", error);
      }
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="mt-5 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className="p-4 rounded-2xl shadow-md bg-white relative flex flex-col min-h-[320px] justify-between">
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
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Chỉnh sửa</li>
                    <li className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer" onClick={() => handleDeleteProduct(product._id)}>
                      Xóa
                    </li>
                  </ul>
                </div>
              )}

              <div className="flex items-start gap-4">
                <img src={product.images[0] || "/whey.png"} alt={product.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex flex-col justify-between h-full flex-grow">
                  <p className="font-semibold text-[30px]">{product.name}</p>
                  {/* <p className="text-gray-500 text-sm flex-grow">{product.description}</p> */}
                  <p className="font-bold text-lg mt-2 mb-5">{product.price.toLocaleString()}đ</p>
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
                  <span className="text-sm font-base whitespace-nowrap">Sản phẩm còn</span>
                  <div className="flex-1 flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 relative">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${(product.stock / product.totalStock) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-base text-right w-10">{product.stock}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Không có sản phẩm nào.</p>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        <button className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Trước
        </button>
        <span className="px-4 py-2">Trang {currentPage}</span>
        <button className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50" onClick={() => setCurrentPage((prev) => (indexOfLastProduct < products.length ? prev + 1 : prev))} disabled={indexOfLastProduct >= products.length}>
          Tiếp
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
