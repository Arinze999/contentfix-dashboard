import CompanyLogo from '../CompanyLogo';
import { Close } from '../icons/Close';
import { Menu } from '../icons/Menu';

type Props = {
  open: boolean;
  onToggleSidebar: () => void;
};

export default function Topbar({ open, onToggleSidebar }: Props) {
  return (
    <header className="sticky top-0 z-40 flex md:flex-row flex-row-reverse md:justify-start justify-between w-full h-14 md:h-20 items-center border-b border-lightBlue/10 bg-dark backdrop-blur">
      <button
        onClick={onToggleSidebar}
        className="px-4 py-2 text-sm hover:opacity-80"
        aria-label="Toggle navigation"
      >
        {open ? <Close /> : <Menu />}
      </button>

      <div className="ml-2 text-sm font-medium">
        <CompanyLogo white />
      </div>
    </header>
  );
}
