import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const ImportStockModal = ({ product, onClose, onStockUpdate }) => {
  const URL_API = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [fullProduct, setFullProduct] = useState(null);
  const [updatedVariations, setUpdatedVariations] = useState([]);
  const [error, setError] = useState("");

  // Fetch the complete product data with variations
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !product._id) {
        setError("Không tìm thấy thông tin sản phẩm");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${URL_API}products/${product._id}`);
        if (response.data.status === "success" && response.data.data) {
          setFullProduct(response.data.data);

          // Initialize variations with additionalStock = 0
          if (response.data.data.variations && response.data.data.variations.length > 0) {
            setUpdatedVariations(
              response.data.data.variations.map((variation) => ({
                ...variation,
                additionalStock: 0,
              }))
            );
          } else {
            setError("Sản phẩm không có biến thể");
          }
        } else {
          setError("Không thể tải thông tin sản phẩm");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [product, URL_API]);

  const handleStockChange = (index, value) => {
    const newVariations = [...updatedVariations];
    // Ensure the value is a valid number and not negative
    newVariations[index].additionalStock = Math.max(0, Number(value) || 0);
    setUpdatedVariations(newVariations);
  };

  const handleSubmit = async () => {
    if (!fullProduct || !fullProduct._id) {
      setError("Không tìm thấy thông tin sản phẩm");
      return;
    }

    setLoading(true);
    try {
      // Prepare data for the API - only send necessary information
      const variationsToUpdate = updatedVariations.map(variation => ({
        _id: variation._id,
        additionalStock: variation.additionalStock
      }));

      const response = await axios.put(
        `${URL_API}products/update-stock/${fullProduct._id}`,
        { variations: variationsToUpdate }
      );

      if (response.data.status === "success") {
        alert("Cập nhật kho thành công!");

        // Call onStockUpdate callback if provided
        if (onStockUpdate && response.data.data) {
          onStockUpdate(response.data.data);
        }

        // Close modal
        onClose();

        // Reload page immediately
        window.location.reload();
      } else {
        setError(response.data.message || "Cập nhật không thành công");
      }
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật kho!");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading && !fullProduct) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
        {/* Nút đóng modal */}
        <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mt-5 mb-4 text-center">
          Nhập Kho - {fullProduct?.name || "Sản phẩm"}
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {fullProduct && (
          <>
            {/* Product image */}
            {fullProduct.avatar ? (
              <img
                src={fullProduct.avatar}
                alt={fullProduct.name}
                className="w-1/3 h-40 object-contain mx-auto"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/whey.png"; // Fallback image
                }}
              />
            ) : (
              <div className="w-1/3 h-40 bg-gray-200 flex items-center justify-center mx-auto">
                <span className="text-gray-500">Không có hình ảnh</span>
              </div>
            )}

            {/* Variations list */}
            <div className="mt-6 space-y-3 max-h-60 overflow-y-auto">
              {updatedVariations.length > 0 ? (
                updatedVariations.map((variation, index) => (
                  <div key={index} className="flex flex-col border-b pb-3">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        {variation.theme || "N/A"} - {variation.category || "N/A"}
                      </p>
                      <p className="text-gray-500 text-sm">Tồn kho: {variation.stock || 0}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-primary">Nhập thêm</span>
                      <input
                        type="number"
                        min="0"
                        value={variation.additionalStock}
                        onChange={(e) => handleStockChange(index, e.target.value)}
                        className="border px-3 py-1 rounded w-1/4 text-center"
                        disabled={loading}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Không có biến thể sản phẩm</p>
              )}
            </div>
          </>
        )}

        {/* Footer buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>
          <button
            className={`bg-primary text-white px-4 py-2 rounded flex items-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-secondary"
              } transition-colors`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              "Nhập Kho"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportStockModal;