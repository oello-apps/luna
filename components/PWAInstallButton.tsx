'use client';

import React, { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuide(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#D81B60] px-3.5 text-xs font-semibold text-white hover:bg-[#BE185D] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D81B60] focus-visible:ring-offset-2"
      >
        <Download className="h-3.5 w-3.5 shrink-0" />
        <span>{isIOS ? 'Install on iOS' : 'Install App'}</span>
      </button>

      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px] p-4"
          onClick={() => setShowGuide(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Install Lune Cycle Tracker"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-[#ECE2E4] bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-zinc-900">
                {isIOS ? 'Install on iPhone or iPad' : 'Install Lune App'}
              </h3>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Close install instructions"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="mt-3 space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-900">1.</span>
                  <span>
                    Tap the{' '}
                    <strong className="inline-flex items-center gap-1 font-semibold text-zinc-900">
                      Share <Share className="h-3.5 w-3.5" />
                    </strong>{' '}
                    button in the Safari toolbar.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-900">2.</span>
                  <span>
                    Scroll down and tap{' '}
                    <strong className="font-semibold text-zinc-900">
                      Add to Home Screen
                    </strong>
                    .
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-zinc-900">3.</span>
                  <span>
                    Tap <strong className="font-semibold text-zinc-900">Add</strong>{' '}
                    to launch Lune offline anytime.
                  </span>
                </li>
              </ol>
            ) : (
              <div className="mt-3 space-y-2 text-sm text-zinc-600">
                <p>
                  To install Lune on your home screen or desktop for offline
                  access:
                </p>
                <ol className="space-y-1.5 pl-4 list-decimal">
                  <li>
                    Open this site directly in a browser tab (Chrome, Edge, or
                    Android Chrome).
                  </li>
                  <li>
                    Tap the browser{' '}
                    <strong className="font-semibold text-zinc-900">
                      Install
                    </strong>{' '}
                    icon in the address bar or menu (<strong className="font-semibold text-zinc-900">Add to Home screen</strong>).
                  </li>
                </ol>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 h-10 w-full rounded-xl bg-[#FFF1F4] text-xs font-semibold text-[#D81B60] hover:bg-rose-100 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
