import Image from 'next/image';
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="default-margin h-screen overflow-hidden relative col-center gap-6">
      <Image
        src={'/img/contentfixlogowhite.png'}
        alt="logo"
        height={50}
        width={50}
        className="rounded-lg"
      />
      <div className="loader"></div>
    </div>
  );
};

export default LoadingScreen;
