import React from 'react';
import ActionMenuButton from './ActionMenuButton';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CardItem: React.FC<CardProps> = ({
  children,
  className = '',
  onEdit,
  onDelete,
}) => {
  return (
    <li className={`p-4 border rounded-lg relative ${className} border-cyan-400`}>
      {children}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2">
          <ActionMenuButton
            onEdit={onEdit ?? (() => {})}
            onDelete={onDelete ?? (() => {})}
          />
        </div>
      )}
    </li>
  );
};

export { CardItem };
