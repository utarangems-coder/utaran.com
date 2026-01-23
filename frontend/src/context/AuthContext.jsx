import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser, getMyProfile } from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app start
  const loadUser = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await getMyProfile();
      setUser(profile);
    } catch {
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials) => {
    const { accessToken } = await loginUser(credentials);
    localStorage.setItem("accessToken", accessToken);
    await loadUser();
  };

  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
