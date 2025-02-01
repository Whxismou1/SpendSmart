import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { addMovement } from "../services/movementService";
function AddMovementPage() {
  const [movementDescription, setMovementDescription] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [movementCategory, setMovementCategory] = useState("");
  const [movementType, setMovementType] = useState("");
  const [movementDate, setMovementDate] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!movementCategory || !movementType) {
      toast.error("All fields are required");
      return;
    }

    try {
      await addMovement(
        movementDescription,
        quantity,
        movementCategory,
        movementType,
        movementDate
      );

      setMovementDescription("");
      setQuantity(0);
      setMovementCategory("");
      setMovementType("");
      setMovementDate("");
      toast.success("Movement added succesfully!");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="description">Description: </label>
        <input
          type="text"
          name="description"
          value={movementDescription}
          onChange={(e) => setMovementDescription(e.target.value)}
          required
        />

        <label htmlFor="movementType">Movement type: </label>
        <select
          name="movementType"
          id="movementType"
          value={movementType}
          onChange={(e) => setMovementType(e.target.value)}
          required
        >
          <option value="">Select an option</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label htmlFor="quantity">Quantity: </label>
        <input
          type="number"
          name="quantity"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label htmlFor="category">Category: </label>
        <select
          name="category"
          id="category"
          value={movementCategory}
          onChange={(e) => setMovementCategory(e.target.value)}
          required
        >
          <option value="">Select an option</option>
          <option value="fun">Fun</option>
          <option value="waza4">waza4</option>
          <option value="Other">Other</option>
        </select>

        <label htmlFor="movementDate">Date: </label>
        <input
          type="date"
          value={movementDate}
          onChange={(e) => setMovementDate(e.target.value)}
          required
        />

        <input type="submit" value="Add movement" />
      </form>
      <Link to="/dashboard">Back to dashboard</Link>
    </div>
  );
}

export default AddMovementPage;
