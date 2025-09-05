'use client';

import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';
import { useGetUserData } from '@/hooks/user/useGetUserData';
import Banner from '@/components/page/PageBanner';

const AccountPage = () => {
  const auth = useAppSelector((state) => state.auth);

  const userData = useAppSelector((state) => state.userData);

  const { loading, fetchUserData } = useGetUserData();

  useEffect(() => {
    if (auth?.id) fetchUserData(auth?.id);
  }, [auth?.id, fetchUserData]);

  return (
    <div className="default-margin h-[100rem] p-3">
      <Banner
        title="Overview"
        description="Take a look at what you and other users have been up to"
      />
      AccountPage <div>{}</div>
      <p>
        Hi{' '}
        {loading
          ? 'loading....'
          : auth?.username
          ? auth.username
          : userData.username}
      </p>
    </div>
  );
};

export default AccountPage;
