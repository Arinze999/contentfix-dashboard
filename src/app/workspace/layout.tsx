// app/workspace/layout.tsx
import type { ReactNode } from 'react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  // Server component wrapper; keeps /workspace isolated from your root layout
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
