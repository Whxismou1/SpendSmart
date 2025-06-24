const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/movements";

export const downloadMovements = async (movements) => {
  try {
    const response = await fetch(BASE_URL + "/downloadMovements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

      },
      credentials: "include",
      body: JSON.stringify({ movements }),
    });

    if (!response.ok) {
      throw new Error("Error generating Excel file" + response.statusText);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error downloading movements:", error);
    throw error;
  }
};

export const getAllMovements = async () => {
  try {
    const response = await fetch(BASE_URL + "/getAllMovements", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch movements");
    }

    return data.userMovements;
  } catch (error) {
    console.error("Error during getAllMovements:", error.message);
    throw error;
  }
};

export const deleteMovementByID = async (id) => {
  try {
    const response = await fetch(BASE_URL + "/removeMovementByID/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch movements");
    }

    return data.userMovements;
  } catch (error) {
    console.error("Error during getAllMovements:", error.message);
    throw error;
  }
};

export const addMovement = async (
  movementDescription,
  quantity,
  movementCategory,
  movementType,
  movementDate
) => {
  try {
    const response = await fetch(BASE_URL + "/addMovement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        movementDescription,
        quantity,
        movementCategory,
        movementType,
        movementDate,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch movements");
    }

    return data.userMovements;
  } catch (error) {
    console.error("Error during getAllMovements:", error.message);
    throw error;
  }
};
