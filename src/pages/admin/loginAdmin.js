import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdminPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/auth/login/employee", { email, password }, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            if (response.data.status === "success") {
                // Redirect to the admin dashboard or home page
                navigate("/admin/");
                // Refresh the page to ensure the admin data is correctly displayed
                window.location.reload();
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError("Invalid email or password");
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
                {/* Left Section */}
                <div className="w-1/2 p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Admin Login <span className="wave">👋</span>
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Welcome back! Please login to your account.
                    </p>
                    <form onSubmit={handleSubmit}>
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
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                        <div className="mb-6">
                            <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="submit"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section */}
                <div className="w-1/2 relative">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/15kDt7v93-7BnU9_EzemqaW9rY4V3vZ2BsfuCXGz8nM.jpg"
                        alt="Admin background"
                        className="w-full h-full object-cover rounded-r-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-8">
                        <h2 className="text-4xl font-bold text-yellow-500 mb-2">Welcome Admin</h2>
                        <p className="text-white mb-4">
                            Manage your gym efficiently with our admin dashboard.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdminPage;