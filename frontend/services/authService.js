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

export const register = async (email, name, password, confirmPassword,  birthdate, currency) => {
  try {
    const res = await fetch(BASE_URL + "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password, confirmPassword, birthdate, currency }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to register");
    }

    return data;
  } catch (error) {
    console.log("Error during register: ", error.message);
    throw error;
  }
};

export const verifyEmail = async (verificationCode) => {
  try {
    const res = await fetch(BASE_URL + "/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationCode }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to verify email");
    }

    return data;
  } catch (error) {
    console.log("Error during verification email: ", error.message);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await fetch(BASE_URL + "/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to verify email");
    }

    return data;
  } catch (error) {
    console.log("Error during verification email: ", error.message);
    throw error;
  }
};

export const resetPassword = async (password, resetToken) => {
  try {
    const res = await fetch(BASE_URL + "/reset-password/" + resetToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to verify email");
    }

    return data;
  } catch (error) {
    console.log("Error during reset password: ", error.message);
    throw error;
  }
};
