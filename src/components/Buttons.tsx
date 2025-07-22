// src/components/CommonButton.tsx
import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { colors, fonts, spacing } from '../styles/designSystem';

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

interface ToggleButtonProps {
  children: ReactNode;
  selected: boolean;
  onClick: () => void;
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

const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  selected,
  onClick,
  className = '',
  disabled = false,
}) => {
  const baseClasses =
    'px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200';

const selectedStyles = selected
  ? {
      backgroundColor: colors.primary,      
      color: colors.background,               
      border: `1px solid ${colors.primary}`,
    }
  : {
      backgroundColor: 'transparent',
      color: colors.primary,                 
      border: `1px solid ${colors.primary}`,
    };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: `${spacing.xs} ${spacing.sm}`,  
        borderRadius: '9999px',                   
        fontSize: '0.875rem',                    
        fontWeight: 500,                          
        fontFamily: fonts.main,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'color 0.2s, background-color 0.2s, border-color 0.2s',
        ...selectedStyles}}
      className={classNames(
        baseClasses,
        className,
        { 'opacity-50 cursor-not-allowed': disabled }
      )}
    >
      {children}
    </button>
  );
};

export {CommonButton, ToggleButton};
