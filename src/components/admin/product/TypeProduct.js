import { useRef, useEffect, useState } from "react";
import { x } from "lucide-react"; 

import DeleteIconPNG from "../../../assets/icons/close_ring_light.png"
export function TypeProduct({ variations, setVariations }) {
  const [items, setItems] = useState([
    { category: "", stock: "", originalPrice: "", salePrice: "", theme: "" },
  ]);
  const [errors, setErrors] = useState({}); // Lưu trạng thái lỗi

  useEffect(() => {
    setVariations(items);
  }, [items, setVariations]);

  useEffect(() => {
    console.log("Received variations in TypeProduct:", variations);
  }, [variations]);

  useEffect(() => {
    if (variations.length > 0) {
      setItems(variations); // Gán trực tiếp variations vào items
    }
  }, [variations]);

  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        category: "",
        stock: "",
        originalPrice: "",
        salePrice: "",
        theme: "",
      },
    ]);
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };


  const handleAddItem = (index, field, value) => {
  const updatedItems = [...items];

    const rawValue = value.replace(/,/g, "");
    updatedItems[index][field] = rawValue;
    
    setItems(updatedItems);
  };



  const formatCurrency = (value) => {
    if (typeof value !== "string") {
      value = String(value); // Chuyển về chuỗi nếu không phải
    }
    let number = value.replace(/\D/g, ""); // Xóa ký tự không phải số
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Thêm dấu ","
  };
  
  return (
    <div className="justify-center">
      {items.map((item, index) => (
        <div key={item.id}>
          <div className="w-11/12">
          <div className="flex  justify-between items-center">
            <p className="font-semibold text-base mt-6 mb-3">
              Thuộc tính {index + 1}
            </p>
            <button className="text-base border-2 border-primary px-2   rounded-2xl"   onClick={()=> removeItem(index)}>x</button>
            </div>
           
            <input
              type="text"
              placeholder="Màu sắc, hương vị, ..."
              value={item.theme}
              onChange={(e) => handleAddItem(index, "theme", e.target.value)}
              className="border-2  text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-primary "
            ></input>
          </div>

          <div className="flex justify-between w-11/12 ">
            <div className=" w-1/2">
              <p className="font-semibold text-base mt-6 mb-3">Loại hàng</p>
              <input
                type="text"
                value={item.category}
                onChange={(e) =>
                  handleAddItem(index, "category", e.target.value)
                }
                placeholder="#xxxxx"
                className="border-2  text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
              ></input>
            </div>
            <div className=" w-1/2">
              <p className="font-semibold text-base mt-6 mb-3">
                Số lượng hàng tồn kho
              </p>
              <input
                type="text"
                placeholder="Nhập số lượng tồn kho"
                value={item.stock}
                onChange={(e) => handleAddItem(index, "stock", e.target.value)}
                className="border-2  text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-primary "
              ></input>
            </div>
          </div>
          <div className="flex justify-between w-11/12 ">
            <div className=" w-1/2">
              <p className="font-semibold text-base mt-6 mb-3">Giá gốc</p>
              <input
                type="text"
                placeholder="VND"
                value={formatCurrency(item.originalPrice)}
                onChange={(e) =>
                  handleAddItem(index, "originalPrice", e.target.value)
                }
                className="border-2  text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
              ></input>
            </div>
            <div className=" w-1/2">
              <p className="font-semibold text-base mt-6 mb-3">Giá bán</p>
              <input
                type="text"
                placeholder="VND"
                value={formatCurrency(item.salePrice)}
                onChange={(e) =>
                  handleAddItem(index, "salePrice", e.target.value)
                }
                className="border-2  text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-primary "
              ></input>
            </div>
          </div>
          <div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>
        </div>
      ))}
      <button
        onClick={addNewItem}
        className="mt-6  block border border-primary text-primary w-11/12 py-2 rounded-lg hover:bg-primary hover:text-white transition"
      >
        + Thêm loại hàng
      </button>
    </div>
  );
}
