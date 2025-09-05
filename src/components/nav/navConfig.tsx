import { ACCOUNT, HISTORY, NEW_CONVERSION, SETTINGS } from '@/routes/routes';
import { Dashboard } from '../icons/Dashboard';
import type { ReactNode } from 'react';
import { New } from '../icons/New';
import { HistoryAlt } from '../icons/HistoryAlt';
import { Settings } from '../icons/Settings';

interface INavConfig {
  label: string;
  href: string;
  icon: ReactNode;
}

export const navConfig: INavConfig[] = [
  { label: 'Overview', href: `/${ACCOUNT}`, icon: <Dashboard /> },
  {
    label: 'New Post',
    href: `/${ACCOUNT}/${NEW_CONVERSION}`,
    icon: <New />,
  },
  { label: 'History', href: `/${ACCOUNT}/${HISTORY}`, icon: <HistoryAlt /> },
  { label: 'Settings', href: `/${ACCOUNT}/${SETTINGS}`, icon: <Settings /> },
];
