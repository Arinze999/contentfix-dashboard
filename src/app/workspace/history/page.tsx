'use client';

import HistoryCard from '@/components/cards/HistoryCard';
import Banner from '@/components/page/PageBanner';
import { useAppSelector } from '@/redux/store';
import { PostItem } from '@/types/social';
import React, { useEffect, useState } from 'react';

const HistoryPage = () => {
  const posts = useAppSelector((state) => state.posts);

  const [id, setId] = useState('');

  const [post, setPost] = useState<PostItem | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 1200 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPost(posts.find((p) => p.id === id) ?? null);
  }, [id, post, posts]);

  console.log(post);

  return (
    <div className="default-margin h-[100rem]">
      <Banner title="History" description="Here are you records so far" />
      <ul className="col-start gap-4 my-4">
        {' '}
        {posts.map((post) => (
          <HistoryCard
            isMobile={isMobile}
            key={post.id}
            {...post}
            clickedIdAction={() => setId(post.id ?? '')}
          />
        ))}
      </ul>
    </div>
  );
};

export default HistoryPage;
