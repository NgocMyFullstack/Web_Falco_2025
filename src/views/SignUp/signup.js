import React, { useState } from "react";
import "./signup.css";
import image2 from "../../assets/images/image2.png";

const SingUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Đăng nhập thành công!");
  };

  return (
    <div className="login-container container-fluid">
      <div className="col-ms-5">
        <div className="login-box">
          <h2 className="login-title">Đăng Ký</h2>
          <p className="login-subtitle">
            Nhập tài khoản và mật khẩu để đăng ký hệ thống
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Họ và Tên
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập Họ và Tên của bạn"
                required
              />
            </div>
            {/* <div className="input-group">
              <label htmlFor="dob" className="input-label">
                Ngày sinh
              </label>
              <input type="date" id="dob" className="input-field" required />
            </div> */}
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
            </div>{" "}
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Nhập Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập Lại mật khẩu của bạn"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">
                <input
                  type="checkbox"
                  id="terms"
                  className="checkbox"
                  required
                />
                Tôi đồng ý với các <a href="/terms">điều khoản sử dụng</a>.
              </label>
            </div>
            <div className="login-btn-container">
              <button type="submit" className="login-btn-background">
                Đăng Ký
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="col-sm-5 ">
        <img className="login-image" src={image2} alt="Login" />
      </div>
    </div>
  );
};

export default SingUp;
