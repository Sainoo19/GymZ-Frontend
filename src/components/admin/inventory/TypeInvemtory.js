import { useRef, useEffect, useState } from "react";

export function TypeInventory({ variations, setVariations }) {
  const [items, setItems] = useState([
    {
      category: "",
      stock: "",
      originalPrice: "",
      salePrice: "",
      theme: "",
      weight: "",
    },
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
            
            </div>

            <input
              type="text"
              placeholder="Màu sắc, hương vị, ..."
              value={item.theme}
              onChange={(e) => handleAddItem(index, "theme", e.target.value)}
              readOnly
              className="border-2  rounded-lg p-1 w-full text-gray-600 bg-gray-100 focus:outline-none "
            ></input>
          </div>
          <div className="flex justify-between w-11/12 "></div>
          <div className="flex justify-between w-11/12 "></div>
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
                readOnly
                className="border-2  text-sm  rounded-lg p-1 w-11/12 text-gray-600 bg-gray-100 focus:outline-none "
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
                className="border-2  w-full text-sm  rounded-lg p-1 text-gray-600 bg-gray-100 focus:outline-none "
              ></input>
            </div>
          </div>
          <div className="w-11/12">
            <div className="flex  justify-between items-center">
              <p className="font-semibold text-base mt-6 mb-3">
              Số lượng nhập thêm
              </p>
            
            </div>

            <input
              type="text"
              placeholder="Số lượng nhập thêm"
              value={item.additionalStock || ""}
              onChange={(e) => handleAddItem(index, "additionalStock", e.target.value)}
              
              className="border-2 text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-1 focus:ring-primary "
              ></input>
          </div>
         

          <div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>
        </div>
      ))}
    </div>
  );
}
