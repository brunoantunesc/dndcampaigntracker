// src/components/Form/InputField.jsx
import React from 'react';

const InputField = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
  <div style={{maxWidth: '50%'}} className="mb-4">
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
