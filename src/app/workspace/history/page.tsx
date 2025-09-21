'use client';

import HistoryCard from '@/components/cards/HistoryCard';
import Banner from '@/components/page/PageBanner';
import { useAppSelector } from '@/redux/store';
import React, { useEffect, useState } from 'react';

const HistoryPage = () => {
  const posts = useAppSelector((state) => state.posts);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 1200 : false
  );

  // state for card type 2 id transfer
  // const [id, setId] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // after your resize useEffect…
  // useEffect(() => {
  //   posts.length > 0 && setId(posts[0]?.id ?? '');
  // }, [posts]);

  console.log(posts);

  return (
    <div className="default-margin h-[100rem]">
      <Banner title="History" description="Here are you records so far" />
      <div>History</div>
      {posts.map((post) => (
        <HistoryCard isMobile={isMobile} key={post.id} {...posts} />
      ))}
    </div>
  );
};

export default HistoryPage;
