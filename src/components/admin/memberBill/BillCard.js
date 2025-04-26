import React, { useState } from 'react';
import { FaEdit, FaTrashAlt, FaUser, FaMoneyBillWave, FaCalendarAlt, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import axios from 'axios';
import reformDateTime from '../../utils/reformDateTime';

const BillCard = ({ bill, onEdit, onDelete, onPaymentSuccess }) => {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [error, setError] = useState('');
    const URL_API = process.env.REACT_APP_API_URL;

    // Check if bill is unpaid
    const isUnpaid = !bill.paymentDate || bill.status === 'Chưa thanh toán';

    // Handle payment method change
    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    // Handle payment confirmation
    const handleConfirmPayment = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axios.post(
                `${URL_API}membersBill/confirm-payment`,
                {
                    billId: bill._id,
                    paymentMethod
                },
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                // Close modal
                setShowPaymentModal(false);

                // Notify parent component to refresh data
                if (onPaymentSuccess) {
                    onPaymentSuccess(bill._id, response.data.data.payment);
                }
                setLoading(false);
            } else {
                setError(response.data.message || 'Không thể xác nhận thanh toán');
                setLoading(false);
            }
        } catch (err) {
            console.error('Error confirming payment:', err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi khi xác nhận thanh toán');
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
            <div className="p-4">
                {/* Header with ID and Status */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                        <span className="text-gray-500 text-sm">ID: </span>
                        {bill._id}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bill.statusColor} bg-opacity-20`}>
                        {bill.status}
                    </span>
                </div>

                {/* Bill details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Hội viên</p>
                            <p className="font-medium">{bill.memberID}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FaMoneyBillWave className="text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Số tiền</p>
                            <p className="font-medium text-red-600">{bill.formattedAmount}</p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <MdPayment className="text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                            <p className="font-medium">
                                {bill.formattedPaymentMethod || 'Chưa thanh toán'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-500">Ngày thanh toán</p>
                            <p className="font-medium">
                                {bill.formattedPaymentDate || 'Chưa thanh toán'}
                            </p>
                        </div>
                    </div>

                    {bill.description && (
                        <div className="flex items-start col-span-2">
                            <FaInfoCircle className="text-gray-500 mr-2 mt-1" />
                            <div>
                                <p className="text-sm text-gray-500">Mô tả</p>
                                <p className="font-medium">{bill.description}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment button for unpaid bills */}
                {isUnpaid && (
                    <div className="mt-4 border-t pt-3">
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded flex items-center justify-center"
                        >
                            <FaCheckCircle className="mr-2" /> Xác nhận thanh toán
                        </button>
                    </div>
                )}

                {/* Footer with timestamps and actions */}
                <div className="mt-4 pt-3 border-t flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        <p>Tạo lúc: {bill.formattedCreatedAt}</p>
                        {bill.updatedAt !== bill.createdAt && (
                            <p>Cập nhật lúc: {reformDateTime(bill.updatedAt)}</p>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(bill._id)}
                            className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                            title="Chỉnh sửa"
                        >
                            <FaEdit className="text-blue-600" />
                        </button>
                        <button
                            onClick={() => onDelete(bill._id)}
                            className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                            title="Xóa"
                        >
                            <FaTrashAlt className="text-red-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Xác nhận thanh toán</h2>
                        <p className="mb-4">Vui lòng chọn phương thức thanh toán để hoàn tất giao dịch.</p>

                        <div className="mb-4">
                            <p className="font-medium">Thông tin hóa đơn:</p>
                            <ul className="mt-2 list-disc list-inside text-gray-600">
                                <li>ID Hóa đơn: {bill._id}</li>
                                <li>ID Hội viên: {bill.memberID}</li>
                                <li>Số tiền: {bill.formattedAmount}</li>
                            </ul>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Phương thức thanh toán:
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                disabled={loading}
                            >
                                <option value="CASH">Tiền mặt</option>
                                <option value="CREDIT_CARD">Thẻ tín dụng</option>
                                <option value="BANK_TRANSFER">Chuyển khoản</option>
                                <option value="MOBILE_PAYMENT">Thanh toán di động</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-all"
                                onClick={() => setShowPaymentModal(false)}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all flex items-center"
                                onClick={handleConfirmPayment}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillCard;