import Banner from '@/components/page/PageBanner';
import Feedback from '@/components/workspace/feedback/Feedback';
import Rating from '@/components/workspace/feedback/Rating';
import React from 'react';

const FeedbackPage = () => {
  return (
    <div className="default-margin">
      <Banner
        title="Feedback"
        description="Let us know what you think about CONTENTFIX"
        icon="feedback"
      />
      <div className="flex flex-col lg:flex-row gap-3 my-8">
        <Rating />
        <Feedback />
      </div>
    </div>
  );
};

export default FeedbackPage;
