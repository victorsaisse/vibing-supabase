"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  apartmentName?: string;
  color?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  setApartment: (apartmentName: string, color: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = (email: string) => {
    setUser({ email });
  };

  const logout = () => {
    setUser(null);
    router.push("/");
  };

  const setApartment = (apartmentName: string, color: string) => {
    setUser((prev) => prev ? { ...prev, apartmentName, color } : null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setApartment }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 