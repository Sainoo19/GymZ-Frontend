import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Đúng cú pháp

  if (!GOOGLE_CLIENT_ID) {
    console.error("❌ GOOGLE_CLIENT_ID không được định nghĩa!");
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
        const response = await axios.post("http://localhost:3000/auth/google", {
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
    />
  </GoogleOAuthProvider>
  
  
  );
};

export default GoogleLoginButton;
