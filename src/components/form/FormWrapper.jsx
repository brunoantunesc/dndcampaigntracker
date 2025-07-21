// src/components/Form/FormWrapper.jsx
import React from 'react';

const FormWrapper = ({ title, children, onSubmit }) => {
  return (
    <div className="p-6 max-w-xl mx-auto">
      {title && <h1 className="text-2xl font-bold mb-4">{title}</h1>}
      <form onSubmit={onSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md border border-blue-500">
        {children}
      </form>
    </div>
  );
};

export default FormWrapper;
