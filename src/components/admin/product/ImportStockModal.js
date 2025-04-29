import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Import icon X từ thư viện lucide-react

const ImportStockModal = ({ product, onClose, onStockUpdate }) => {

    const URL_API = process.env.REACT_APP_API_URL;
  const [updatedVariations, setUpdatedVariations] = useState(
    product.variations.map((variation) => ({
      ...variation,
      additionalStock: 0,
    }))
  );

  const handleStockChange = (index, value) => {
    const newVariations = [...updatedVariations];
    newVariations[index].additionalStock = Number(value);
    setUpdatedVariations(newVariations);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.put(
        `${URL_API}products/update-stock/${product._id}`,
        { variations: updatedVariations }
      );
      alert("Cập nhật kho thành công!");
      onStockUpdate(response.data.product);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi nhập kho:", error);
      alert("Có lỗi xảy ra khi cập nhật kho!");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg relative">
        {/* Nút đóng modal */}
        <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold mt-5 mb-4 text-center">Nhập Kho - {product.name}</h2>
        <img src={product.avatar} alt={product.name} className="w-1/2 mx-auto" />
        <div className="mt-6 space-y-3">
          {updatedVariations.map((variation, index) => (
            <div key={index} className="flex flex-col border-b pb-3">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{variation.theme} - {variation.category}</p>
                <p className="text-gray-500 text-sm">Tồn kho: {variation.stock}</p>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-primary">Nhập thêm</span>
                <input
                  type="number"
                  min="0"
                  value={variation.additionalStock}
                  onChange={(e) => handleStockChange(index, e.target.value)}
                  className="border px-3 py-1 rounded w-1/4 text-center"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={onClose}>Hủy</button>
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={handleSubmit}>Nhập Kho</button>
        </div>
      </div>
    </div>
  );
};

export default ImportStockModal;
