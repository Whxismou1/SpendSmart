import React from "react";
import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const handleClick = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div>
      Dashboard
      <button onClick={handleClick}>Log Out</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
