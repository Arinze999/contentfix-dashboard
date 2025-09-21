import React from 'react';

interface CloseIconProps {
  onClick?: () => void;
  fillColor?: string;
  strokeColor?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  onClick,
  fillColor = 'black',
  strokeColor = '#bae8fa',
}) => {
  return (
    <svg
      onClick={onClick}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="12" fill={fillColor} />
      <path
        d="M16 8L8 16M8 8L16 16"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
