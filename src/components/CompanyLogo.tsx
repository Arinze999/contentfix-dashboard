import Image from 'next/image';
import Link from 'next/link';

const CompanyLogo = ({
  textClass,
  close,
  white,
  blue,
}: {
  textClass?: string;
  close?: () => void;
  white?: boolean;
  blue?: boolean;
}) => {
  return (
    <Link href={'/'}>
      <h3
        className={`font-[900] text-myPurple text-[24px] flex items-end gap-0 relative  ${textClass}`}
        onClick={close}
      >
        {white ? (
          <Image
            src={'/img/contentfixlogowhite.png'}
            alt="logo"
            height={50}
            width={50}
            className=" mr-3 rounded-lg"
          />
        ) : blue ? (
          <Image
            src={'/img/contentfixlogoblue.png'}
            alt="logo"
            height={50}
            width={50}
            className=" mr-3 rounded-lg"
          />
        ) : (
          <Image
            src={'/img/contentfixlogo.png'}
            alt="logo"
            height={50}
            width={50}
            className="shadow-[0_0_5px_2px_rgba(139,92,246,0.1),0_0_10px_4px_rgba(139,92,246,0.1)] mr-3 rounded-lg"
          />
        )}

        <span className="hidden md:flex">ContentFix</span>
      </h3>
    </Link>
  );
};

export default CompanyLogo;
