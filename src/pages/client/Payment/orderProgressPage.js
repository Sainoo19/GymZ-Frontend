import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaPhone, FaBox, FaMoneyBillWave, FaSpinner, FaCheck, FaShoppingCart, FaHistory } from "react-icons/fa";

const OrderProgressPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const paymentMethod = searchParams.get("paymentMethod");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const URL_API = process.env.REACT_APP_API_URL;
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // 🔥 Dùng useRef để đảm bảo createPayment chỉ gọi 1 lần
  const isPaymentCreated = useRef(false);

  useEffect(() => {
    if (orderId && !isProcessing) {
      console.log("🚀 Running processOrder() once..."); // Debug log
      setSuccessMessage("🎉 Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
      setIsProcessing(true);
      processOrder();
      fetchOrderDetails();
    }
  }, [orderId]);

  const processOrder = async () => {
    if (!isPaymentCreated.current) {
      isPaymentCreated.current = true; // ✅ Đánh dấu để ngăn gọi API nhiều lần
      await createPayment();
    }

    await clearPaidItemsFromCart(orderId);

    if (paymentMethod === "momo") {
      fetchOrderStatus();
    } else {
      setLoading(false);
    }
  };

  const clearPaidItemsFromCart = async (orderId) => {
    try {
      await axios.delete(`${URL_API}cartClient/clear`, {
        headers: { "Content-Type": "application/json" },
        data: { orderId },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Lỗi khi xoá sản phẩm trong giỏ hàng:", error.response?.data || error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await axios.post(`${URL_API}payment/transaction-status`, { orderId });
      setStatusHistory(response.data.statusHistory || []);
    } catch (error) {
      console.error("Lỗi lấy trạng thái đơn hàng:", error);
      setStatusHistory([]);
    }
  };

  const createPayment = async () => {
    try {
      await axios.post(`${URL_API}paymentClient/create`, { orderId, paymentMethod });
      console.log("✅ Payment created successfully!");
    } catch (error) {
      console.error("Lỗi tạo payment:", error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      // Fetch order details
      const orderResponse = await axios.get(`${URL_API}orderClient/${orderId}`, {
        withCredentials: true
      });

      if (orderResponse.data && orderResponse.data.order) {
        setOrderDetails(orderResponse.data.order);
      }

      // Fetch payment details
      const paymentResponse = await axios.get(`${URL_API}paymentClient/${orderId}`, {
        withCredentials: true
      });

      if (paymentResponse.data && paymentResponse.data.payment) {
        setPaymentDetails(paymentResponse.data.payment);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount).replace('₫', 'VNĐ');
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Thông Tin Đơn Hàng</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded-md mb-6 flex items-center justify-center">
          <FaCheck className="text-green-600 mr-2" size={20} />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <FaSpinner className="animate-spin text-primary mr-2" size={24} />
          <span className="font-medium">Đang tải thông tin đơn hàng...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order Status History */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary p-4 text-white flex items-center">
              <FaHistory className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Trạng Thái Đơn Hàng</h2>
            </div>
            <div className="p-4">
              <ul className="border rounded-lg overflow-hidden">
                {statusHistory.length > 0 ? (
                  statusHistory.map((status, index) => (
                    <li key={index} className="py-3 px-4 border-b last:border-b-0 flex items-center bg-white hover:bg-gray-50 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                        <FaCheck />
                      </div>
                      <div>
                        <div className="font-medium">{status}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-3 px-4 bg-white flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                      <FaCheck />
                    </div>
                    <div className="font-medium">
                      {paymentMethod === "cod" ? "Đặt hàng thành công (COD)" : "Đặt hàng và thanh toán thành công"}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary p-4 text-white flex items-center">
                <FaBox className="mr-2" size={18} />
                <h2 className="text-lg font-semibold">Chi Tiết Đơn Hàng #{orderDetails._id}</h2>
              </div>
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Thông Tin Người Nhận
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="mb-1"><span className="font-medium">Họ tên:</span> {orderDetails.deliveryName}</p>
                    <p className="mb-1"><span className="font-medium">Số điện thoại:</span> {orderDetails.deliveryPhoneNumber}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {orderDetails.deliveryAdress?.street}, {orderDetails.deliveryAdress?.ward}, {orderDetails.deliveryAdress?.district}, {orderDetails.deliveryAdress?.province}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FaBox className="mr-2" /> Sản Phẩm ({orderDetails.items?.length || 0})
                  </h3>
                  <div className="bg-gray-50 rounded-lg border border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {orderDetails.items?.map((item, index) => (
                        <li key={index} className="p-4 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center">
                            <div className="h-20 w-20 flex-shrink-0 mr-4 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.productImage || '/img/product-placeholder.png'}
                                alt={item.productName}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{item.productName}</div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Phân loại:</span> {item.category}
                                {item.theme && <>, <span className="font-medium">Loại hàng:</span> {item.theme}</>}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Đơn giá:</span> {formatCurrency(item.price)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">x{item.quantity}</div>
                              <div className="font-semibold text-primary mt-1">
                                {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FaMoneyBillWave className="mr-2" /> Thông Tin Thanh Toán
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tổng tiền hàng:</span>
                      <span>{formatCurrency(orderDetails.totalPrice - (orderDetails.shippingFee || 0))}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>{orderDetails.shippingFee ? formatCurrency(orderDetails.shippingFee) : 'Miễn phí'}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t mt-2">
                      <span>Tổng thanh toán:</span>
                      <span className="text-primary">{formatCurrency(orderDetails.totalPrice)}</span>
                    </div>
                    <div className="mt-3 pt-2 border-t">
                      <span className="font-medium">Phương thức thanh toán:</span>
                      {paymentMethod === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng (COD)'}
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Thời gian đặt hàng:</span> {formatDate(orderDetails.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary p-4 text-white flex items-center">
                <FaMoneyBillWave className="mr-2" size={18} />
                <h2 className="text-lg font-semibold">Chi Tiết Thanh Toán</h2>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="mb-2"><span className="font-medium">Mã thanh toán:</span> {paymentDetails._id}</p>
                      <p className="mb-2">
                        <span className="font-medium">Trạng thái:</span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {paymentMethod === 'cod' ? 'Chờ thanh toán khi nhận hàng' : 'Đã thanh toán'}
                        </span>
                      </p>
                      <p className="mb-2"><span className="font-medium">Thời gian:</span> {formatDate(paymentDetails.createdAt)}</p>
                    </div>
                    <div>
                      <p className="mb-2"><span className="font-medium">Phương thức:</span> {paymentMethod === 'momo' ? 'Ví MoMo' : 'Thanh toán khi nhận hàng (COD)'}</p>
                      <p className="mb-2"><span className="font-medium">Số tiền:</span> {formatCurrency(paymentDetails.amount || orderDetails?.totalPrice)}</p>
                      {paymentDetails.transactionId && (
                        <p><span className="font-medium">Mã giao dịch:</span> {paymentDetails.transactionId}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <a
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaShoppingCart className="mr-2" /> Tiếp tục mua sắm
            </a>
            <a
              href="/my-orders"
              className="bg-primary hover:bg-secondary text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaHistory className="mr-2" /> Xem lịch sử đơn hàng
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProgressPage;