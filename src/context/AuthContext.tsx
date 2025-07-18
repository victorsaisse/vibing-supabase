"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useState } from "react";

interface User {
  email: string;
  leftWallColor?: string;
  rightWallColor?: string;
  selectedSofa?: string;
  selectedMirror?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  setApartment: (leftWallColor: string, rightWallColor: string, selectedSofa: string, selectedMirror: string) => void;
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

  const setApartment = (leftWallColor: string, rightWallColor: string, selectedSofa: string, selectedMirror: string) => {
    setUser((prev) => prev ? { ...prev, leftWallColor, rightWallColor, selectedSofa, selectedMirror } : null);
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