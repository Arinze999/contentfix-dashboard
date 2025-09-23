import React from 'react';

const Button = ({
  className,
  text,
  icon,
  left,
  disabled,
  onClick,
}: {
  className?: string;
  text: string;
  icon?: React.ReactNode;
  left?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      className={`${className} cursor-pointer flex gap-3 justify-center items-center text-sm md:text-md text-nowrap disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75`}
      disabled={disabled}
      onClick={onClick}
    >
      {left && icon && icon}
      {text}
      {!left && icon && icon}
    </button>
  );
};

export default Button;
