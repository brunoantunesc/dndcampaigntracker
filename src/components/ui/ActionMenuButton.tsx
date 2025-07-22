import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { CommonButton } from './Buttons'; // ajuste o caminho se precisar

interface ActionMenuButtonProps {
  onEdit?: () => void;
  onDelete?: () => void;
} 

const ActionMenuButton: React.FC<ActionMenuButtonProps> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
    <div className="relative inline-block" ref={menuRef}>
      <CommonButton
        onClick={() => setOpen((o) => !o)}
        variant="action"
        className="p-1"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Ações"
        type="button"
      >
        <MoreVertical color="currentColor" size={20} />
      </CommonButton>

      {open && (
        <div
          className="absolute top-0 left-full ml-2 w-32 bg-gray-800 border border-gray-700 rounded shadow-lg z-10"
          role="menu"
        >
          <CommonButton
            variant="mini"
            disabled={!onEdit}
            onClick={() => {
              if (onEdit) {onEdit()};
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
      )}
    </div>
  );
};

export default ActionMenuButton;
