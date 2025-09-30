import Image from 'next/image';
import React from 'react';

interface IBanner {
  title: string;
  description: string;
  icon?: string;
}

const Banner: React.FC<IBanner> = ({ title, description, icon }) => {
  return (
    <section className="w-full border-2 p-3 rounded-xl bg-[#011129] border-lightBlue/10 py-3 mt-20 md:mt-10 flex gap-4 items-end-safe">
      <div className="w-[70px] min-w-[70px] md:w-[100px] h-[70px] md:h-[100px] overflow-hidden flex-center rounded-xl relative">
        <Image
          src={`/img/${icon}.png`}
          alt="profileImage"
          width={100}
          height={100}
        />
      </div>
      <div>
        <h2 className="text-[18px] md:text-[24px] font-semibold gradient8">
          {title}
        </h2>
        <div className="flex flex-col gap-2 w-full md:w-[30rem] text-[16px] md:text-[18px] text-lightBlue/50 font-normal">
          {description}
        </div>
      </div>
    </section>
  );
};

export default Banner;
