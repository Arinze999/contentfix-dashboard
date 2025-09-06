import Banner from '@/components/page/PageBanner';
import React from 'react';

const page = () => {
  return (
    <div className="default-margin h-[100rem]">
      <Banner title="History" description="Here are you records so far" />
      <div>History</div>
    </div>
  );
};

export default page;
