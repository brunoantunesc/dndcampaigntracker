import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchRoutes } from '../services/api';

interface AuthContextType {
  token: string;
  userName: string;
  routes: any[];
  loadingRoutes: boolean;
  login: (token: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [routes, setRoutes] = useState<any[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    async function loadRoutes() {
      if (!token) {
        setLoadingRoutes(false);
        return;
      }

      const storedRoutes = localStorage.getItem('routes');
      if (storedRoutes) {
        setRoutes(JSON.parse(storedRoutes));
      } else {
        const data = await fetchRoutes();
        setRoutes(data);
        localStorage.setItem('routes', JSON.stringify(data));
      }

      setLoadingRoutes(false);
    }

    loadRoutes();
  }, [token]);

  const login = (newToken: string, name: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
    setToken(newToken);
    setUserName(name);
  };

  const logout = () => {
    localStorage.clear();
    setToken('');
    setUserName('');
    setRoutes([]);
  };

  return (
    <AuthContext.Provider value={{ token, userName, routes, loadingRoutes, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
