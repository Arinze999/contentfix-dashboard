'use client';
import React from 'react';
import StatsCard from './StatsCard';
import { useAppSelector } from '@/redux/store';
import { selectTotalStatistics } from '@/redux/slices/statisticsSlice';

const Stats = () => {
  const posts = useAppSelector((state) => state.posts);

  const total = useAppSelector(selectTotalStatistics);

  return (
    <div className="bg-white/5 p-4 rounded-xl w-full md:w-fit">
      <h3 className="mb-5">Statistics</h3>
      <div className="grid grid-cols-2 gap-[2rem] md:gap-[3rem]  grid-flow-col overflow-auto [&::-webkit-scrollbar]:hidden">
        <StatsCard
          color="blue"
          title="Your Posts"
          info={(posts && posts.length) || 0}
        />

        <StatsCard color="purple" title="Posts: all Users" info={total} />
      </div>
    </div>
  );
};

export default Stats;
