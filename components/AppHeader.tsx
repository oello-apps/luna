'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PWAInstallButton } from './PWAInstallButton';

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#ECE2E4] bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-8 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-zinc-900 whitespace-nowrap shrink-0"
        >
          Lune
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600"
        >
          <Link
            href="/"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              pathname === '/'
                ? 'text-[#D81B60] underline underline-offset-4'
                : 'hover:text-zinc-900'
            }`}
          >
            Cycle Setup
          </Link>
          <Link
            href="/results"
            className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
              pathname === '/results'
                ? 'text-[#D81B60] underline underline-offset-4'
                : 'hover:text-zinc-900'
            }`}
          >
            Results
          </Link>
        </nav>

        <div className="shrink-0">
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
}
