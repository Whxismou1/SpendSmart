const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/users";


export const changeProfilePicture = async (formData) => {
  const response = await fetch(BASE_URL + "/upload-profile-picture", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to login");
  }

  console.log(data);

  return data;
};

export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const res = await fetch(BASE_URL + "/change-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to logout");
    }

    return data;
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw error;
  }
};