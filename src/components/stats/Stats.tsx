'use client';
import React from 'react';
import StatsCard from './StatsCard';
import { useAppSelector } from '@/redux/store';
import { calculateTimeAgo } from '@/utils/utils';

const Stats = () => {
  const posts = useAppSelector((state) => state.posts);

  const postsUpdatedAt = useAppSelector((s) => s.userData.posts_updated_at);

  console.log(postsUpdatedAt);

  return (
    <div className="bg-white/5 p-4 rounded-xl w-full md:w-fit">
      <h3 className="mb-5">Statistics</h3>
      <div className="grid grid-cols-2 gap-[2rem] md:gap-[3rem]  grid-flow-col overflow-auto [&::-webkit-scrollbar]:hidden">
        <StatsCard
          color="blue"
          title="Total Posts"
          info={(posts && posts.length) || 0}
        />

        <StatsCard
          color="purple"
          title="Last saved post"
          info={calculateTimeAgo(postsUpdatedAt ?? '')}
          date
        />
      </div>
    </div>
  );
};

export default Stats;
