const BASE_URL = import.meta.env.VITE_BACKEND_URL + "/api/v1/budgets";

export const getBudgets = async () => {
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

export const addBudget = async (form) => {
  try {
    const res = await fetch(BASE_URL + "/add", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const dat = await res.json();

    console.log("waza,", dat);

    return dat;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBudgetById = async (budgetId) => {
  try {
    const res = await fetch(`${BASE_URL}/${budgetId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Error eliminando presupuesto");
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
