// components/SignOutButton.tsx
'use client';

import { SIGN_OUT } from '@/routes/routes';

export default function SignOutButton() {
  return (
    <form action={`/${SIGN_OUT}`} method="post">
      <button
        type="submit"
        className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        Sign out
      </button>
    </form>
  );
}
