import React, {useState, useEffect} from 'react';
import { colors, fonts, spacing, borders } from '../styles/designSystem';
import { Link } from 'react-router-dom';

const DrawerMenu = ({ isOpen, onClose }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const storedRoutes = localStorage.getItem('routes');
    if (storedRoutes) {
      setRoutes(JSON.parse(storedRoutes));
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
          <li key={path} >
            <Link style={linkStyle} to={path}>{label}</Link>
          </li>
        ))}
        </ul>
      </nav>
    </>
  );
};

const drawerStyle = {
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

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  zIndex: 1000,
};

const logoStyle = {  
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '1.5rem',
  fontFamily: fonts.main,
  color: colors.primary,
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const linkStyle = {
  display: 'block',
  padding: `${spacing.sm} ${spacing.md}`, // ex: 8px 16px
  color: colors.primary,
  textDecoration: 'none',
  fontFamily: fonts.main,
};
export default DrawerMenu;
