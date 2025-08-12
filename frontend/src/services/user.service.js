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
