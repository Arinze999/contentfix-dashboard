'use client';
import React from 'react';

type Color = 'blue' | 'red' | 'green' | 'purple'; 

export default function StatsCard({ color }: { color: Color }) {
  const colorMap: Record<Color, string> = {
    blue: 'bg-blue-900/10 border-blue-300/50',
    red: 'bg-red-400/10 border-red-300/50',
    green: 'bg-green-400/10 border-green-300/50',
    purple: 'bg-purple-400/10 border-purple-300/50',
  };

  return (
    <div
      className={`col-between overflow-hidden p-1 md:p-4 rounded-lg h-[5rem] md:h-[10rem] w-[10rem] md:w-[20rem] border-2 ${colorMap[color]}`}
    >
      <p>Total Posts</p>
      <p className="text-4xl md:text-6xl font-bold">10</p>
    </div>
  );
}
