'use client';
import React from 'react';
import StatsCard from './StatsCard';

const Stats = () => {
  return (
    <div className="bg-white/5 p-4 rounded-xl w-full md:w-fit">
      <h3 className="mb-5">Statistics</h3>
      <div className="grid grid-cols-2 gap-[2rem] md:gap-[3rem]  grid-flow-col overflow-auto [&::-webkit-scrollbar]:hidden">
        <StatsCard color="blue" />

        <StatsCard color="purple" />
      </div>
    </div>
  );
};

export default Stats;
