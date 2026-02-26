import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("gpsxpress_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string) => {
    // Demo admin account
    if (email === "admin@gpsxpress.com" && password === "admin123") {
      const u: User = { id: "1", name: "Administrador", email, role: "admin" };
      setUser(u);
      sessionStorage.setItem("gpsxpress_user", JSON.stringify(u));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("gpsxpress_user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
