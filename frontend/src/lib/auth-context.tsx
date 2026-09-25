"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "./api";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "SECURITY_ANALYST" | "CLOUD_OPERATOR" | "VIEWER";
  privilege_level: string;
  risk_score: number;
  status: string;
  department: string;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: "ADMIN" | "SECURITY_ANALYST" | "CLOUD_OPERATOR" | "VIEWER") => Promise<void>;
}

const DEMO_ACCOUNTS: Record<string, { email: string; name: string; dept: string; priv: string }> = {
  ADMIN: {
    email: "admin@cloudsentinel.io",
    name: "Sarah Vance (Admin)",
    dept: "Security Operations",
    priv: "SUPERADMIN"
  },
  SECURITY_ANALYST: {
    email: "analyst@cloudsentinel.io",
    name: "Marcus Reed (Lead Analyst)",
    dept: "SOC Operations",
    priv: "ELEVATED"
  },
  CLOUD_OPERATOR: {
    email: "operator@cloudsentinel.io",
    name: "Elena Rostova (DevOps Lead)",
    dept: "Infrastructure",
    priv: "ELEVATED"
  },
  VIEWER: {
    email: "viewer@cloudsentinel.io",
    name: "Priyah Patel (Executive)",
    dept: "Executive Leadership",
    priv: "RESTRICTED"
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  switchRole: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize session or default to Admin demo profile
    const savedUser = localStorage.getItem("cloudsentinel_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setLoading(false);
        return;
      } catch {}
    }

    // Default to Sarah Vance (Admin) for immediate showcase readiness
    const defaultUser: UserProfile = {
      id: "usr-admin-demo",
      email: DEMO_ACCOUNTS.ADMIN.email,
      full_name: DEMO_ACCOUNTS.ADMIN.name,
      role: "ADMIN",
      privilege_level: DEMO_ACCOUNTS.ADMIN.priv,
      risk_score: 10,
      status: "ACTIVE",
      department: DEMO_ACCOUNTS.ADMIN.dept
    };
    setUser(defaultUser);
    localStorage.setItem("cloudsentinel_user", JSON.stringify(defaultUser));
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem("cloudsentinel_token", res.access_token);
      localStorage.setItem("cloudsentinel_user", JSON.stringify(res.user));
      setUser(res.user);
    } catch (e: any) {
      // Fallback for offline/demo match
      const matchingRole = Object.keys(DEMO_ACCOUNTS).find(
        (r) => DEMO_ACCOUNTS[r].email.toLowerCase() === email.toLowerCase()
      ) as "ADMIN" | "SECURITY_ANALYST" | "CLOUD_OPERATOR" | "VIEWER" | undefined;

      if (matchingRole) {
        await switchRole(matchingRole);
      } else {
        throw e;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("cloudsentinel_token");
    localStorage.removeItem("cloudsentinel_user");
    setUser(null);
  };

  const switchRole = async (role: "ADMIN" | "SECURITY_ANALYST" | "CLOUD_OPERATOR" | "VIEWER") => {
    const acc = DEMO_ACCOUNTS[role];
    const newUser: UserProfile = {
      id: `usr-${role.toLowerCase()}-demo`,
      email: acc.email,
      full_name: acc.name,
      role: role,
      privilege_level: acc.priv,
      risk_score: role === "ADMIN" ? 10 : role === "SECURITY_ANALYST" ? 12 : role === "CLOUD_OPERATOR" ? 18 : 5,
      status: "ACTIVE",
      department: acc.dept
    };
    setUser(newUser);
    localStorage.setItem("cloudsentinel_user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
