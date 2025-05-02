import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdminPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_URL}auth/login/employee`, { email, password }, {
                withCredentials: true // Ensure cookies are sent with the request
            });

            if (response.data.status === "success") {
                // Get user role to determine redirect
                const role = response.data.data.employee.role;

                // Redirect based on role
                switch (role) {
                    case "admin":
                        navigate("/admin/");
                        break;
                    case "manager":
                    case "staff":
                        navigate("/admin/products");
                        break;
                    case "PT":
                        navigate("/admin/members");
                        break;
                    default:
                        // Default fallback
                        navigate("/admin/");
                }

                // Refresh the page to ensure the admin data is correctly displayed
                window.location.reload();
            } else {
                setError(response.data.message || "Đăng nhập không thành công");
            }
        } catch (error) {
            console.error("Login error:", error);

            // More detailed error messages
            if (error.response) {
                if (error.response.status === 401) {
                    setError("Email hoặc mật khẩu không chính xác");
                } else if (error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError(`Lỗi (${error.response.status}): Vui lòng thử lại sau`);
                }
            } else if (error.request) {
                setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối của bạn.");
            } else {
                setError("Đã xảy ra lỗi. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg flex flex-col md:flex-row max-w-4xl w-full">
                {/* Left Section - Form */}
                <div className="w-full md:w-1/2 p-6 md:p-8">
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
                                required
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
                                required
                            />
                        </div>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        <div className="mb-6">
                            <button
                                className={`bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center ${loading ? 'opacity-75' : ''}`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Đang đăng nhập...
                                    </>
                                ) : "Đăng nhập"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Section */}
                <div className="hidden md:block w-1/2 relative">
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