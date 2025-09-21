'use client';

import { useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Mobilebar from './Mobilebar';
import LoadingScreen from '../LoadingScreen';
import { useWorkspaceLoading } from '@/hooks/useWorkspaceLoading';

export default function WorkspaceShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(true);

  const { loading } = useWorkspaceLoading();

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

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-dvh bg-dark text-white h-fit">
      <Topbar open={open} onToggleSidebar={() => setOpen(!open)} />
      <div className="flex">
        <Sidebar open={open} />
        <Mobilebar open={open} onToggleSidebar={() => setOpen(!open)} />
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
