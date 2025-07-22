import React, { useState, useEffect } from 'react';
import { colors, fonts, spacing, borders } from '../../styles/designSystem';
import { Link } from 'react-router-dom';

interface Route {
  path: string;
  label: string;
}

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const storedRoutes = localStorage.getItem('routes');
    if (storedRoutes) {
      try {
        const parsedRoutes: Route[] = JSON.parse(storedRoutes);
        setRoutes(parsedRoutes);
      } catch {
        // Caso JSON inválido, limpa as rotas
        setRoutes([]);
      }
    }
  }, []);

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={backdropStyle}
        />
      )}
      <nav style={{ ...drawerStyle, left: isOpen ? 0 : -250 }}>
        <ul style={listStyle}>
          {routes.map(({ path, label }) => (
            <li key={path}>
              <Link style={linkStyle} to={path}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

const drawerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  bottom: 0,
  width: 250,
  backgroundColor: colors.background,
  borderRight: borders.thick,
  paddingTop: spacing.xl,
  boxSizing: 'border-box',
  transition: 'left 0.3s ease',
  zIndex: 1001,
  fontFamily: fonts.main,
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
};

const logoStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '1.5rem',
  fontFamily: fonts.main,
  color: colors.primary,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const linkStyle: React.CSSProperties = {
  display: 'block',
  padding: `${spacing.sm} ${spacing.md}`,
  color: colors.primary,
  textDecoration: 'none',
  fontFamily: fonts.main,
};

export default DrawerMenu;
