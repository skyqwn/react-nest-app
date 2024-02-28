import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
  onAction?: () => void;
}

const Button: React.FC<IButtonProps> = ({
  canClick,
  actionText,
  loading,
  onAction,
}) => {
  return (
    <button
      onClick={onAction}
      className={`text-lg mt-3 py-4 focus:outline-none text-white transition-colors ${
        canClick
          ? "bg-emerald-600 hover:bg-emerald-700 "
          : "bg-gray-300 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};

export default Button;
