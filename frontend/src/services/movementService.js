const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/movements";

export const downloadMovements = async () => {
  try {
    const response = await fetch(BASE_URL + "/downloadMovements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
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
    const response = await fetch(BASE_URL + "/all", {
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

    return data;
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

export const addMovement = async (newMovement) => {
  try {
    const response = await fetch(BASE_URL + "/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newMovement),
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


