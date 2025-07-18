"use client";

import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  leftWallColor?: string;
  rightWallColor?: string;
  selectedSofa?: string;
  selectedMirror?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => void;
  logout: () => void;
  setApartment: (leftWallColor: string, rightWallColor: string, selectedSofa: string, selectedMirror: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from sessionStorage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("vibing-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        sessionStorage.removeItem("vibing-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to sessionStorage whenever user changes
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("vibing-user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("vibing-user");
    }
  }, [user]);

  const login = (email: string) => {
    const newUser = { email };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    router.push("/");
  };

  const setApartment = (leftWallColor: string, rightWallColor: string, selectedSofa: string, selectedMirror: string) => {
    setUser((prev) => prev ? { ...prev, leftWallColor, rightWallColor, selectedSofa, selectedMirror } : null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setApartment }}>
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