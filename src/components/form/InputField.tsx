// src/components/Form/InputField.tsx
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div style={{ maxWidth: '50%' }} className="mb-4">
    <label className="block text-sm font-medium mb-1" htmlFor={name}>
      {label}
    </label>

    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-md bg-black border-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
    />
  </div>
);

export default InputField;
