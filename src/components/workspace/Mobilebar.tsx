import { navConfig } from '../nav/navConfig';
import NavItem from './NavItem';
import { ACCOUNT } from '@/routes/routes';
import SignOutButton from '../buttons/SignOutButton';

export default function Mobilebar({
  open,
  onToggleSidebar
}: {
  open: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <aside
      className={`md:hidden flex flex-col gap-2 fixed top-14 left-0 w-full z-10
        bg-background py-4 shadow-lg bg-dark
        transition-transform duration-300 
        ${open ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <nav className="flex gap-2 flex-col">
        {navConfig.map((item) => (
          <NavItem
            key={item.href}
            open={open}
            href={item.href}
            matchPrefix={item.href !== `/${ACCOUNT}`}
            onClick={onToggleSidebar}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>

      <div className="px-4">
        <SignOutButton open />
      </div>
    </aside>
  );
}
