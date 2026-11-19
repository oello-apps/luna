'use client';

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-medium text-amber-900 shadow-md md:bottom-4"
    >
      <WifiOff className="h-3.5 w-3.5 shrink-0 text-amber-700" />
      <span>Offline mode — cached app and local cycle data active</span>
    </div>
  );
}
