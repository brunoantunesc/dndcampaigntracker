// src/components/Form/FormWrapper.tsx
import React from 'react';

interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({ title, children, onSubmit }) => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      <form
        onSubmit={onSubmit}
        className="bg-gray-900 p-6 rounded-lg shadow-md border border-blue-500"
      >
        {children}
      </form>
    </div>
  );
};

export default FormWrapper;
