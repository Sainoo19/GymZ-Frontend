import React, { useEffect, useState, useMemo } from "react";
import formatCurrency from "../../utils/formatCurrency";
import axios from "axios";

const ProductsOrdered = ({ selectedItems, onTotalAmountChange, discountAmount, deliveryAddress }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [shippingFee, setShippingFee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalWeight, setTotalWeight] = useState(0);

  // Tính tổng tiền trước giảm giá
  const totalBeforeDiscount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [selectedItems]
  );

  // Tính tổng tiền sau giảm giá
  const totalAfterDiscount = useMemo(() => totalBeforeDiscount - discountAmount, [totalBeforeDiscount, discountAmount]);

  // Tổng tiền trước phí vận chuyển (KHÔNG CỘNG THUẾ)
  const totalBeforeShipping = useMemo(() => totalAfterDiscount, [totalAfterDiscount]);

  // Tổng tiền sau khi cộng phí vận chuyển
  const finalTotal = useMemo(() => totalBeforeShipping + (shippingFee?.fee?.fee || 0), [totalBeforeShipping, shippingFee]);

  useEffect(() => {
    onTotalAmountChange(finalTotal);
  }, [selectedItems, discountAmount, finalTotal, onTotalAmountChange]);

  useEffect(() => {
    const fetchTotalWeight = async () => {
      if (selectedItems.length === 0) return;
      try {
        const response = await axios.post(`${API_URL}shipping/get-total-weight`, { selectedItems });
        setTotalWeight(response.data.totalWeight);
      } catch (error) {
        console.error("Lỗi khi lấy tổng khối lượng:", error);
      }
    };
    fetchTotalWeight();
  }, [selectedItems]);

  useEffect(() => {
    if (!deliveryAddress?.province || !deliveryAddress?.district || !deliveryAddress?.ward || totalWeight === 0) return;

    const fetchShippingFee = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}shipping/shipping-fee`, {
          params: {
            pick_province: "Hồ Chí Minh",
            pick_district: "Quận Bình Thạnh",
            pick_ward: "Phường 13",
            province: deliveryAddress.province,
            district: deliveryAddress.district,
            ward: deliveryAddress.ward,
            street: deliveryAddress.street,
            weight: totalWeight,
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

    fetchShippingFee();
  }, [deliveryAddress, totalWeight]);

  return (
    <div className="border rounded-lg p-4 mt-3 bg-white">
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
              <span className="text-lg font-medium">
                {item.quantity} x {formatCurrency(item.price)}₫
              </span>
            </div>
          ))}

          {/* Tổng tiền chi tiết */}
          <div className="text-right font-bold text-lg mt-4">
            <p className="text-base">Tổng tiền hàng: {formatCurrency(totalBeforeDiscount)}₫</p>
            <p className="text-green-600 text-base">Giảm giá: -{formatCurrency(discountAmount)}₫</p>
            <p className="text-base">
              Cước vận chuyển: {loading ? "Đang tính..." : shippingFee?.fee?.fee ? `${shippingFee.fee.fee.toLocaleString()} VNĐ` : "Chưa tính"}
            </p>
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
