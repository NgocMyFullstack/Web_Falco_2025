import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import Index from "./views/index";
import Home from "./views/Home/Home";
import Login from "./views/Login/login";
import SignUp from "./views/SignUp/signup";
import Generate from "./views/Generate/generate";
import { AuthProvider } from "./views/Login/authcontext";
import GeneratePro from "./views/GeneratePro/generatepro";
import MaskFalco from "./views/MaskFalco/maskfaco";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute ";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
            <Route path="index" element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="sign_up" element={<SignUp />} />
            <Route
              path="generate"
              element={
                <PrivateRoute>
                  <Generate />
                </PrivateRoute>
              }
            />
            <Route
              path="generatepro"
              element={
                <PrivateRoute>
                  <GeneratePro />
                </PrivateRoute>
              }
            />
            <Route
              path="generatepro/maskfalco"
              element={
                <PrivateRoute>
                  <MaskFalco />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
