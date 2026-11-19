import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Privacy Policy — Lune Cycle Tracker',
  description:
    'Privacy Policy explaining how Lune keeps menstrual cycle data strictly on your device.',
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        <article className="rounded-2xl border border-[#ECE2E4] bg-white p-6 sm:p-8 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              Privacy Policy
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Last updated: November 2026
            </p>
          </div>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Cycle data stays on your device
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              All period start dates, cycle length settings, and bleeding
              duration values you enter in Lune are stored exclusively in your
              browser&rsquo;s local storage on your own device. We do not
              transmit, collect, sell, or store your menstrual health data on
              external servers.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              No advertising trackers
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Lune does not run third-party advertising networks, behavioral
              tracking pixels, or cross-site analytics cookies.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Contact form submissions
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              If you choose to submit a message on our Contact Us page, the
              name, email address, subject, and message you enter are delivered
              via Resend solely so we can respond to your inquiry. Your local
              cycle data is never included in contact form submissions.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Deleting your data
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              You can erase all saved cycle data at any time by tapping{' '}
              <strong className="font-semibold text-zinc-900">
                Start over
              </strong>{' '}
              on the Results page or by clearing site data in your browser
              settings.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
