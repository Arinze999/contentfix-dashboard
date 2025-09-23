'use client';

import HistoryCard from '@/components/cards/HistoryCard';
import Banner from '@/components/page/PageBanner';
import Info from '@/components/workspace/history/Info';
import { useAppSelector } from '@/redux/store';
import { ACCOUNT } from '@/routes/routes';
import { PostItem } from '@/types/social';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HistoryPage = () => {
  const posts = useAppSelector((state) => state.posts);

  const [id, setId] = useState('');

  const [post, setPost] = useState<PostItem | null>(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 480 : false
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
    if (id !== '') {
      setPost(posts.find((p) => p.id === id) ?? null);
    } else {
      setId(posts[0]?.id ?? '');
    }
  }, [id, post, posts]);

  return (
    <div className="default-margin">
      <Banner title="History" description="Here are your enhanced posts so far" />
      {posts ? (
        <div className="flex gap-4 my-4 h-full">
          <ul className={`col-start gap-4 ${isMobile ? 'w-full' : ''}`}>
            {' '}
            {posts.map((post) => (
              <HistoryCard
                isMobile={isMobile}
                key={post.id}
                {...post}
                clickedIdAction={() => setId(post.id ?? '')}
                isActive={post.id === id}
              />
            ))}
          </ul>
          <Info id={id} isMobile={isMobile} />
        </div>
      ) : (
        <p className="flex gap-4 my-4">
          You not saved any posts, yet. You can do so by visiting{' '}
          <Link href={`/${ACCOUNT}`} className="underline text-purple-500">
            New Post
          </Link>
        </p>
      )}
    </div>
  );
};

export default HistoryPage;
