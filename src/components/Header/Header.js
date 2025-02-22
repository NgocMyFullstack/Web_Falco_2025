import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../views/Login/authcontext";
import "bootstrap/dist/css/bootstrap.min.css";
import useSession from "../hooks/useSession";
import "./Header.css";
import logodb from "../../assets/logodb.png";
import avata from "../../assets/images/avata.svg";
import { RxAvatar } from "react-icons/rx";
import { GrPerformance } from "react-icons/gr";
import { FaDiscord } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [activeLink, setActiveLink] = useState("#home");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Đồng bộ từ sessionStorage
  const [userFromSession, setUser] = useSession("user", null);
  const decodedAccessToken = JSON.parse(
    sessionStorage.getItem("decodedAccessToken")
  );

  useEffect(() => {
    if (isAuthenticated && !userFromSession && decodedAccessToken) {
      // Cập nhật thông tin người dùng từ decodedAccessToken nếu chưa có trong session
      setUser({
        full_name: decodedAccessToken.full_name || "",
        username: decodedAccessToken.username,
        user_role: decodedAccessToken.user_role,
        type_of_user: decodedAccessToken.type_of_user,
      });
    }
  }, [isAuthenticated, user, userFromSession, decodedAccessToken, setUser]);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated); // Kiểm tra trạng thái xác thực
    console.log("userFromSession:", userFromSession);
    if (isAuthenticated && !userFromSession) {
      setUser(user); // Cập nhật thông tin người dùng từ useAuth
    }
  }, [isAuthenticated, user, userFromSession, setUser]);

  const handleNavClick = (e, to, requiresAuth) => {
    e.preventDefault();

    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
    } else {
      setActiveLink(to);
      navigate(to);
    }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu((prev) => !prev);
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-info")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const renderLogoContainer = () => {
    if (location.pathname === "/generate") {
      return (
        <div
          style={{
            paddingRight: "40px",
            paddingTop: "30px",
            paddingBottom: "20px",
            width: "100%",
            height: "100%",
            textAlign: "center",
            color: "#FFD1B5",
            fontSize: "clamp(24px, 5vw,42px)",
            fontFamily: "Agbalumo",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          FALCO - IMAGE
        </div>
      );
    }
    if (location.pathname === "/generatepro") {
      return (
        <div
          style={{
            paddingRight: "40px",
            paddingTop: "30px",
            paddingBottom: "20px",
            width: "100%",
            height: "100%",
            textAlign: "center",
            color: "#FFD1B5",
            fontSize: "clamp(24px, 5vw, 42px)",
            fontFamily: "Agbalumo",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          FALCO - PRO
        </div>
      );
    }
    if (location.pathname === "/generatepro/maskfalco") {
      return (
        <div
          style={{
            paddingRight: "40px",
            paddingTop: "30px",
            paddingBottom: "20px",
            width: "100%",
            height: "100%",
            textAlign: "center",
            color: "#FFD1B5",
            fontSize: "clamp(24px, 5vw, 42px)",
            fontFamily: "Agbalumo",
            fontWeight: "500",
            wordWrap: "break-word",
          }}
        >
          FALCO - PRO
        </div>
      );
    }

    return (
      <div className="logo-container">
        <img src={logodb} alt="DbPlus Logo" className="logo" />
        <Navbar.Brand href="/" className="navbar-brand">
          DB - FALCO
        </Navbar.Brand>
      </div>
    );
  };

  const getNavbarStyle = () => {
    if (location.pathname === "/generate") {
      return { backgroundColor: "#022e52" };
    }
    if (location.pathname === "/generatepro") {
      return { backgroundColor: "#302f30" };
    }
    if (location.pathname === "/generatepro/maskfalco") {
      return { backgroundColor: "#302f30" };
    }
    return { backgroundColor: "#f8f9fa" };
  };

  return (
    <Navbar className="navbar-fixed" style={getNavbarStyle()} expand="lg">
      <Container>
        {renderLogoContainer()}

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link
              to="/"
              className={`button ${activeLink === "#home" ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, "/", false)}
            >
              Home
            </Link>
            <Link
              to="/index"
              className={`button ${activeLink === "#gallery" ? "active" : ""}`}
              onClick={(e) => handleNavClick(e, "/", true)}
            >
              Gallery
            </Link>
            <Link
              to={
                decodedAccessToken?.user_role === "Staff"
                  ? "/generate"
                  : decodedAccessToken?.user_role === "Manager"
                  ? "/generatepro"
                  : "#"
              }
              className={`button ${activeLink === "#generate" ? "active" : ""}`}
              onClick={(e) =>
                handleNavClick(
                  e,
                  decodedAccessToken?.user_role === "Manager"
                    ? "/generatepro"
                    : decodedAccessToken?.user_role === "Staff"
                    ? "/generate"
                    : "#",
                  true
                )
              }
            >
              Generate
            </Link>
            <Link
              to="#falco-learning"
              className={`button ${
                activeLink === "#falco-learning" ? "active" : ""
              }`}
              onClick={(e) => handleNavClick(e, "#falco-learning", true)}
            >
              Falco Learning
            </Link>
          </Nav>

          {isAuthenticated ? (
            <div className="user-info">
              <div className="avatar-container" onClick={toggleMenu}>
                <img src={avata} alt="User Avatar" className="avatar" />
              </div>
              {showMenu && (
                <div className="dropdown-menu">
                  <div className="menu-item" onClick={() => navigate("/")}>
                    <RxAvatar size={24} style={{ marginRight: "8px" }} />
                    Profile
                  </div>
                  <div className="menu-item" onClick={() => navigate("/")}>
                    <GrPerformance size={24} style={{ marginRight: "8px" }} />
                    Manage account
                  </div>
                  <div className="menu-item" onClick={() => navigate("/")}>
                    <FaDiscord size={24} style={{ marginRight: "8px" }} />
                    Join our community
                  </div>
                  <div className="menu-item" onClick={logout}>
                    <FiLogOut size={24} style={{ marginRight: "8px" }} />
                    Sign out
                  </div>
                </div>
              )}

              <div className="user-details">
                <div className="user-name" style={{ whiteSpace: "nowrap" }}>
                  {decodedAccessToken?.full_name ||
                    decodedAccessToken?.username ||
                    "User"}
                </div>
                <div className="user-detail">
                  <span className="label">Level:</span>
                  <span className="value level">
                    {decodedAccessToken?.user_role || "N/A"}
                  </span>
                </div>
                <div className="user-detail">
                  <span className="label">Point:</span>
                  <span className="value point">500</span>
                </div>
              </div>
            </div>
          ) : (
            <Nav className="button-use">
              <Link to="/login" className="button login">
                Login
              </Link>
              <Link to="/sign_up" className="button signUp">
                Sign Up
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
