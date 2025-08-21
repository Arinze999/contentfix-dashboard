'use client'

import { useAppSelector } from '@/redux/store';
import React from 'react';

const AccountPage = () => {
  const auth = useAppSelector((state) => state.auth);

  return (
    <div>
      AccountPage <div>{auth.username}</div>
    </div>
  );
};

export default AccountPage;
