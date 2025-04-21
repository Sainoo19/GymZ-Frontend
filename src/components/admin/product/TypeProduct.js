import { forwardRef, useEffect, useState } from "react";
export const TypeProduct = forwardRef(({ variations, setVariations }, ref) => {
  const [items, setItems] = useState([
    {
      category: "",
      stock: "",
      originalPrice: "",
      salePrice: "",
      theme: "",
      weight: "",
      costPrice: "",
    },
  ]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setVariations(items);
  }, [items, setVariations]);

  useEffect(() => {
    if (variations.length > 0) {
      setItems(variations);
    }
  }, [variations]);

  const validateItems = () => {
    const newErrors = items.map((item) => {
      const error = {};
  
      if (!item.category.trim()) error.category = "Vui lòng nhập loại hàng.";
      if (!item.stock || isNaN(item.stock)) error.stock = "Số lượng không hợp lệ.";
      if (!item.originalPrice || isNaN(item.originalPrice)) error.originalPrice = "Giá gốc không hợp lệ.";
      if (!item.salePrice || isNaN(item.salePrice)) error.salePrice = "Giá bán không hợp lệ.";
      if (!item.theme.trim()) error.theme = "Vui lòng nhập thuộc tính.";
      if (!item.weight || isNaN(item.weight)) error.weight = "Khối lượng không hợp lệ.";
      if (!item.costPrice || isNaN(item.costPrice)) error.costPrice = "Giá nhập không hợp lệ.";     
  
      return error;
    });
  
    setErrors(newErrors);
    return newErrors.every((err) => Object.keys(err).length === 0);
  };
  
  
  
  

  const addNewItem = () => {
    // Kiểm tra dữ liệu của các item hiện tại trước khi thêm mục mới
    if (!validateItems()) {
      return; // Nếu có lỗi, không thêm item mới
    }

    // Nếu không có lỗi, tiếp tục thêm item mới
    setItems([
      ...items,
      {
        id: items.length + 1,
        category: "",
        stock: "",
        originalPrice: "",
        salePrice: "",
        theme: "",
        weight: "",
        costPrice: "",
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

    // Trigger validation on input change
    validateItems(); // Validate after each input change
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
              <button
                className="text-base border-2 border-primary px-2   rounded-2xl"
                onClick={() => removeItem(index)}
              >
                x
              </button>
            </div>

            <input
              type="text"
              placeholder="Màu sắc, hương vị, ..."
              value={item.theme}
              onChange={(e) => handleAddItem(index, "theme", e.target.value)}
              className={`border-2 text-sm rounded-lg p-1 w-full focus:outline-none focus:ring-2 ${
                errors[index]?.theme
                  ? "border-red-500"
                  : "border-gray-600 focus:ring-primary"
              }`}
            />
            {errors[index]?.theme && (
              <p className="text-red-500 text-sm mt-1">{errors[index].theme}</p>
            )}
          </div>
          <div className="flex justify-between w-11/12 ">
            <div className="w-full">
              <p className="font-semibold text-base mt-6 mb-3">
                Khối lượng sản phẩm (g)
              </p>
              <input
                type="text"
                placeholder="Khối lượng sản phẩm (g)"
                value={formatCurrency(item.weight)}
                onChange={(e) => handleAddItem(index, "weight", e.target.value)}
                className={`border-2 text-sm rounded-lg p-1 w-full focus:outline-none focus:ring-2 ${
                  errors[index]?.weight
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              />
              {errors[index]?.weight && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].weight}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-between w-11/12 ">
            <div className=" w-full">
              <p className="font-semibold text-base mt-6 mb-3">Giá nhập vào</p>
              <input
                type="text"
                placeholder="Giá nhập từ đại lý"
                value={formatCurrency(item.costPrice)}
                onChange={(e) =>
                  handleAddItem(index, "costPrice", e.target.value)
                }
                className={`border-2 text-sm rounded-lg p-1 w-full focus:outline-none focus:ring-2 ${
                  errors[index]?.costPrice
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              />{" "}
              {errors[index]?.costPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].costPrice}
                </p>
              )}
            </div>
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
                placeholder="Phân loại"
                className={`border-2  text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors[index]?.category
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              ></input>
              {errors[index]?.theme && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].category}
                </p>
              )}
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
                className={`border-2  text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors[index]?.stock
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              ></input>
              {errors[index]?.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].stock}
                </p>
              )}
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
                className={`border-2  text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors[index]?.originalPrice
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              ></input>
              {errors[index]?.originalPrice && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[index].originalPrice}
                </p>
              )}
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
                className={`border-2  text-sm border-gray-600 rounded-lg p-1 w-full focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors[index]?.salePrice
                    ? "border-red-500"
                    : "border-gray-600 focus:ring-primary"
                }`}
              ></input>
              {errors[index]?.salePrice && (
              <p className="text-red-500 text-sm mt-1">{errors[index].salePrice}</p>
            )}
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
});
