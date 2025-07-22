// src/components/CommonButton
import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';
import { colors, fonts, spacing } from '../styles/designSystem';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'mini' | 'miniDanger' | 'action';

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

const hoverStylesMap: Record<ButtonVariant, { backgroundColor: string; color: string }> = {
  primary: { backgroundColor: colors.primaryDark, color: colors.background },
  secondary: { backgroundColor: '#555555', color: colors.foreground }, // tom mais escuro do border
  danger: { backgroundColor: '#cc4444', color: colors.background },
  mini: { backgroundColor: '#555555', color: colors.foreground },
  miniDanger: { backgroundColor: '#cc4444', color: colors.background },
  action: { backgroundColor: colors.primaryDark, color: colors.background },
};

const baseStylesMap: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.background,
    padding: `${spacing.sm} ${spacing.md}`,
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
  secondary: {
    backgroundColor: colors.border,
    color: colors.foreground,
    padding: `${spacing.sm} ${spacing.md}`,
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
  danger: {
    backgroundColor: colors.danger,
    color: colors.background,
    padding: `${spacing.sm} ${spacing.md}`,
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
  mini: {
    backgroundColor: colors.border,
    color: colors.foreground,
    padding: spacing.xs + ' ' + spacing.sm,
    fontSize: '0.75rem',
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
  miniDanger: {
    backgroundColor: colors.danger,
    color: colors.background,
    padding: spacing.xs + ' ' + spacing.sm,
    fontSize: '0.75rem',
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
  action: {
    backgroundColor: 'transparent',
    color: colors.primary,
    padding: spacing.xs + ' ' + spacing.sm,
    fontSize: '0.75rem',
    fontFamily: fonts.main,
    fontWeight: 600,
    border: 'none',
  },
};

const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const baseClasses = 'rounded font-semibold focus:outline-none transition-colors';

  const [isHovered, setIsHovered] = useState(false);

  // Escolhe o estilo base ou hover conforme o estado de hover
  const currentStyle = disabled
    ? {
        ...baseStylesMap[variant],
        opacity: 0.5,
        cursor: 'not-allowed',
      }
    : isHovered
    ? { ...baseStylesMap[variant], ...hoverStylesMap[variant], cursor: 'pointer' }
    : { ...baseStylesMap[variant], cursor: 'pointer' };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(baseClasses, className, 'transition-colors duration-200')}
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        ...selectedStyles,
      }}
      className={classNames(baseClasses, className, { 'opacity-50 cursor-not-allowed': disabled })}
    >
      {children}
    </button>
  );
};

export { CommonButton, ToggleButton };
