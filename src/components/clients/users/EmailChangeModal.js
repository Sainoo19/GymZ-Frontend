import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaTimes, FaKey, FaArrowLeft, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const EmailChangeModal = ({ isOpen, onClose, onEmailChange }) => {
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOtp = async () => {
        if (!newEmail) {
            setError('Vui lòng nhập email mới');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            setError('Địa chỉ email không hợp lệ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:3000/profileUser/send-otp', { newEmail }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            setStep(2);
            setSuccess('Mã OTP đã được gửi đến email mới của bạn');
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể gửi mã OTP. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setError('Vui lòng nhập mã OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/profileUser/verify-otp', { newEmail, otp }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            if (response.data.status === "success") {
                setSuccess('Thay đổi email thành công');
                onEmailChange(newEmail);
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setError('Mã OTP không hợp lệ');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể xác minh mã OTP. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const steps = [
        { number: 1, title: "Nhập Email" },
        { number: 2, title: "Xác thực OTP" }
    ];

    return (
        <div className="fixed inset-0 bg-primary bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden transition-all duration-300 transform">
                {/* Header */}
                <div className="bg-secondary p-6 text-primary">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Thay Đổi Email</h2>
                        <button
                            onClick={onClose}
                            className="text-primary hover:text-primary/70 transition-colors"
                            aria-label="Close"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress steps */}
                    <div className="flex justify-around mt-6">
                        {steps.map((s, i) => (
                            <div key={s.number} className="flex flex-col items-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.number ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {s.number}
                                </div>
                                <p className={`text-xs mt-1 ${step >= s.number ? 'text-primary font-semibold' : 'text-gray-500'}`}>{s.title}</p>
                                {i < steps.length - 1 && (
                                    <div className="absolute h-[2px] bg-gray-200 w-[150px] left-[60px] top-4 -z-10">
                                        <div className={`h-full bg-primary transition-all duration-300 ${step > s.number ? 'w-full' : 'w-0'}`}></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start">
                            <FaExclamationTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm flex items-start">
                            <FaCheck className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                            <p>{success}</p>
                        </div>
                    )}

                    {step === 1 && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Nhập địa chỉ email mới mà bạn muốn sử dụng cho tài khoản của mình.
                            </p>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Nhập email mới"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSendOtp}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors font-medium flex items-center disabled:opacity-70"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : <FaKey className="mr-2" />}
                                    Gửi mã OTP
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Mã OTP đã được gửi tới email <span className="font-medium">{newEmail}</span>. Vui lòng kiểm tra và nhập mã xác nhận.
                            </p>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaKey className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200 tracking-widest text-center font-medium"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="px-5 py-2.5 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors font-medium disabled:opacity-70"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : ''}
                                    Xác nhận
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer with additional info */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-500">
                    Nếu bạn không nhận được mã OTP, vui lòng kiểm tra thư mục spam hoặc liên hệ hỗ trợ
                </div>
            </div>
        </div>
    );
};

export default EmailChangeModal;