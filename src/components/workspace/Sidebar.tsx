import NavItem from './NavItem';
import { ACCOUNT } from '@/routes/routes';
import { navConfig } from '../nav/navConfig';
import SignOutButton from '../buttons/SignOutButton';

export default function Sidebar({ open }: { open: boolean }) {
  return (
    <aside
      className={`hidden overflow-y-scroll no-scrollbar md:flex flex-col gap-[30%] fixed top-14 md:top-20 left-0 h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-5rem)]
        border-r border-lightBlue/10 bg- transition-all duration-200
        ${open ? 'w-56' : 'w-16'}`}
    >
      <nav className="p-3 pt-10 flex flex-col gap-6 xl:gap-10">
        {navConfig.map((item) => (
          <NavItem
            key={item.href}
            open={open}
            href={item.href}
            matchPrefix={item.href !== `/${ACCOUNT}`}
            icon={item.icon}
          >
            {item.label}
          </NavItem>
        ))}
      </nav>

      <div className="p-3 flex flex-col">
        <SignOutButton text open={open} />
      </div>
    </aside>
  );
}
