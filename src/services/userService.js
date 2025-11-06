import axios from "axios";

const API_URL =
  "https://mini-p-backend-jqdb-8f6tvt6ux-aditya-bajpayees-projects.vercel.app/api/user/";

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user.accessToken : null;
};

const getProfile = () => {
  const token = getAuthToken();
  if (!token) {
    return Promise.reject("No access token found");
  }

  return axios.get(API_URL + "profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const userService = {
  getProfile,
};

export default userService;
