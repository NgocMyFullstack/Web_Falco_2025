import React from "react";
import Index from "./views";
import ImageHover from "./views/HoverImage/image";
import Header from "./components/Header/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";

const App = () => {
  return (
    <div className="App">
      <div className="app-header">
        <Header />
      </div>
      <div className="app-content">
        <Outlet />
      </div>
      <div className="app-footer">
        <Footer />
      </div>
    </div>
  );
};

export default App;
