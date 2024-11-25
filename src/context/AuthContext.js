import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("isAuthenticated"))
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = (userInfo) => {
    console.log(userInfo);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
