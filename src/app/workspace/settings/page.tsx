'use client';

import Banner from '@/components/page/PageBanner';
import AccountSettings from '@/components/workspace/settings/AccountSettings';
import PostSettings from '@/components/workspace/settings/PostSettings';
import { useAppSelector } from '@/redux/store';
import React from 'react';

const SettingsPage = () => {
  const user = useAppSelector((state) => state.userData);

  console.log(user);

  return (
    <div className="default-margin">
      <Banner
        title="Settings"
        description="Customize your account and Preferences"
        icon="settings"
      />
      <div className="flex flex-col lg:flex-row gap-3 my-8">
        <AccountSettings />
        <PostSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
