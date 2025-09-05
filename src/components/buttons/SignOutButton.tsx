'use client';

import { SIGN_OUT } from '@/routes/routes';
import { Logout } from '../icons/Logout';

export default function SignOutButton({
  text,
  open,
}: {
  text?: boolean;
  open: boolean;
}) {
  return (
    <form action={`/${SIGN_OUT}`} method="post">
      {text ? (
        <button
          type="submit"
          className={[
            // hide on mobile, match NavItem container styles on md+
            'hidden md:inline-flex cursor-pointer items-center gap-3 md:rounded-md py-2 text-sm md:text-[16px] transition-all whitespace-nowrap w-full hover:bg-muted font-bold',
            // color (keep your red)
            'text-red-600 hover:text-red-700',
            // collapse/expand padding/centering like NavItem
            open ? 'px-4' : 'md:justify-center',
          ].join(' ')}
        >
          {/* icon slot */}
          <span className="shrink-0">
            <Logout />
          </span>

          {/* collapse label when sidebar is closed on md+ */}
          <span
            className={[
              'truncate transition-all duration-200',
              open ? 'md:block md:max-w-[13rem]' : 'md:hidden md:max-w-0',
            ].join(' ')}
          >
            Log out
          </span>
        </button>
      ) : (
        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 text-sm md:text-[16px] cursor-pointer"
        >
          Sign out
        </button>
      )}
    </form>
  );
}
