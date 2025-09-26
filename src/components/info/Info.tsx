import React from 'react';
import { InfoIcon } from '../icons/Info';

type Color = 'blue' | 'red' | 'green' | 'purple';

const Info = ({ color, text }: { color: Color; text: string }) => {
  const colorMap: Record<Color, string> = {
    blue: 'bg-blue-200/90 text-blue-900',
    red: 'bg-red-200/90 text-red-900',
    green: 'bg-green-200/90 text-green-900',
    purple: 'bg-purple-200/90 text-purple-900',
  };

  return (
    <div
      className={`flex gap-2 h-fit overflow-hidden p-1 md:p-4 flex-1 max-w-[30rem] ${colorMap[color]}`}
    >
      <h3 className="font-bold flex gap-1">
        <InfoIcon />
      </h3>
      <p className="text-sm">{text}</p>
    </div>
  );
};

export default Info;
