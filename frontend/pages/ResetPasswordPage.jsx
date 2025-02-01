import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import toast from "react-hot-toast";
export const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmedPassword, setconfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
  }

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();
    if (password !== confirmedPassword) {
      setError("Passwords dont match!");
      return;
    }

    try {
      await resetPassword(password, token);
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Enter password: </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirmedPassword">Confirm password: </label>
        <input
          type="password"
          name="confirmedPassword"
          id="confirmedPassword"
          value={confirmedPassword}
          onChange={(e) => setconfirmedPassword(e.target.value)}
        />
        <input type="submit" value="Reset password" />
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
