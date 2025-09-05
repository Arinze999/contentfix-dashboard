import React from 'react';

interface IBanner {
  title: string;
  description: string;
}

const Banner: React.FC<IBanner> = ({ title, description }) => {
  return (
    <section className="w-full border-b border-lightBlue/10 py-3">
      <h2 className="text-[18px] md:text-[24px] font-semibold text-gray-300">
        {title}
      </h2>
      <div className="flex flex-col gap-2 w-full md:w-[30rem] text-[16px] md:text-[18px] text-gray-300 font-normal">
        {description}
      </div>
    </section>
  );
};

export default Banner;
