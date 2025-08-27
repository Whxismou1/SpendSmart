const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/categories";

export const getCategoriesData = async () => {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      credentials: "include",
    });

    const dat = await res.json();

    console.log(dat);

    return dat;
  } catch (error) {
    console.log(error);
  }
};

export const addSpecificCategory = async (name, icon, color) => {
  try {
    const res = await fetch(BASE_URL + "/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, icon, color }),
    });

    const dat = await res.json();

    console.log(dat);

    return dat;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSpecificCategory = async (id) => {
  try {
    const response = await fetch(BASE_URL + "/" + id, {
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

  } catch (error) {
    console.error("Error during deleteSpecificCategory:", error.message);
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
    console.error("Error during deleteMovementByID:", error.message);
    throw error;
  }
};
