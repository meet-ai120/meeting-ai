import React from "react";
import { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  isLoading: boolean;
  title?: string;
}

interface AppContextType extends AppState {
  updateState: (updates: Partial<AppState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({
    isLoading: false,
    title: "",
  });

  // Create methods to update the state
  const updateState = (updates: Partial<AppState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  // Value object that will be passed to consumers
  const value = {
    ...state,
    updateState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
