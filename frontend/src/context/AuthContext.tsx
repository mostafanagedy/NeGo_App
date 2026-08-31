"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export interface User {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  coverPicture?: string;
  bio?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("nego_token");
    if (storedToken) {
      setToken(storedToken);
      fetchMe(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (authToken: string) => {
    try {
      const res = await apiRequest("/auth/me");
      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("nego_token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("nego_token");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const merged: User = { ...user };
      (Object.keys(updatedFields) as (keyof User)[]).forEach((key) => {
        if (updatedFields[key] !== undefined && updatedFields[key] !== null) {
          (merged as any)[key] = updatedFields[key];
        }
      });
      setUser(merged);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
