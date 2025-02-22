import React, { useState, useEffect } from "react";
import image from "../../assets/img/image.jpg";
import bed from "../../assets/img/bed.png";
import glasses from "../../assets/img/glasses.png";
import light from "../../assets/img/light.png";
import "./imagehover.css";

const ImageHover = () => {
  const [hoveredLayer, setHoveredLayer] = useState(null);
  const [hotspots, setHotspots] = useState([]);

  const handleMouseEnter = (layerId) => {
    setHoveredLayer(layerId);
  };

  const handleMouseLeave = () => {
    setHoveredLayer(null);
  };
  useEffect(() => {
    const updateHotspots = () => {
      const bedElement = document.querySelector(".layer.bed");
      const glassesElement = document.querySelector(".layer.glasses");
      const containerElement = document.querySelector(
        ".image-combined-container"
      );

      if (bedElement && glassesElement && containerElement) {
        const containerRect = containerElement.getBoundingClientRect();

        const bedRect = bedElement.getBoundingClientRect();
        const glassesRect = glassesElement.getBoundingClientRect();

        setHotspots([
          {
            id: "bed",
            x: bedRect.left - containerRect.left,
            y: bedRect.top - containerRect.top,
            width: bedRect.width,
            height: bedRect.height,
          },
          {
            id: "glasses",
            x: glassesRect.left - containerRect.left,
            y: glassesRect.top - containerRect.top,
            width: glassesRect.width,
            height: glassesRect.height,
          },
        ]);
      }
    };

    updateHotspots();
    window.addEventListener("resize", updateHotspots);

    return () => {
      window.removeEventListener("resize", updateHotspots);
    };
  }, []);

  const handleMouseMove = (e, layerId) => {
    if (hoveredLayer === layerId) {
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      console.log(`Mouse Position on ${layerId} - X: ${mouseX}, Y: ${mouseY}`);
    }
  };

  return (
    <div className="image-combined-container">
      <img src={image} alt="Background" className="layer background" />

      <img
        src={bed}
        alt="Bed"
        className={`layer bed ${hoveredLayer === "bed" ? "hovered" : ""}`}
        onMouseEnter={() => handleMouseEnter("bed")}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, "bed")}
      />

      <img
        src={glasses}
        alt="Glasses"
        className={`layer glasses ${
          hoveredLayer === "glasses" ? "hovered" : ""
        }`}
        onMouseEnter={() => handleMouseEnter("glasses")}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, "glasses")}
      />
      <img
        src={light}
        alt="light"
        className={`layer light ${hoveredLayer === "light" ? "hovered" : ""}`}
        onMouseEnter={() => handleMouseEnter("light")}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, "light")}
      />
    </div>
  );
};

export default ImageHover;
