'use client';
import { useGetUserData } from '@/hooks/user/useGetUserData';
import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';

const Welcome = () => {
  const auth = useAppSelector((state) => state.auth);

  const userData = useAppSelector((state) => state.userData);

  const { loading, fetchUserData } = useGetUserData();

  useEffect(() => {
    if (auth?.id) fetchUserData(auth?.id);
  }, [auth?.id, fetchUserData]);

  return (
    <div className="col-center md:gap-5 gap-4">
      <h1 className="general-title col-center md:gap-10">
        Welcome to ContentFix! <br />
        <span className="text-lightBlue">
          {' '}
          {loading
            ? 'loading....'
            : auth?.username?.toUpperCase()
            ? auth.username?.toUpperCase()
            : userData.username?.toUpperCase()}
        </span>
      </h1>

      <div className="w-full md:p-4 flex flex-wrap justify-center items-center gap-4">
        <div className="bg-blue-400/10 p-4 rounded-lg h-[10rem] w-full md:w-[25rem] border-blue-300/50 border-2">
          <p>Total Posts</p>
        </div>

        <div className="bg-green-400/10 p-4 rounded-lg h-[10rem] w-full md:w-[25rem] border-green-300/50 border-2">
          <p>Total Posts</p>
        </div>

        <div className="bg-purple-400/10 p-4 rounded-lg h-[10rem] w-full md:w-[25rem] border-purple-300/50 border-2">
          <p>Total Posts</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
