import React, { useEffect, useState,useMemo  } from "react";
import formatCurrency from "../../utils/formatCurrency";

const ProductsOrdered = ({ selectedItems, onTotalAmountChange, discountAmount, taxPercent  }) => {

  const totalBeforeTax = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [selectedItems]
  );

  const totalAfterDiscount = useMemo(() => totalBeforeTax - discountAmount, [totalBeforeTax, discountAmount]);
  const taxAmount = useMemo(() => (totalAfterDiscount * taxPercent) / 100, [totalAfterDiscount, taxPercent]);
  const finalTotal = useMemo(() => totalAfterDiscount + taxAmount, [totalAfterDiscount, taxAmount]);

  useEffect(() => {
    console.log("🚀 Tổng tiền gửi lên CheckOutPage:", finalTotal);
    // Tính tổng tiền trước thuế
    
    // Truyền tổng tiền cuối cùng lên `CheckOutPage`
    onTotalAmountChange(finalTotal);
  }, [selectedItems, discountAmount, taxPercent, onTotalAmountChange]);


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
              <span className="text-lg font-medium">{item.quantity} x {formatCurrency(item.price)}₫</span>
            </div>
          ))}
          {/* Tổng tiền chi tiết */}
          <div className="text-right font-bold text-lg mt-4">
          <p>Tổng tiền: {formatCurrency(totalBeforeTax)}₫</p>
            <p className="text-green-600">Giảm giá: -{formatCurrency(discountAmount)}₫</p>
            <p className="text-gray-700">Thuế ({taxPercent}%): +{formatCurrency(taxAmount)}₫</p>
            <p className="border-t pt-2 mt-2 text-xl text-red-600">
              Tổng thanh toán: {formatCurrency(finalTotal)}₫
            </p>
          </div>
        </>
      ) : (
        <p className="text-center">Không có sản phẩm nào.</p>
      )}
    </div>
  );
};


export default ProductsOrdered;
