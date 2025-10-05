import Image from 'next/image';
import React from 'react';

const Feedback = () => {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden opacity-40">
      <Image
        src="/img/giphy.gif"
        alt="gif"
        fill
        className="object-cover"
        sizes="100vw"
        unoptimized // keep GIF animation smooth
      />
    </div>
  );
};

export default Feedback;
