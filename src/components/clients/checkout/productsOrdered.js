import React, { useEffect, useState } from "react";

const ProductsOrdered = ({ selectedItems, onTotalAmountChange }) => {
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log("📦 Sản phẩm đã đặt:", selectedItems);

    const total = selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalAmount(total);
    onTotalAmountChange(total); // Truyền tổng tiền lên `CheckOutPage`
  }, [selectedItems, onTotalAmountChange]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold text-center mb-4">Sản phẩm đã đặt</h2>
      {selectedItems.length > 0 ? (
        <>
          {selectedItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2">
              <div className="flex items-center gap-4">
                <img src={item.productAvatar} alt={item.productName} className="w-16 h-16" />
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-gray-600">Phân loại: {item.category}</p>
                </div>
              </div>
              <span className="text-lg font-medium">{item.quantity} x {item.price}₫</span>
            </div>
          ))}
          <div className="text-right font-bold text-lg mt-4">Tổng tiền: {totalAmount}₫</div>
        </>
      ) : (
        <p className="text-center">Không có sản phẩm nào.</p>
      )}
    </div>
  );
};

export default ProductsOrdered;
