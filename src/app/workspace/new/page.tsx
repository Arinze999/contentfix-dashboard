import NewContent from '@/components/newcontent/NewContent';
import Banner from '@/components/page/PageBanner';
import React from 'react';
import { SendPromptProvider } from '@/context/SendPromptContext';
import ResultScreen from '@/components/newcontent/ResultScreen';

const page = () => {
  return (
    <div className="default-margin h-[calc(100dvh-0.5rem)] md:h-[calc(100dvh-5rem)] overflow-hidden pb-55 relative">
      <Banner title="New Post" description="Create new post here" />
      <SendPromptProvider>
        <div className="relative w-full col-start h-[80%] md:h-[70%] my-3 shadow-xl">
          {/* Scrollable content */}
          <div className="h-full overflow-auto overflow-x-hidden no-scrollbar relative z-1">
            <ResultScreen />
          </div>

          {/* Top shadow */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/40 to-transparent z-2" />

          {/* Bottom shadow */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/40 to-transparent z-2" />
        </div>

        <NewContent />
      </SendPromptProvider>
    </div>
  );
};

export default page;
