import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRoutes } from '../../contexts/RoutesContext';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ isOpen, onClose }) => {
  const { routes } = useRoutes();
  const location = useLocation();

  const commonRoutes = routes.filter((r) => r.type !== 'database');
  const databaseRoutes = routes.filter((r) => r.type === 'database');

  const renderLink = (path: string, label: string) => {
    const isActive = location.pathname === path;

    return isActive ? (
      <span className="block px-4 py-2 text-cyan-400 cursor-default">
        {label}
      </span>
    ) : (
      <Link className="block px-4 py-2 text-primary hover:opacity-80" to={path}>
        {label}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000]"
          onClick={onClose}
        />
      )}
      <nav
        className={`fixed top-0 bottom-0 w-[250px] bg-black border-r-4 border-primary pt-8 transition-left duration-300 z-[1001] font-main ${
          isOpen ? 'left-0' : '-left-[250px]'
        }`}
      >
        <ul className="list-none p-0 m-0">
          {commonRoutes.map(({ path, label }) => (
            <li key={path}>{renderLink(path, label)}</li>
          ))}

          {databaseRoutes.length > 0 && (
            <>
              <li className="px-4 py-2 text-xs text-secondary uppercase font-bold opacity-60 mt-4">
                Database
              </li>
              {databaseRoutes.map(({ path, label }) => (
                <li key={path}>{renderLink(path, label)}</li>
              ))}
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default DrawerMenu;
