'use client';
import { useGetUserData } from '@/hooks/user/useGetUserData';
import { useAppSelector } from '@/redux/store';
import { ACCOUNT } from '@/routes/routes';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { ArrowRightSolid } from '../icons/ArrorRightSolid';
import Carousel from '../widgets/Carousel';
import '../widgets/carousel.css'; // <-- external styles
import { LoadingTwotoneLoop } from '../icons/LoadingLoop';
import Image from 'next/image';

const Welcome = () => {
  const auth = useAppSelector((state) => state.auth);
  const userData = useAppSelector((state) => state.userData);
  const { loading, fetchUserData } = useGetUserData();

  useEffect(() => {
    if (auth?.id) fetchUserData(auth?.id);
  }, [auth?.id, fetchUserData]);

  const postsCarousel: Record<string, string> = {
    one: 'Turn raw ideas into polished posts in seconds—paste → choose format → generate.',
    two: 'Create threads, LinkedIn posts, and newsletters from one place with a consistent voice.',
    three:
      'Use quick templates and a guest preview to draft fast, tweak faster, and publish confidently.',
    four: 'Track your conversions and pick up where you stopped—everything stays synced.',
    five: 'Thanks for signing up to ContentFix! You’re in—start your first conversion now.',
  };

  return (
    <div className="flex flex-col justify-between h-full md:gap-5 gap-4">
      <h1 className="text-5xl md:text-6xl text-center col-center md:gap-10 gradient1 font-bold">
        Welcome <br className="block md:hidden" /> to{' '}
        <br className="block md:hidden" /> ContentFix!
      </h1>

      <div className="col-center">
        <div className="border-2 w-[70px] md:w-[100px] h-[70px] md:h-[100px] border-blue-300/10 overflow-hidden flex-center rounded-xl relative">
          {loading && (
            <div className="absolute bg-black/70 w-full h-full flex-center">
              <LoadingTwotoneLoop />
            </div>
          )}
          <Image
            src={userData.avatar_url ?? '/img/user.png'}
            alt="profileImage"
            width={100}
            height={100}
          />
        </div>

        <span className="text-lightBlue general-subtitle">
          {loading ? '....' : auth.email?.toUpperCase()}
        </span>
      </div>

      <div className="w-full flex-center">
        <Link
          href={`/${ACCOUNT}`}
          className="flex-center rounded-lg gap-3 gradientBgBtn py-3 md:px-6 px-4 shadow-[0_0_10px_4px_rgba(139,92,246,0.1),0_0_20px_8px_rgba(139,92,246,0.2)] w-fit"
        >
          Create Posts <ArrowRightSolid />
        </Link>
      </div>

      <div className="w-full md:p-4 flex flex-wrap justify-center items-center gap-4">
        {/* Card with the carousel inside */}
        <div className="bg-blue-400/5 p-4 rounded-lg h-[15rem] md:h-[20rem] w-full md:w-[35rem] border-blue-300/20 border-2 relative">
          <Carousel items={postsCarousel} interval={4000} />
          <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-black/30 to-transparent z-10" />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
