// src/components/ui/Select
import React from 'react';
import { spacing } from '../../styles/designSystem';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
}) => {
  return (
    <div style={{ paddingTop: spacing.md }} className="mb-4">
      <label htmlFor={name} className="block text-cyan-400 font-bold mb-1">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-black border border-cyan-400 text-white rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
