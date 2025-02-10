import { useRef, useEffect, useState } from "react";

export function TypeProduct() {
  const [items, setItems] = useState([
    { id: 1, category: "", stock: "", originalPrice: "", salePrice: "" },
  ]);

  const addNewItem = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        category: "",
        stock: "",
        originalPrice: "",
        salePrice: "",
      },
    ]);
  };

  const handleAddItem = (id, field, value) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id}>
          <div className="flex justify-between w-11/12 ">
            <div className=" w-1/2">

              <p className="font-semibold text-base mt-6 mb-3">
                Loại hàng {index + 1}
              </p>
              <input
                type="text"
                value={item.category}
                onChange={(e) =>
                    handleAddItem(item.id, "category", e.target.value)
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
                onChange={(e) =>
                    handleAddItem(item.id, "stock", e.target.value)
                }
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
                value={item.originalPrice}
                onChange={(e) =>
                    handleAddItem(item.id, "originalPrice", e.target.value)
                }
                className="border-2  text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
              ></input>
            </div>
            <div className=" w-1/2">
              <p className="font-semibold text-base mt-6 mb-3">Giá bán</p>
              <input
                type="text"
                placeholder="VND"
                value={item.salePrice}
                onChange={(e) =>
                    handleAddItem(item.id, "originalPrice", e.target.value)
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
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        + Thêm loại hàng
      </button>
    </div>
  );
}
