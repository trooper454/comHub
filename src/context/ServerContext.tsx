// src/context/ServerContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ServerContextType = {
  activeServerId: string | null;
  setActiveServerId: (id: string | null) => void;
};

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
  const [activeServerId, setActiveServerId] = useState<string | null>(null);

  return (
    <ServerContext.Provider value={{ activeServerId, setActiveServerId }}>
      {children}
    </ServerContext.Provider>
  );
}

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) throw new Error("useServer must be used within ServerProvider");
  return context;
};
