import axios from "axios";

const API_URL =
  "https://mini-p-backend-nivwpmu8p-aditya-bajpayees-projects.vercel.app/api/auth/";

const signup = (name, email, password) => {
  return axios.post(API_URL + "signup", {
    name,
    email,
    password,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const refresh = (refreshToken) => {
  return axios.post(API_URL + "refresh", { refreshToken });
};

const authService = {
  signup,
  login,
  logout,
};

export default authService;
