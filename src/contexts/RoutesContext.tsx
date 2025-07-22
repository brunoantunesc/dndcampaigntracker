import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface Route {
  path: string;
  label: string;
  component: string;
}

interface RoutesContextType {
  routes: Route[];
  loading: boolean;
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
}

const RoutesContext = createContext<RoutesContextType | undefined>(undefined);

export const RoutesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const savedRoutes = localStorage.getItem('routes');
  if (savedRoutes) {
    setRoutes(JSON.parse(savedRoutes));
    setLoading(false);
  } else {
    async function fetchRoutes() {
      try {
        const response = await axios.get('/api/routes');
        setRoutes(response.data);
        localStorage.setItem('routes', JSON.stringify(response.data));
      } catch (error) {
        console.error('Failed to load routes', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }
}, []);

  return (
    <RoutesContext.Provider value={{ routes, loading, setRoutes }}>
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
