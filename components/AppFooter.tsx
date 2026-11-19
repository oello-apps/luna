import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/terms', label: 'Terms of Use' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function AppFooter() {
  return (
    <footer className="border-t border-[#ECE2E4] bg-white/80 pt-6 pb-24 md:pb-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-4 text-center sm:flex-row sm:text-left sm:px-6">
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} Lune. Estimates only — stored
          locally on your device.
        </p>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600"
        >
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[#D81B60] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
