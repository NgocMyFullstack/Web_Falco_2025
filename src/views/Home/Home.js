import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image3 from "../../assets/images/image3.png";
import image4 from "../../assets/images/image4.png";
import "./Home.css";
import { useAuth } from "../../views/Login/authcontext";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [setActiveLink] = useState("#home");
  const [decodedAccessToken, setDecodedAccessToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("decodedAccessToken");
    if (token) {
      setDecodedAccessToken(JSON.parse(token));
    }
  }, []);

  const cardData = [
    { id: 1, link: "/generate", image: image4, title: "FALCO - IMAGE" },
    { id: 2, link: "/", image: image4, title: "FALCO - POSTPRODUCTION" },
  ];

  // Update the card links based on the role in the decodedAccessToken
  const updatedCardData = cardData.map((card) => {
    if (decodedAccessToken) {
      if (
        decodedAccessToken.user_role === "Staff" &&
        card.link === "/generate"
      ) {
        return { ...card, link: "/generate" };
      }
      if (
        decodedAccessToken.user_role === "Manager" &&
        card.link === "/generate"
      ) {
        return { ...card, link: "/generatepro" };
      }
    }
    return card;
  });

  const handleNavClick = (e, to, requiresAuth) => {
    e.preventDefault();

    if (requiresAuth && !isAuthenticated) {
      navigate("/login");
    } else {
      setActiveLink(to);
      navigate(to);
    }
  };

  return (
    <div className="app-home">
      <div className="custom-container">
        <div className="row mt-3 g-4">
          <div className="col-12">
            <div className="card">
              <img
                src={image3}
                alt="Falco Postproduction"
                className="card-img-top"
              />
              <div className="title">FALCO PRACTICAL APP</div>
            </div>
          </div>
        </div>
        <div className="row mt-2 g-4">
          {updatedCardData.map((card) => (
            <div key={card.id} className="col-6">
              <Link to={card.link} className="custom-link">
                <div className="card">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{card.title}</h5>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
