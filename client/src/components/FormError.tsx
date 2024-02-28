import React from "react";

interface IFormErrorProps {
  errorMessage: string | undefined;
}

const FormError: React.FC<IFormErrorProps> = ({ errorMessage }) => {
  return <span className="font-medium text-red-500">{errorMessage}</span>;
};

export default FormError;
