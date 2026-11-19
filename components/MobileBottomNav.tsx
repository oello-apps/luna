'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, SlidersHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const isSetup = pathname === '/';
  const isResults = pathname === '/results';

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-3 left-4 right-4 z-40 mx-auto max-w-sm md:hidden"
    >
      <div className="grid grid-cols-2 gap-1 rounded-2xl border border-[#ECE2E4] bg-white/90 p-1.5 shadow-lg shadow-rose-950/10 backdrop-blur-md">
        <Link
          href="/"
          className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors whitespace-nowrap shrink-0 ${
            isSetup
              ? 'bg-[#FFF1F4] font-semibold text-[#D81B60]'
              : 'font-medium text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4 shrink-0" />
          <span>Cycle Setup</span>
        </Link>

        <Link
          href="/results"
          className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs transition-colors whitespace-nowrap shrink-0 ${
            isResults
              ? 'bg-[#FFF1F4] font-semibold text-[#D81B60]'
              : 'font-medium text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span>Results</span>
        </Link>
      </div>
    </nav>
  );
}
