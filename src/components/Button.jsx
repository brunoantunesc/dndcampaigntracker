import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded font-semibold focus:outline-none transition-colors';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classNames(baseClasses, variantClasses[variant], className, {
        'opacity-50 cursor-not-allowed': disabled,
      })}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
