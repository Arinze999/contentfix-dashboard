import CompanyLogo from '@/components/CompanyLogo';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-dark text-white h-screen">
      <div className="default-margin h-full relative col-center">
        <div className="absolute left-0 top-5">
          <CompanyLogo white/>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
