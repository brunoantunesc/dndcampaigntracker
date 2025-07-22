import React from 'react';
import { spacing } from '../../styles/designSystem';

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  readOnly?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputRef,
  readOnly = false,
}) => (
  <div style={{ paddingTop: spacing.md }} className="mb-4">
    <label className="block text-sm font-medium mb-1" htmlFor={name}>
      {label}
    </label>

    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={readOnly}
        ref={inputRef as React.Ref<HTMLTextAreaElement>}
        rows={5} // define altura inicial maior
        className="w-full px-3 py-2 border rounded-md bg-black border-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-vertical"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={readOnly}
        ref={inputRef as React.Ref<HTMLInputElement>}
        className={`w-full px-3 py-2 border rounded-md bg-black border-blue-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 ${
          readOnly ? 'cursor-not-allowed' : ''
        }`}
      />
    )}
  </div>
);

export default InputField;
