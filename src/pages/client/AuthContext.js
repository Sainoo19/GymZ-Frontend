import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
//check login để post các dữ liệu cần thiết( vd check login trc khi gửi Review)
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const URL_API = process.env.REACT_APP_API_URL;


  // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi động
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Kiểm tra thông tin người dùng từ API 1 (users/profile)
        const responseUser = await axios.get(`${URL_API}users/profile`, {
          withCredentials: true,
        });

        // Nếu API 1 trả về dữ liệu và là user
        if (responseUser.data.data) {
          if (responseUser.data.data.role === "user") {
            setUser(responseUser.data.data);
            setIsLoggedIn(true);
            console.log("Đăng nhập với vai trò user");
          } else {
            console.log("Không phải user, kiểm tra tiếp qua API 2...");
          }
        } else {
          console.log("Không có dữ liệu người dùng từ API 1");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra thông tin người dùng từ API 1:", error);

        // Nếu gặp lỗi từ API 1, kiểm tra API 2
        try {
          const adminResponse = await axios.get(`${URL_API}employees/profile`, {
            withCredentials: true,
          });

          if (adminResponse.data.data.role === "admin") {
            setUser(adminResponse.data.data);
            setIsLoggedIn(true);
            console.log("Đăng nhập với vai trò admin");
          } else {
            console.log("Không phải user và không phải admin");
            setIsLoggedIn(false); // Nếu không phải admin, xem như chưa đăng nhập
          }
        } catch (adminError) {
          console.error("Lỗi khi kiểm tra admin:", adminError);
          setIsLoggedIn(false); // Nếu không phải admin, xem như chưa đăng nhập
        }
      } finally {
        setLoading(false); // Đã kiểm tra xong
      }
    };

    checkLoginStatus();
  }, []); // Chạy một lần khi component mount


  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading }}>
      {loading ? <p>Đang kiểm tra trạng thái đăng nhập...</p> : children}
    </AuthContext.Provider>
  );
};

// Hook để sử dụng AuthContext dễ dàng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;