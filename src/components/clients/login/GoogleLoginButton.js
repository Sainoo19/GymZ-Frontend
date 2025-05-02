// GoogleLoginButton.js
import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Thay bằng clientId thật
const URL_API = process.env.REACT_APP_API_URL; // Thay bằng API thật

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = React.useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${URL_API}auth/google/token`, {
        token: credentialResponse.credential,
      }, { withCredentials: true });

      if (response.data.status === "success") {
        const from = location.state?.from?.pathname || "/";
        navigate(from);
        window.location.reload();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Đăng nhập Google thất bại");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="w-full flex justify-center ">
        <div className="w-full ">

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Đăng nhập Google thất bại")}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>
      {error && (
        <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
      )}
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
