// components/nav/NavItem.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type Variant = 'default' | 'green' | 'footer' | 'regular';

type NavItemProps = {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  variant?: Variant;
  /** Highlight on subroutes too (e.g., /account when on /account/history) */
  matchPrefix?: boolean;
  /** Controls label collapse in the sidebar */
  open: boolean;
};

function isPathActive(pathname: string, href: string, matchPrefix: boolean) {
  if (!matchPrefix) return pathname === href;
  if (pathname === href) return true;
  // Safer "section" match to avoid /accounting matching /account
  return pathname.startsWith(href.endsWith('/') ? href : `${href}/`);
}

export default function NavItem({
  href,
  children,
  icon,
  className = '',
  variant = 'default',
  matchPrefix = true,
  open,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = isPathActive(pathname, href, matchPrefix);

  const base =
    'inline-flex items-center gap-3 md:rounded-md  py-2 text-sm md:text-[16px] transition-all whitespace-nowrap w-full hover:bg-muted';
  const variantClasses: Record<Variant, string> = {
    default: 'text-lightBlue hover:text-white',
    green:
      'text-emerald-500 underline underline-offset-2 hover:text-emerald-400',
    footer: 'text-muted-foreground/80 hover:text-foreground',
    regular: 'text-indigo-400 hover:text-indigo-300',
  };

  const activeClasses = variant === 'default' ? 'md:bg-white/10 text-white' : '';

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={[
        base,
        variantClasses[variant],
        isActive ? activeClasses : '',
        open ? 'px-4' : 'md:justify-center',
        className,
      ].join(' ')}
      title={typeof children === 'string' ? children : undefined}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}

      {/* Collapse label when sidebar is closed on desktop */}
      <span
        className={[
          'truncate transition-all duration-200',
          open ? 'md:block md:max-w-[13rem]' : 'md:hidden md:max-w-0',
        ].join(' ')}
      >
        {children}
      </span>
    </Link>
  );
}

/* Optional inline/external links if you still use them elsewhere */
export function InlineLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'text-indigo-400 hover:text-indigo-300 transition-colors',
        className,
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

export function ExternalLink({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={[
        'text-indigo-400 hover:text-indigo-300 transition-colors',
        className,
      ].join(' ')}
    >
      {children}
    </a>
  );
}
