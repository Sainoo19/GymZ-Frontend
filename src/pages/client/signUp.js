import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPageUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState({ street: "", city: "", country: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/auth/register/user", { email, password, phone, name, address });
            if (response.data.status === "success") {
                // Redirect to the login page or home page
                navigate("/login-user");
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Failed to sign up");
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value
        }));
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
                {/* Left Section */}
                <div className="w-1/2 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Chào mừng <span className="wave">👋</span>
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Hôm nay là một ngày mới. Đó là ngày của bạn!
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Tên người dùng
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Tên người dùng"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Số điện thoại
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="text"
                                placeholder="Số điện thoại"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
                                Địa chỉ (Số nhà, đường)
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="street"
                                type="text"
                                placeholder="Số nhà, đường"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                                Thành phố
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="city"
                                type="text"
                                placeholder="Thành phố"
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
                                Quốc gia
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="country"
                                type="text"
                                placeholder="Quốc gia"
                                name="country"
                                value={address.country}
                                onChange={handleAddressChange}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                        <div className="mb-6">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 mt-6">
                        Bạn đã có tài khoản?
                        <a className="text-blue-500 hover:text-blue-800" href="/login-user">
                            Đăng nhập
                        </a>
                    </p>
                </div>

                {/* Right Section */}
                <div className="w-1/2 relative">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/15kDt7v93-7BnU9_EzemqaW9rY4V3vZ2BsfuCXGz8nM.jpg"
                        alt="Gym background"
                        className="w-full h-full object-cover rounded-r-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-8">
                        <h2 className="text-4xl font-bold text-yellow-500 mb-2">START TRAINING NOW</h2>
                        <p className="text-white mb-4">
                            Golden Health — Your Dream Body! Discover a modern fitness space with state-of-the-art equipment, professional trainers, and personalized workout plans. Your journey to transformation starts here!
                        </p>
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                            START NOW
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPageUser;