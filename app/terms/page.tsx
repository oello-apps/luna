import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Terms of Use — Lune Cycle Tracker',
  description:
    'Terms of Use governing access to and use of the Lune Cycle Tracker Progressive Web App.',
};

export default function TermsPage() {
  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        <article className="rounded-2xl border border-[#ECE2E4] bg-white p-6 sm:p-8 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              Terms of Use
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Last updated: November 2026
            </p>
          </div>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              1. Acceptance of terms
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              By accessing or installing Lune, you agree to use the application
              solely for lawful, personal, non-commercial informational
              purposes in accordance with these Terms of Use.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              2. Informational estimates only
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              All cycle predictions, ovulation dates, fertile windows, and PMS
              windows are mathematical estimates generated from the dates and
              averages you enter. Lune makes no warranty regarding biological
              accuracy or suitability for medical or contraceptive decisions.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              3. Local data responsibility
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Because Lune stores your cycle entries locally in your browser
              without a remote account, clearing browser site data or using
              private browsing sessions may permanently erase your saved dates.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              4. Limitation of liability
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Lune is provided &ldquo;as is&rdquo; without warranties of any
              kind. To the fullest extent permitted by law, the creators of Lune
              shall not be liable for any direct, indirect, or incidental
              damages resulting from reliance on cycle estimates or loss of
              locally stored browser data.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
