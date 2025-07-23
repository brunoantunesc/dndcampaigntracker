// src/components/ErrorMessage.tsx
import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/40 text-red-200 px-4 py-3 rounded max-w-md mx-auto text-center mt-8">
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
