// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  triggerRefresh: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AuthContext.Provider value={{ triggerRefresh: () => setRefreshKey(k => k + 1) }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthRefresh = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthRefresh must be used within AuthProvider");
  return context.triggerRefresh;
};
