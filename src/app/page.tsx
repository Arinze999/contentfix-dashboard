import SignOutButton from '@/components/buttons/SignOutButton';
import { SIGN_IN, SIGN_UP } from '@/routes/routes';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      content fix dashboard <br />
      <div className="mt-20 flex gap-10">
        {' '}
        <Link href={`/${SIGN_IN}`}>sign in</Link>
        <Link href={`/${SIGN_UP}`}>sign up</Link>
      </div>
      <SignOutButton />
    </div>
  );
}
