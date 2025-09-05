// components/workspace/WorkspaceShell.tsx
'use client';

import { useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Mobilebar from './Mobilebar';

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      }
    };

    handleResize(); // run once on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-dvh bg-dark text-white">
      <Topbar open={open} onToggleSidebar={() => setOpen(!open)} />
      <div className="flex">
        <Sidebar open={open} />
        <Mobilebar open={open} />
        <main
          className={`flex-1 transition-[margin] duration-200 
            ${open ? 'md:ml-56' : 'md:ml-16'}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
