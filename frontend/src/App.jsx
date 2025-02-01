import "./App.css";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import EmailVerificationPage from "../pages/EmailVerificationPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

import { Toaster } from "react-hot-toast";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import AddMovementPage from "../pages/AddMovementPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/add-movement" element={<AddMovementPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
