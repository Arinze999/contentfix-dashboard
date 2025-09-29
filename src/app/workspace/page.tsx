'use client';

import React from 'react';
import Banner from '@/components/page/PageBanner';
import Stats from '@/components/stats/Stats';
import Info from '@/components/info/Info';
import SocialUsageChart from '@/components/charts/SocialUsageChart';

const WorkspacePage = () => {
  // const auth = useAppSelector((state) => state.auth);

  // const userData = useAppSelector((state) => state.userData);

  // const { loading, fetchUserData } = useGetUserData();

  // useEffect(() => {
  //   if (auth?.id) fetchUserData(auth?.id);
  // }, [auth?.id, fetchUserData]);

  return (
    <div className="default-margin mb-8 col-start gap-10">
      <Banner
        title="Overview"
        description="Take a look at what you and other users have been up to"
        icon='overview'
      />
      <div className="flex flex-col min-[1200px]:flex-row gap-6">
        <Stats />
        <Info
          color="green"
          text=" Contentfix is powered by Deepseeks R1 0538 free AI API, so there might
        be a few down times. Please come back later and try again if that
        happens. Thank you for trying out CONTENTFIX!"
        />
      </div>
      <SocialUsageChart />
    </div>
  );
};

export default WorkspacePage;
