import React, { useState } from 'react';
import axios from 'axios';

const PasswordResetModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [verificationToken, setVerificationToken] = useState('');

    const handleSendOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password', { email });
            if (response.data.status === "success") {
                setStep(2);
                alert('OTP đã được gửi đến email của bạn (nếu email tồn tại)');
            } else {
                alert('Không thể gửi OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể gửi OTP. Vui lòng thử lại sau.');
            }
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password/verify-otp', {
                email,
                otp
            });
            if (response.data.status === "success") {
                setVerificationToken(response.data.data.verificationToken);
                setStep(3);
            } else {
                alert('Mã OTP không hợp lệ');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể xác minh OTP. Vui lòng thử lại.');
            }
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu không khớp');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/profileUser/forgot-password/reset-password', {
                email,
                otp,
                newPassword
            });
            if (response.data.status === "success") {
                alert('Mật khẩu đã được đặt lại thành công');
                setEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmPassword('');
                setStep(1);
                onClose();
            } else {
                alert('Không thể đặt lại mật khẩu');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                {step === 1 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Quên Mật Khẩu</h2>
                        <p className="mb-4">Nhập email của bạn để nhận mã OTP</p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleSendOtp}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Gửi OTP
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                )}
                {step === 2 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Xác Nhận OTP</h2>
                        <p className="mb-4">Nhập mã OTP đã được gửi đến email của bạn</p>
                        <input
                            type="text"
                            placeholder="Mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleVerifyOtp}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Xác Nhận
                            </button>
                            <button
                                onClick={() => setStep(1)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Quay lại
                            </button>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <h2 className="text-xl font-bold mb-4">Đặt Lại Mật Khẩu</h2>
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <div className="flex justify-between">
                            <button
                                onClick={handleResetPassword}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Đặt Lại Mật Khẩu
                            </button>
                            <button
                                onClick={() => setStep(2)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Quay lại
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PasswordResetModal;