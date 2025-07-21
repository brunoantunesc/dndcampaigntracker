// src/components/CommonButton.tsx
import React, { ReactNode } from 'react';
import classNames from 'classnames';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface CommonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none transition-colors';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(
        baseClasses,
        variantClasses[variant],
        className,
        { 'opacity-50 cursor-not-allowed': disabled }
      )}
    >
      {children}
    </button>
  );
};

export default CommonButton;
