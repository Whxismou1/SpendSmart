// import React from "react";
import { logout } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getAllMovements,
  deleteMovementByID,
  downloadMovements,
} from "../services/movementService";
import { Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [movements, setMovements] = useState([]);
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const fetchMovements = async () => {
      const dataMovements = await getAllMovements();
      const total = await dataMovements.reduce((acc, movement) => {
        if (movement.movementType === "income") {
          return acc + movement.quantity;
        }
        return acc - movement.quantity;
      }, 0);
      setBalance(total);
      console.log(total);
      setMovements(dataMovements);
    };
    fetchMovements();
  }, [movements]);

  const handleClick = async () => {
    try {
      await logout();
      toast.success("Logout successfully!");
      navigate("/");
    } catch (error) {
      setError("Failed to log out. Please try again." + error);
    }
  };

  const handleDelete = async (movementID) => {
    console.log(movementID);
    try {
      await deleteMovementByID(movementID);
      toast.success("Movement deleted successfully");
      navigate("/dashboard");
    } catch (error) {
      setError(error);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadMovements(movements);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "movimientos.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("File downloaded successfully!");
    } catch (error) {
      toast.error("Error downloading file: " + error.message);
    }
  };
  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "movementDescription", headerName: "Description", width: 300 },
    { field: "movementType", headerName: "Type", width: 150 },
    { field: "movementCategory", headerName: "Category", width: 200 },
    { field: "movementDate", headerName: "Date", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Datos de las filas (movimientos)
  const rows = movements.map((movement) => ({
    id: movement._id,
    movementDescription: movement.movementDescription,
    movementType: movement.movementType,
    movementCategory: movement.movementCategory,
    movementDate: movement.movementDate,
  }));

  return (
    <div>
      <Button
        variant="contained"
        color="default"
        onClick={handleClick}
        style={{ marginTop: 20, marginLeft: 10 }}
      >
        Log Out
      </Button>
      <Typography variant="h4" gutterBottom>
        Dashboard Balance: {balance} €
      </Typography>
      <Typography variant="h6" gutterBottom>
        Last Movements:
      </Typography>
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleDownload}
        style={{ marginTop: 20 }}
      >
        Download
      </Button>
      <Link to="/add-movement">
        <Button variant="contained" color="primary">
          Add Movement
        </Button>
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Dashboard;
