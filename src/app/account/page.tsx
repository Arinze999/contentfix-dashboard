'use client';

import { useAppSelector } from '@/redux/store';
import React, { useEffect } from 'react';
import { useGetUserData } from '@/hooks/user/useGetUserData';
import SignOutButton from '@/components/buttons/SignOutButton';

const AccountPage = () => {
  const auth = useAppSelector((state) => state.auth);

  const userData = useAppSelector((state) => state.userData);

  const { loading, fetchUserData } = useGetUserData();

  useEffect(() => {
    if (auth?.id) fetchUserData(auth?.id);
  }, [auth?.id, fetchUserData]);

  return (
    <div>
      AccountPage <div>{auth.username}</div>
      <p>Hi {loading ? 'loading....' : userData.username}</p>
      <SignOutButton />
    </div>
  );
};

export default AccountPage;
