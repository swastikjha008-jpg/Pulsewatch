'use client';

import type { ReactNode } from 'react';

interface StartMonitoringButtonProps {
  className?: string;
  children?: ReactNode;
}

// Where the dashboard app (apps/dashboard) lives — override in .env.local
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://pulsewatch-dashboard.vercel.app';

export default function StartMonitoringButton({
  className = '',
  children = 'Start Monitoring',
}: StartMonitoringButtonProps) {
  return (
    <a href={APP_URL} className={className}>
      {children}
    </a>
  );
}
