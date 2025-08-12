// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/landingPage.jsx";
import UserLoginPage from "./components/user/userLogin.jsx";
import AdminLoginPage from "./components/admin/adminlogin.jsx";
import UserDashboard from "./components/user/userDashboard.jsx";
import CenterSelectionPage from "./components/user/bookingPage.jsx";
import FinalConfirmationPage from "./components/user/confirmationPage.jsx";
import UserRegistrationPage from "./components/user/userRegister.jsx";
import AdminDashboard from "./components/admin/adminDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-login" element={<UserLoginPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/user-confirm-page" element={<FinalConfirmationPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/center-select" element={<CenterSelectionPage />} />
        <Route path="/user/register" element={<UserRegistrationPage  />} />
        <Route path="/admin-dashboard" element={<AdminDashboard/>} />
        {/* Add more routes here later */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;