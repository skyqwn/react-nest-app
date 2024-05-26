import React from "react";

interface IButtonProps {
  canClick?: boolean;
  onAction?: () => void;
  actionText: string;
  loading?: boolean;
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
      className={`className="bg-orange-500 p-2 text-sm md:text-lg rounded-full text-white font-semibold" ${
        canClick
          ? "bg-orange-600 hover:bg-orange-800 "
          : "bg-orange-800 pointer-events-none"
      }`}
    >
      {loading ? "Loading..." : actionText}
    </button>
  );
};

export default Button;
