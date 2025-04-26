import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Đúng cú pháp
  const URL_API = process.env.REACT_APP_API_URL;

  if (!GOOGLE_CLIENT_ID) {
    console.error("❌ GOOGLE_CLIENT_ID không được định nghĩa!");
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${URL_API}auth/google`, {
        token: credentialResponse.credential,
      });

      if (response.data.status === "success") {
        navigate("/");
        window.location.reload();
      } else {
        console.error("Google Login Error:", response.data.message);
      }
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
     <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.error("Google Login Failed")}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="w-full flex items-center justify-center bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Đăng nhập bằng Google
          </button>
        )}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
