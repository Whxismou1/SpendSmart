import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Button, Checkbox, FormControlLabel,TextField } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email: </label>
        <TextField
          name="email"
          type="email"
          placeholder="user@user.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          variant="standard"
        />
        <br />
        <label htmlFor="password">Password: </label>
        <TextField
          name="password"
          type="password"
          placeholder="*******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          variant="standard"
        />
        <br />
        <FormControlLabel control={<Checkbox defaultChecked />} label="Condiciones de uso" />
        <br />
        <Button type="submit" variant="outlined" size="medium">Login</Button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <Link to="/forgot-password">Forgot password</Link>
        <br />
        Dont have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
