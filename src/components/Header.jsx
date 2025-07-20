import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, fonts, spacing, borders } from '../styles/designSystem';
import DrawerMenu from './DrawerMenu';
import { Menu, LogOut } from 'lucide-react';
import CommonButton from './Buttons'

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
        <div style={logoStyle}>DnD Tracker</div>
        <CommonButton
          onClick={handleLogout}
          variant="secondary"
          className="p-2"
          aria-label="Logout"
        >
          <LogOut color={colors.primary} size={24} />
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
  backgroundColor: colors.background,
  borderBottom: borders.thick,
  padding: `${spacing.sm} ${spacing.lg}`,
  fontFamily: fonts.main,
  color: colors.primary,
  position: 'relative',
  zIndex: 1100,
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
  fontSize: '1rem',
};

export default Header;
