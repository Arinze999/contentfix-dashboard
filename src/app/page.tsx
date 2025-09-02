import SignOutButton from '@/components/buttons/SignOutButton';
import CompanyLogo from '@/components/CompanyLogo';
import { ArrowRightSolid } from '@/components/icons/ArrorRightSolid';
import Welcome from '@/components/welcome/Welcome';
import { ACCOUNT } from '@/routes/routes';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#041C4D] text-white">
      <div className="default-margin h-full relative col-center">
        <div className="sticky left-0 top-0 py-5 w-full flex-between bg-[#041C4D]">
          <CompanyLogo white />
          <SignOutButton />
        </div>

        <div className="md:mt-20 mt-5">
          <Welcome />
        </div>

        <div className="md:mt-20 mt-5 underline">
          <Link href={`/${ACCOUNT}`} className='flex-center gap-3'>
            Create Posts <ArrowRightSolid />
          </Link>
        </div>
      </div>
    </div>
  );
}
