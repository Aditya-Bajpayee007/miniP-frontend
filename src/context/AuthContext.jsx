import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import authService from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        setLoading(false);
        return;
      }

      // Try to validate the existing access token by requesting the profile
      try {
        const profileResp = await axios.get(
          "https://mini-p-backend-nivwpmu8p-aditya-bajpayees-projects.vercel.app/api/user/profile",
          {
            headers: { Authorization: `Bearer ${storedUser.accessToken}` },
          }
        );

        // Keep tokens from storedUser but merge profile fields
        const merged = { ...storedUser, ...profileResp.data };
        localStorage.setItem("user", JSON.stringify(merged));
        setUser(merged);
      } catch (err) {
        // If access token failed, try to refresh using refreshToken
        const refreshToken = storedUser.refreshToken;
        if (refreshToken) {
          try {
            const refreshResp = await authService.refresh(refreshToken);
            const newAccessToken = refreshResp.data.accessToken;

            // Update stored user tokens
            const updatedUser = { ...storedUser, accessToken: newAccessToken };
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Retry profile fetch with new token
            const profileResp2 = await axios.get(
              "https://mini-p-backend-fqh00lqjh-aditya-bajpayees-projects.vercel.app/api/user/profile",
              {
                headers: { Authorization: `Bearer ${newAccessToken}` },
              }
            );

            const merged = { ...updatedUser, ...profileResp2.data };
            localStorage.setItem("user", JSON.stringify(merged));
            setUser(merged);
          } catch (refreshErr) {
            // Refresh failed — clear stored credentials
            authService.logout();
            setUser(null);
          }
        } else {
          // No refresh token — clear stored credentials
          authService.logout();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // authService.login stores response.data in localStorage already
    setUser(data);
  };

  const signup = async (name, email, password) => {
    const data = await authService.signup(name, email, password);
    // Might want to auto-login on signup — backend returns tokens already in our flow
    if (data && data.data) {
      // axios returns response object; authService.signup returns the axios promise
      // but signup here likely returns the axios response; however to keep parity with login,
      // we'll attempt to set user if response contains data
      setUser(data.data);
      localStorage.setItem("user", JSON.stringify(data.data));
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
