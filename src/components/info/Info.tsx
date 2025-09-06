import React from 'react';
import { InfoIcon } from '../icons/Info';

type Color = 'blue' | 'red' | 'green' | 'purple';

const Info = ({ color }: { color: Color }) => {
  const colorMap: Record<Color, string> = {
    blue: 'bg-blue-200/50 text-blue-900',
    red: 'bg-red-200/50 text-red-900',
    green: 'bg-green-200/50 text-green-900',
    purple: 'bg-purple-200/50 text-purple-900',
  };

  return (
    <div
      className={`flex gap-2 h-fit overflow-hidden p-1 md:p-4 flex-1 max-w-[30rem] ${colorMap[color]}`}
    >
      <h3 className="font-bold flex gap-1">
        <InfoIcon />
      </h3>
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora fugiat
        cum error minus ipsa ullam expedita repellendus, nisi adipisci ipsam
        harum deleniti nulla natus similique asperiores consequatur quis
        voluptas dolore.
      </p>
    </div>
  );
};

export default Info;
