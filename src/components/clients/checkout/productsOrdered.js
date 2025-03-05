import React, { useEffect, useState,useMemo  } from "react";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";

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
   
    onTotalAmountChange(finalTotal);
  }, [selectedItems, discountAmount, taxPercent, onTotalAmountChange]);

  const [shippingFee, setShippingFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL =  process.env.REACT_APP_API_URL;
  const fetchShippingFee = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}shipping/shipping-fee`, {
        params: {
          pick_province: "Hồ Chí Minh",
          pick_district: "Quận Bình Thạnh",
          province: "Bạc Liêu",
          district: "phường 3",
          weight: 1000,  // Đơn vị: Gram
          // value: 3000000, // Giá trị đơn hàng (VNĐ)
          deliver_option: "none", 
        },
      });

      setShippingFee(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy phí vận chuyển:", error);
      setError(error.response?.data?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="border rounded-lg p-4 bg-white">
      <h2 className="text-lg font-semibold text-center mb-4">Sản phẩm đã đặt</h2>
      <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Tính phí vận chuyển</h2>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={fetchShippingFee}
        disabled={loading}
      >
        {loading ? "Đang tính toán..." : "Lấy phí vận chuyển"}
      </button>

      {error && <p className="text-red-500 mt-4">❌ {error}</p>}

      {shippingFee && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold">Kết quả:</h3>
          <p>🛵 Cước vận chuyển: <strong>{shippingFee.fee?.fee.toLocaleString()} VNĐ</strong></p>
          <p>📦 Phí bảo hiểm: <strong>{shippingFee.fee?.insurance_fee.toLocaleString()} VNĐ</strong></p>
          <p>📍 Hỗ trợ giao: {shippingFee.fee?.delivery ? "✅ Có" : "❌ Không"}</p>
        </div>
      )}
    </div>

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
