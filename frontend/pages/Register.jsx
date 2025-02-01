import { useState } from "react";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField, Select } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import EuroIcon from '@mui/icons-material/Euro';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import dayjs from 'dayjs';
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState(null);
  const [currency, setCurrency] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    setError("");
    e.preventDefault();
    try {
      await register(email, name, password, confirmPassword, birthDate, currency);
      navigate("/verify-email");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <TextField
          type="email"
          name="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="standard"
        />
        <br />
        <label htmlFor="name">Name: </label>
        <TextField
          type="text"
          name="name"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="standard"
        />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Basic date picker"
            value={birthDate}
            onChange={(newValue) => setBirthDate(newValue)}
            maxDate={dayjs()}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <label htmlFor="password">Password: </label>
        <TextField
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          variant="standard"
        />
        <br />
        <label htmlFor="confirm-password">Confirm Password: </label>
        <TextField
          type="password"
          name="confirm-password"
          id="confirm-password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="standard"
        />
        <br />
        <FormControl fullWidth variant="standard">
          <InputLabel htmlFor="currency">Currency</InputLabel>
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            label="Currency"
            id="currency"
            required
          >
            <MenuItem value="EUR">
              <EuroIcon style={{ marginRight: 8 }} /> Euro (EUR)
            </MenuItem>
            <MenuItem value="USD">
              <AttachMoneyIcon style={{ marginRight: 8 }} /> Dollar (USD)
            </MenuItem>
          </Select>
        </FormControl>
        <br />

        <br />
        <Button variant="outlined" type="submit">
          Register
        </Button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <p>I have an account</p> <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
