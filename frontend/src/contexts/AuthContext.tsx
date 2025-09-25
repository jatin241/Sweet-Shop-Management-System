import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: string | null;
  token: string | null;
  isAdmin: boolean;
  login: (token: string, user: string, isAdmin: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    const a = localStorage.getItem("isAdmin");
    if (t) setToken(t);
    if (u) setUser(u);
    if (a) setIsAdmin(a === "true");
  }, []);

  function login(token: string, user: string, isAdmin: boolean) {
    setToken(token);
    setUser(user);
    setIsAdmin(isAdmin);
    localStorage.setItem("token", token);
    localStorage.setItem("user", user);
    localStorage.setItem("isAdmin", String(isAdmin));
  }

  function logout() {
    setToken(null);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
  }

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
