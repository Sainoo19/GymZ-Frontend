import React, { useState } from 'react';
import axios from 'axios';

const EmailChangeModal = ({ isOpen, onClose, onEmailChange }) => {
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);

    const handleSendOtp = async () => {
        try {
            await axios.post('http://localhost:3000/profileUser/send-otp', { newEmail }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            setStep(2);
        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP');
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const response = await axios.post('http://localhost:3000/profileUser/verify-otp', { newEmail, otp }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            if (response.data.status === "success") {
                onEmailChange(newEmail);
                onClose();
            } else {
                alert('Failed to verify OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Failed to verify OTP');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg">
                {step === 1 ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">Thay Đổi Email</h2>
                        <input
                            type="email"
                            placeholder="Nhập email mới"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <button
                            onClick={handleSendOtp}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Gửi OTP
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-xl font-bold mb-4">Xác Nhận OTP</h2>
                        <input
                            type="text"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full border border-gray-300 p-2 mb-4"
                        />
                        <button
                            onClick={handleVerifyOtp}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Xác Nhận
                        </button>
                    </>
                )}
                <button
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default EmailChangeModal;