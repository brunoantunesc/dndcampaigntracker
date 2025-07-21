import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, fonts, spacing, borders } from '../styles/designSystem';
import DrawerMenu from './DrawerMenu';
import { Menu, LogOut } from 'lucide-react';
import CommonButton from './Buttons.tsx'

const Header = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');

    navigate('/login');
  };

  const handleMouseEnter = () => {
    setDrawerOpen(true);
  };

  const handleMouseLeave = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <header style={headerStyle}>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={hamburgerContainerStyle}
        >
          <Menu color={colors.primary} size={28} />
        </div>
        <div style={logoStyle}>WorldBuilder</div>
        <CommonButton
          onClick={handleLogout}
          variant="secondary"
          className="p-2"
          aria-label="Logout"
        >
          <LogOut color={colors.secondary} size={24} />
        </CommonButton>
      </header>
      
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </>
  );
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.dark,
  padding: '1rem 2rem',
  borderBottom: `2px solid ${colors.primary}`,
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
  position: 'relative',
  zIndex: 10,
};

const hamburgerContainerStyle = {
  cursor: 'pointer',
  padding: spacing.sm,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '60px',
  width: '60px',
};

const logoStyle = {  
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '1.5rem',
  fontFamily: fonts.main,
  color: colors.primary,
};

export default Header;
