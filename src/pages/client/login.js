import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../../firebase"; // Import Firebase
import GoogleLoginButton from "../../components/clients/login/GoogleLoginButton";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { delay } from "framer-motion";

const LoginPageUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login/user",
        { email, password },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );


      if (response.data.status === "success") {
        const from = location.state?.from?.pathname || "/";
        navigate(from);
        window.location.reload();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://localhost:3000/auth/google/token", {
        token: credentialResponse.credential, // Gửi token đến backend để xác thực
      }, { withCredentials: true });

      if (response.data.status === "success") {
        const from = location.state?.from?.pathname || "/";
        navigate(from);
        // Refresh the page to ensure the user data is correctly displayed
        window.location.reload();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Đăng nhập Google thất bại");
    }
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
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email hoặc Tên người dùng
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Email hoặc Tên người dùng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
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
            {error && (
              <p className="text-red-500 text-xs italic mb-4">{error}</p>
            )}
            <div className="flex items-center justify-between mb-6">
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="/forgot-password"
              >
                Quên mật khẩu?
              </a>
            </div>
            <div className="mb-6">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Đăng nhập
              </button>
            </div>
            <div className="text-center text-gray-500 mb-4">Hoặc</div>
            <div className="flex flex-col space-y-2">

              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.error("Google Login Failed")}
                  redirectUri="http://localhost:3000/auth/google/callback"
                />
              </GoogleOAuthProvider>

              <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex items-center justify-center">
                <img
                  src="https://storage.googleapis.com/a1aa/image/6lzJ7maaihIFrFKf1Me1IPWlwwdov-O5fONRPrmMWsM.jpg"
                  alt="Facebook logo"
                  className="mr-2"
                  width="20"
                  height="20"
                />
                Đăng nhập bằng Facebook
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Bạn chưa có tài khoản?
            <a className="text-blue-500 hover:text-blue-800" href="/sign-up">
              Đăng ký
            </a>
          </p>
          <p className="text-center text-gray-500 mt-6">
            Bạn là nhân viên?
            <a
              className="text-blue-500 hover:text-blue-800"
              href="/login-employee"
            >
              Đăng nhập nhân viên
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
            <h2 className="text-4xl font-bold text-yellow-500 mb-2">
              START TRAINING NOW
            </h2>
            <p className="text-white mb-4">
              Golden Health — Your Dream Body! Discover a modern fitness space
              with state-of-the-art equipment, professional trainers, and
              personalized workout plans. Your journey to transformation starts
              here!
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

export default LoginPageUser;
