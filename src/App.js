// src/App.jsx
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation, 
  useNavigate
} from 'react-router-dom';
import { fetchRoutes } from './services/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import {jwtDecode} from 'jwt-decode';
import CreateCalendar from './pages/calendars/CreateCalendar.tsx';
import CreateWorld from './pages/worlds/CreateWorld.tsx';

/*
// import WorldsList from './pages/worlds/WorldsList';
// import WorldForm from './pages/worlds/WorldForm';
// import WorldDetails from './pages/worlds/WorldDetails';

// import CampaignsList from './pages/campaigns/CampaignsList';
// import CampaignForm from './pages/campaigns/CampaignForm';
// import CampaignDetails from './pages/campaigns/CampaignDetails';

// import CharactersList from './pages/characters/CharactersList';
// import PcForm from './pages/characters/PcForm';
// import NpcForm from './pages/characters/NpcForm';
// import CharacterDetails from './pages/characters/CharacterDetails';

// import SessionsList from './pages/sessions/SessionsList';
// import SessionForm from './pages/sessions/SessionForm';
// import SessionDetails from './pages/sessions/SessionDetails';
*/

const componentMap = {
  WorldList: React.lazy(() => import('./pages/worlds/WorldList.tsx')),
  CampaignList: React.lazy(() => import('./pages/campaigns/CampaignList')),
  CharacterList: React.lazy(() => import('./pages/characters/CharacterList')),
  SessionList: React.lazy(() => import('./pages/sessions/SessionList')),
  CalendarList: React.lazy(() => import('./pages/calendars/CalendarList.tsx')),
};

const useAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Protected route redirects to login if no token
const PrivateRoute = () => {
  const auth = useAuth();
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem('token');
          navigate('/login', { replace: true });
        }
      } catch {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    }
  }, [location, navigate]);

  useEffect(() => {
  async function loadRoutes() {
    const storedRoutes = localStorage.getItem('routes');
    if (storedRoutes) {
      setRoutes(JSON.parse(storedRoutes));
      setLoading(false);
    } else {
      const data = await fetchRoutes();
      setRoutes(data);
      setLoading(false);
      localStorage.setItem('routes', JSON.stringify(data));
    }
  }
  loadRoutes();
}, []);
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
      localStorage.getItem('token') ? <Dashboard /> : <Navigate to="/login" replace />
    } />
        {routes.map(({ path, component }) => {
          const Component = componentMap[component];
          if (!Component) return null;
          return (
            <Route
              key={path}
              path={path}
              element={
                <React.Suspense fallback={<div>Loading page...</div>}>
                  <Component />
                </React.Suspense>
              }
            />
          );
        })}

        {/* Rotas Estáticas */}
        <Route
          path="/worlds/create"
          element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <CreateWorld />
          </React.Suspense>
          }
        />
        
        <Route
          path="/calendars/create"
          element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <CreateCalendar />
          </React.Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
