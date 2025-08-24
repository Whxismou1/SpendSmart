import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePage from "./pages/ProfilePage";
import "./styles/App.css";

import { Toaster } from "react-hot-toast";
import AddMovementPage from "./pages/AddMovementPage";
import { NotFound } from "./pages/NotFound";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoriesPage from "./pages/CategoriesPage";
import BudgetPage from "./pages/BudgetPage";
import MarketPage from "./pages/MarketPage";
import MovementsPage from "./pages/MovementsPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-movement" element={<AddMovementPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/budgets" element={<BudgetPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/movements" element={<MovementsPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
