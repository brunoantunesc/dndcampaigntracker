// src/contexts/RoutesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Route {
  path: string;
  label: string;
}

interface RoutesContextType {
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  return (
    <RoutesContext.Provider value={{ routes, setRoutes }}>
      {children}
    </RoutesContext.Provider>
  );
};

export const useRoutes = (): RoutesContextType => {
  const context = useContext(RoutesContext);
  if (!context) {
    throw new Error('useRoutes must be used within a RoutesProvider');
  }
  return context;
};
