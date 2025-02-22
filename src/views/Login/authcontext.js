import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Mã Hóa JWT
export const decodeJWT = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(atob(base64));
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ sessionStorage khi trang được tải
  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem("accessToken");
    const storedDecodedToken = JSON.parse(
      sessionStorage.getItem("decodedAccessToken")
    );

    if (storedAccessToken && storedDecodedToken) {
      // Nếu đã có accessToken và decodedAccessToken trong sessionStorage
      setUser({
        user_id: storedDecodedToken.user_id,
        username: storedDecodedToken.username,
        full_name: storedDecodedToken.full_name || "",
        user_role: storedDecodedToken.user_role || "",
        type_of_user: storedDecodedToken.type_of_user || "",
      });
      setIsAuthenticated(true);
    } else {
      // Xóa thông tin nếu không có accessToken
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("decodedAccessToken");
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Đăng nhập
  const login = (userData, accessToken, refreshToken) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("accessToken", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    const decoded = decodeJWT(accessToken);
    const userFromToken = {
      user_id: decoded.user_id,
      username: decoded.username,
      full_name: decoded.full_name || "",
      user_role: decoded.user_role || "",
      type_of_user: decoded.type_of_user || "",
    };

    // Lưu user sessionStorage
    sessionStorage.setItem("user", JSON.stringify(userFromToken));
    sessionStorage.setItem("decodedAccessToken", JSON.stringify(decoded));
    setIsAuthenticated(true);
    navigate("/");
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("decodedAccessToken");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
