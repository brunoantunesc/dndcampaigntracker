import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { CommonButton } from './Buttons';
import { CSSTransition } from 'react-transition-group';

interface ActionMenuButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionMenuButton: React.FC<ActionMenuButtonProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <CommonButton
        onClick={() => setOpen((o) => !o)}
        variant="action"
        className="p-1"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Actions"
        type="button"
      >
        <MoreVertical color="currentColor" size={20} />
      </CommonButton>

      <CSSTransition
        in={open}
        timeout={200}
        classNames="fade"
        unmountOnExit
        nodeRef={menuRef}
      >
        <div
          ref={menuRef}
          className="absolute top-0 left-full ml-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-10"
          role="menu"
        >
          <CommonButton
            variant="mini"
            disabled={!onEdit}
            onClick={() => {
              if (onEdit) onEdit();
              setOpen(false);
            }}
            className="w-full rounded-t-none rounded-b px-3 py-2 text-left"
            type="button"
          >
            Edit
          </CommonButton>
          <CommonButton
            variant="miniDanger"
            disabled={!onDelete}
            onClick={() => {
              if (onDelete) onDelete();
              setOpen(false);
            }}
            className="w-full rounded-t-none rounded-b px-3 py-2 text-left"
            type="button"
          >
            Delete
          </CommonButton>
        </div>
      </CSSTransition>

      {/* Estilos CSS para animação */}
      <style>{`
        .fade-enter {
          opacity: 0;
          transform: translateY(-5px);
        }
        .fade-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 200ms, transform 200ms;
        }
        .fade-exit {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-exit-active {
          opacity: 0;
          transform: translateY(-5px);
          transition: opacity 200ms, transform 200ms;
        }
      `}</style>
    </div>
  );
};

export default ActionMenuButton;
