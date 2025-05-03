import { createContext, useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";

const AuthContext = createContext();

// Tạo instance axios để tái sử dụng
const axiosInstance = axios.create({
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const URL_API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    let isMounted = true; // Giải quyết vấn đề memory leak

    const checkLoginStatus = async () => {
      try {
        // Kiểm tra thông tin người dùng từ API users/profile
        const responseUser = await axiosInstance.get(`${URL_API}users/profile`);

        // Kiểm tra nếu component đã unmount thì dừng thực thi
        if (!isMounted) return;

        if (responseUser.data.data && responseUser.data.data.role === "user") {
          setUser(responseUser.data.data);
          setIsLoggedIn(true);
        } else {
          // Nếu không phải user, kiểm tra tiếp admin
          const adminResponse = await axiosInstance.get(`${URL_API}employees/profile`);

          if (!isMounted) return;

          if (adminResponse.data.data && adminResponse.data.data.role === "admin") {
            setUser(adminResponse.data.data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        if (!isMounted) return;

        // Nếu API 1 lỗi, kiểm tra API 2
        try {
          const adminResponse = await axiosInstance.get(`${URL_API}employees/profile`);

          if (!isMounted) return;

          if (adminResponse.data.data && adminResponse.data.data.role === "admin") {
            setUser(adminResponse.data.data);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (adminError) {
          if (!isMounted) return;
          setIsLoggedIn(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkLoginStatus();

    // Cleanup function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [URL_API]);

  // Tối ưu re-renders bằng useMemo
  const contextValue = useMemo(() => {
    return { user, isLoggedIn, loading };
  }, [user, isLoggedIn, loading]);

  if (loading) {
    // Sử dụng loading component nhẹ hơn thay vì text
    return <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;