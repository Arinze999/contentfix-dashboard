import { SIGN_IN } from '@/routes/routes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const EmailVerified = () => {
  return (
    <div className="col-center">
      <h3 className="text-lg">Your email has been verified</h3>
      <Image src={'/img/success.png'} alt="success" width={64} height={64} />
      <p>
        Go to{' '}
        <Link className="text-blue-300 underline" href={`/${SIGN_IN}`}>
          {' '}
          Login Page
        </Link>
      </p>
    </div>
  );
};

export default EmailVerified;
