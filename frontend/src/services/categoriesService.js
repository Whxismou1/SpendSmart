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
