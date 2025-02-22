import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authcontext";
import "./login.css";
import image2 from "../../assets/images/image2.png";
import { useLogin } from "../../Services/userServies";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const { handleLogin } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = {
      username: email,
      password: password,
    };

    try {
      const response = await handleLogin(credentials);
      console.log("Login response:", response);

      const { access_token, refresh_token, user } = response.data;
      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);
      console.log("User:", user);

      if (access_token && refresh_token) {
        login(user, access_token, refresh_token);
        navigate("/");
      } else {
        setErrorMessage("Dữ liệu đăng nhập không hợp lệ.");
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      setErrorMessage("Tài khoản hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng nhập</h2>
        <p className="login-subtitle">
          Nhập tài khoản và mật khẩu để đăng nhập hệ thống
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Tài khoản
            </label>
            <input
              type="email"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Mật khẩu
            </label>

            <input
              type="password"
              id="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
              required
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <div className="forgot-password">
            <a href="#forgot-password">Quên mật khẩu?</a>
          </div>

          <div className="login-btn-container">
            <button type="submit" className="login-btn-background">
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
      <div className="background">
        <img className="login-image" src={image2} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
