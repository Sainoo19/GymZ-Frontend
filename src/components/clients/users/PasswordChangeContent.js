import React, { useState } from 'react';
import axios from 'axios';
import { FaLock, FaKey, FaArrowLeft, FaShieldAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

function PasswordChangeContent() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [verificationToken, setVerificationToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const URL_API = process.env.REACT_APP_API_URL;

    const handleRequestOtp = async () => {
        if (!currentPassword) {
            setError('Vui lòng nhập mật khẩu hiện tại');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${URL_API}profileUser/user/request-password-change`, {
                currentPassword
            }, {
                withCredentials: true
            });

            if (response.data.status === "success") {
                setStep(2);
                setSuccess('OTP đã được gửi đến email của bạn');
            } else {
                setError('Mật khẩu hiện tại không chính xác');
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
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
            const response = await axios.post(`${URL_API}profileUser/user/verify-change-password-otp`, {
                otp
            }, {
                withCredentials: true
            });

            if (response.data.status === "success") {
                setVerificationToken(response.data.data.verificationToken);
                setStep(3);
                setSuccess('Xác thực OTP thành công');
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

    const handleChangePassword = async () => {
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
            const response = await axios.post(`${URL_API}profileUser/user/change-password`, {
                otp,
                newPassword
            }, {
                withCredentials: true
            });

            if (response.data.status === "success") {
                setSuccess('Đổi mật khẩu thành công');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
                setVerificationToken('');
                setStep(1);
            } else {
                setError('Không thể đổi mật khẩu');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Không thể đổi mật khẩu. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Progress steps
    const steps = [
        { number: 1, title: "Xác thực" },
        { number: 2, title: "Nhập OTP" },
        { number: 3, title: "Mật khẩu mới" }
    ];

    return (
        <div className="w-full bg-white p-8 rounded-xl shadow-md">
            <div className="flex items-center mb-6">
                <div className="bg-secondary rounded-full p-3 mr-4">
                    <FaShieldAlt className="text-primary h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-primary">Đổi Mật Khẩu</h1>
                    <p className="text-gray-600">
                        Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="flex justify-between mb-8">
                {steps.map((s, i) => (
                    <div key={s.number} className="flex flex-col items-center relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-secondary text-primary' : 'bg-gray-200 text-gray-500'} font-bold`}>
                            {s.number}
                        </div>
                        <p className={`text-sm mt-2 ${step >= s.number ? 'text-primary font-medium' : 'text-gray-500'}`}>
                            {s.title}
                        </p>
                        {i < steps.length - 1 && (
                            <div className="absolute h-[2px] bg-gray-200 w-[calc(100%-2.5rem)] left-[75%] top-5 -z-10">
                                <div className={`h-full bg-secondary transition-all duration-300 ${step > s.number ? 'w-full' : 'w-0'}`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Error and success messages */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-start">
                    <FaExclamationTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-start">
                    <FaCheck className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <p>{success}</p>
                </div>
            )}

            <div className="max-w-md mx-auto">
                {step === 1 && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Mật Khẩu Hiện Tại</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleRequestOtp}
                            disabled={loading}
                            className="w-full bg-secondary text-primary py-3 px-4 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center disabled:opacity-70"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <FaKey className="mr-2" />
                            )}
                            Tiếp tục
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Nhập Mã OTP</label>
                            <p className="text-sm text-gray-500 mb-3">
                                Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã xác nhận.
                            </p>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaKey className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all tracking-wider text-center font-medium"
                                    placeholder="Nhập mã OTP"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                                <FaArrowLeft className="mr-2" />
                                Quay lại
                            </button>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="flex-1 bg-secondary text-primary py-3 px-4 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center disabled:opacity-70"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : ''}
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Mật Khẩu Mới</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className="block text-gray-700 font-medium mb-2">Xác Nhận Mật Khẩu Mới</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <FaLock className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                                <FaArrowLeft className="mr-2" />
                                Quay lại
                            </button>

                            <button
                                onClick={handleChangePassword}
                                disabled={loading}
                                className="flex-1 bg-secondary text-primary py-3 px-4 rounded-lg font-bold hover:bg-secondary/90 transition-colors flex items-center justify-center disabled:opacity-70"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : ''}
                                Đổi Mật Khẩu
                            </button>
                        </div>
                    </div>
                )}

                {/* Password security tips */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-primary mb-2 flex items-center">
                        <FaShieldAlt className="mr-2 text-secondary" />
                        Lời khuyên về bảo mật
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            Sử dụng mật khẩu có ít nhất 8 ký tự
                        </li>
                        <li className="flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt
                        </li>
                        <li className="flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            Không sử dụng thông tin cá nhân trong mật khẩu
                        </li>
                        <li className="flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            Thay đổi mật khẩu định kỳ để tăng cường bảo mật
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default PasswordChangeContent;