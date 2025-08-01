import React, { useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import { colors, fonts, spacing, borders } from '../../styles/designSystem';
import DrawerMenu from './DrawerMenu';
import { Menu, LogOut } from 'lucide-react';
import { CommonButton } from './Buttons';
import { resetLocalStorage } from '../../utils/authFetch';
import { Compass } from 'lucide-react'	

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const location = useLocation();

  const getPageContext = (pathname: string): { url: string; text: string; } => {
    const section = pathname.split('/')[1];
    if (!section) return {url: '', text: 'Home'};
    return {url: section, text: section.charAt(0).toUpperCase() + section.slice(1)};
  };
  const currentSection = getPageContext(location.pathname);

  const handleLogout = (): void => {
    resetLocalStorage();
    navigate('/login');
  };

  const handleMouseEnter = (): void => {
    setDrawerOpen(true);
  };

  const handleMouseLeave = (): void => {
    setDrawerOpen(false);
  };

  const handleNavigation = () => {
    navigate(`/${currentSection.url}`)
  }

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
        <div className={`${currentSection.url !== '' ? 'cursor-pointer' : ''}`} style={logoStyle}>
          <div className="flex items-center gap-2 text-white text-md">
            <span onClick={() => navigate('/')} className="font-bold text-cyan-400">WorldBuilder </span>
            <Compass size={30} className="text-cyan-400 mx-4" />
            <span onClick={handleNavigation} className="text-gray-300"> {currentSection.text}</span>
          </div>
        </div>
        <CommonButton
          onClick={handleLogout}
          variant="secondary"
          className="p-2"
          aria-label="Logout"
        >
          <LogOut color={colors.background} size={24} />
        </CommonButton>
      </header>

      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <DrawerMenu isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </>
  );
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: colors.background,
  padding: '1rem 2rem',
  borderBottom: `2px solid ${colors.primary}`,
  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
  position: 'relative',
  zIndex: 10,
};

const hamburgerContainerStyle: React.CSSProperties = {
  cursor: 'pointer',
  padding: spacing.sm,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '60px',
  width: '60px',
};

const logoStyle: React.CSSProperties = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '1.5rem',
  fontFamily: fonts.main,
  color: colors.primary,
};

export default Header;
