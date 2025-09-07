import React from 'react';

interface IBanner {
  title: string;
  description: string;
}

const Banner: React.FC<IBanner> = ({ title, description }) => {
  return (
    <section className="w-full border-2 p-3 rounded-xl bg-[#011129] border-lightBlue/10 py-3 mt-10 sticky top-20 md:top-30 z-2">
      <h2 className="text-[18px] md:text-[24px] font-semibold text-gray-300">
        {title}
      </h2>
      <div className="flex flex-col gap-2 w-full md:w-[30rem] text-[16px] md:text-[18px] text-lightBlue/50 font-normal">
        {description}
      </div>
    </section>
  );
};

export default Banner;
