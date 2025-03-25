import React, { useState } from 'react';
import axios from 'axios';

function PasswordChangeContent() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
    const [verificationToken, setVerificationToken] = useState('');

    const handleRequestOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileUser/user/request-password-change', {
                currentPassword
            }, {
                withCredentials: true // Ensure cookies are sent with the request
            });

            if (response.data.status === "success") {
                setStep(2);
                alert('OTP đã được gửi đến email của bạn');
            } else {
                alert('Mật khẩu hiện tại không chính xác');
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể gửi OTP. Vui lòng thử lại sau.');
            }
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileUser/user/verify-change-password-otp', {
                otp
            }, {
                withCredentials: true
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

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            alert('Mật khẩu không khớp');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/profileUser/user/change-password', {
                otp,
                newPassword
            }, {
                withCredentials: true
            });

            if (response.data.status === "success") {
                alert('Đổi mật khẩu thành công');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setOtp('');
                setVerificationToken('');
                setStep(1);
            } else {
                alert('Không thể đổi mật khẩu');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Không thể đổi mật khẩu. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="w-3/4 bg-white p-8">
            <h1 className="text-2xl font-bold mb-2">Đổi Mật Khẩu</h1>
            <p className="text-gray-600 mb-6">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </p>
            <div className="max-w-md">
                {step === 1 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mật Khẩu Hiện Tại</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full border border-gray-300 p-2"
                            />
                        </div>
                        <button
                            onClick={handleRequestOtp}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Tiếp tục
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Nhập Mã OTP</label>
                            <p className="text-sm text-gray-500 mb-2">
                                Mã OTP đã được gửi đến email của bạn
                            </p>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border border-gray-300 p-2"
                            />
                        </div>
                        <button
                            onClick={handleVerifyOtp}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Xác nhận
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="mb-4">
                            <label className="block text-gray-700">Mật Khẩu Mới</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border border-gray-300 p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Xác Nhận Mật Khẩu Mới</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full border border-gray-300 p-2"
                            />
                        </div>
                        <button
                            onClick={handleChangePassword}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Đổi Mật Khẩu
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PasswordChangeContent;