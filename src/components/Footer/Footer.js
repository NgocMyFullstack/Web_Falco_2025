import React from "react";
import logodb from "../../assets/logodb.png";
import image15 from "../../assets/images/image15.png";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="hdl-footer ">
      <div className="container-fluids">
        <div className="row">
          <div className="footer-bottom">
            <div className="footer-box">
              <img src={image15} className="footer-image" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
