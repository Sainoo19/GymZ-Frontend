import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, provider, signInWithPopup, signOut } from "../../firebase"; // Import Firebase
import GoogleLoginButton from "../../components/clients/login/GoogleLoginButton";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { delay } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPageUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const URL_API = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${URL_API}auth/login/user`,
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${URL_API}auth/google/token`, {
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
  useEffect(() => {
    axios
      .get(`${URL_API}users/profile`, {
        withCredentials: true,
      })
      .then((response) => {
        // Nếu API trả về thành công, người dùng đã đăng nhập
        // Chuyển hướng người dùng đến trang chủ hoặc trang trước đó
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      })
      .catch((error) => {
        // Nếu có lỗi, người dùng chưa đăng nhập, hiển thị form đăng nhập
        console.log("User not logged in, showing login form");
        setIsLoading(false);
      });
  }, [URL_API, navigate, location]);
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg  flex max-w-4xl  w-11/12">
        {/* Left Section */}
        <div className=" md:w-1/2 container mx-auto p-8 flex flex-col ">
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
              <div className="relative">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-10"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
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
              <GoogleLoginButton />


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
        <div className="w-1/2 relative hidden md:block">
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
