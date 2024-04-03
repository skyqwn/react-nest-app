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
      className={`text-lg mt-2 py-2 size-20 focus:outline-none rounded-xl text-white transition-colors ${
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
