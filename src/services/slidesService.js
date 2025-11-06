const API_URL =
  "https://mini-p-backend-nivwpmu8p-aditya-bajpayees-projects.vercel.app/api";

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

export const saveSlides = async (topic, slidesData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/slides/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic,
        slidesData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save slides");
    }

    return await response.json();
  } catch (error) {
    console.error("Save slides error:", error);
    throw error;
  }
};

export const getSlides = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/slides`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch slides");
    }

    return await response.json();
  } catch (error) {
    console.error("Get slides error:", error);
    throw error;
  }
};

export const getSlideById = async (id) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("No access token found");
  }

  try {
    const response = await fetch(`${API_URL}/slides/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch slide");
    }

    return await response.json();
  } catch (error) {
    console.error("Get slide error:", error);
    throw error;
  }
};
