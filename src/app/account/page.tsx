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
    <div className="bg-dark text-white">
      AccountPage <div>{}</div>
      <p>
        Hi{' '}
        {loading
          ? 'loading....'
          : auth?.username
          ? auth.username
          : userData.username}
      </p>
      <SignOutButton />
    </div>
  );
};

export default AccountPage;
