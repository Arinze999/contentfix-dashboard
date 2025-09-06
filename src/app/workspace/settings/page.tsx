import Banner from '@/components/page/PageBanner';
import React from 'react';

const page = () => {
  return (
    <div className="default-margin h-[100rem]">
      <Banner
        title="Settings"
        description="Customize your account and Preferences"
      />
      <div>Settings</div>
    </div>
  );
};

export default page;
