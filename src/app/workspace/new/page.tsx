import Banner from '@/components/page/PageBanner';
import React from 'react';

const page = () => {
  return (
    <div className="default-margin h-[100rem]">
      <Banner title="New Post" description="Create new post here" />
      <div>New posts</div>
    </div>
  );
};

export default page;
