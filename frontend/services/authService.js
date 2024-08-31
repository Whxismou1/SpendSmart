const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/auth";
export const login = async (email, password) => {
  try {
    const response = await fetch(BASE_URL + "/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to login");
    }

    return data;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await fetch(BASE_URL + "/logout", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to logout");
    }

    return data;
  } catch (error) {
    console.error("Error during logout:", error.message);
    throw error;
  }
};
