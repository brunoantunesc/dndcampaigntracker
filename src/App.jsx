// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateCalendar from './pages/calendars/CreateCalendar';
import CreateWorld from './pages/worlds/CreateWorld';
import CreateCampaign from './pages/campaigns/CreateCampaign';
import EditCampaign from './pages/campaigns/EditCampaign';
import { useAuth } from './contexts/AuthContext';
import { RoutesProvider, useRoutes } from './contexts/RoutesContext';
import CreateSession from './pages/sessions/CreateSession';
import EditSession from './pages/sessions/EditSession';
import CreateArc from './pages/arcs/CreateArc';
import EditArc from './pages/arcs/EditArc';
import CharacterCreate from './pages/characters/CreateCharacter';
import EditCharacter from './pages/characters/EditCharacter';
import EditCalendar from './pages/calendars/EditCalendar';
import WorldTimeline from './pages/timeline/WorldTimeline';

const componentMap = {
  WorldList: React.lazy(() => import('./pages/worlds/WorldList')),
  CampaignList: React.lazy(() => import('./pages/campaigns/CampaignList')),
  CharacterList: React.lazy(() => import('./pages/characters/CharacterList')),
  SessionList: React.lazy(() => import('./pages/sessions/SessionList')),
  ArcList: React.lazy(() => import('./pages/arcs/ArcList')),
  CalendarList: React.lazy(() => import('./pages/calendars/CalendarList')),
  TimelineList: React.lazy(() => import('./pages/timeline/TimelineList'))
};

// Rota protegida que verifica o token no contexto Auth
const PrivateRoute = () => {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  // Pegamos as rotas do contexto RoutesContext
  const { routes, loading } = useRoutes();

  if (loading) return <div>Loading...</div>;

  return (
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
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

          {/* Rotas estáticas protegidas */}
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

          <Route
            path="/campaigns/create"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <CreateCampaign />
              </React.Suspense>
            }
          />

          <Route
            path="/campaigns/edit/:id"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <EditCampaign />
              </React.Suspense>
            }
          />

          <Route
            path="/sessions/create"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <CreateSession />
              </React.Suspense>
            }
          />

          <Route
            path="/sessions/edit/:id"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <EditSession />
              </React.Suspense>
            }
          />
          
          <Route
            path="/arcs/create"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <CreateArc />
              </React.Suspense>
            }
          />
          
          <Route
            path="/arcs/edit/:id"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <EditArc />
              </React.Suspense>
            }
          />
          
        
          <Route
            path="/characters/create"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <CharacterCreate />
              </React.Suspense>
            }
          />
          
        
          <Route
            path="/characters/edit/:id"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <EditCharacter />
              </React.Suspense>
            }
          />
          
          <Route
            path="/calendars/edit/:id"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <EditCalendar />
              </React.Suspense>
            }
          />
          
          <Route
            path="/timeline/world/:id/"
            element={
              <React.Suspense fallback={<div>Loading...</div>}>
                <WorldTimeline />
              </React.Suspense>
            }
          />
        </Route>

      </Routes>
  );
}

export default App;
