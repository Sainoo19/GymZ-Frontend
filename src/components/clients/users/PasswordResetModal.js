import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaTimes } from 'react-icons/fa';

const PasswordResetModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [verificationToken, setVerificationToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async () => {
        if (!email) {
            setError('Vui lòng nhập email của bạn');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password', { email });
            if (response.data.status === "success") {
                setStep(2);
                // Show success feedback instead of alert
                setError('');
            } else {
                setError('Không thể gửi OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể gửi OTP. Vui lòng thử lại sau.');
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
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password/verify-otp', {
                email,
                otp
            });
            if (response.data.status === "success") {
                setVerificationToken(response.data.data.verificationToken);
                setStep(3);
                setError('');
            } else {
                setError('Mã OTP không hợp lệ');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể xác minh OTP. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password/reset-password', {
                email,
                otp,
                newPassword
            });
            if (response.data.status === "success") {
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setStep(1);
                onClose();

                // Navigate to login page after successful password reset
                navigate('/login-user');
            } else {
                setError('Không thể đặt lại mật khẩu');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const steps = [
        { number: 1, title: "Xác thực" },
        { number: 2, title: "Nhập OTP" },
        { number: 3, title: "Mật khẩu mới" }
    ];

    return (
        <div className="fixed inset-0 bg-primary bg-opacity-70 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 relative overflow-hidden transition-all duration-300 transform">
                {/* Header */}
                <div className="bg-secondary p-6 text-primary">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Khôi phục mật khẩu</h2>
                        <button
                            onClick={onClose}
                            className="text-primary hover:text-primary/70 transition-colors"
                            aria-label="Close"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress steps */}
                    <div className="flex justify-between mt-6">
                        {steps.map((s, i) => (
                            <div key={s.number} className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.number ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {s.number}
                                </div>
                                <p className={`text-xs mt-1 ${step >= s.number ? 'text-primary font-semibold' : 'text-gray-500'}`}>{s.title}</p>
                                {i < steps.length - 1 && (
                                    <div className={`h-0.5 w-12 ${step > s.number ? 'bg-primary' : 'bg-gray-200'} absolute left-[calc(${(i + 1) * (100 / steps.length)}%-${6 / steps.length * 100}%)] top-[64px]`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content area */}
                <div className="p-6">
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Nhập địa chỉ email bạn đã đăng ký tài khoản để nhận mã OTP.
                            </p>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaEnvelope className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                Mã OTP đã được gửi tới email <span className="font-medium">{email}</span>. Vui lòng kiểm tra và nhập mã xác nhận.
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
                                    onClick={() => setStep(1)}
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
                                    Xác nhận mã OTP
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Tạo mật khẩu mới cho tài khoản của bạn.
                            </p>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200"
                                />
                            </div>
                            <div className="relative mb-4">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-200"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-5 py-2.5 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium flex items-center"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Quay lại
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-secondary text-primary rounded-lg hover:bg-secondary/90 transition-colors font-medium disabled:opacity-70"
                                >
                                    {loading ? (
                                        <svg className="animate-spin h-5 w-5 mr-2 inline-block" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : ''}
                                    Hoàn tất đổi mật khẩu
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

export default PasswordResetModal;