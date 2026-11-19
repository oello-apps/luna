import type { Metadata } from 'next';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'About Us — Lune Cycle Tracker',
  description:
    'Learn how Lune provides transparent, private, on-device menstrual cycle and ovulation estimates.',
};

export default function AboutPage() {
  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        <article className="rounded-2xl border border-[#ECE2E4] bg-white p-6 sm:p-8 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              About Lune
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              Calm, private, and transparent cycle estimation built around your
              own history.
            </p>
          </div>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Why we built Lune
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Most cycle trackers require creating an account, uploading
              sensitive health history to remote servers, or navigating
              cluttered feeds before seeing a simple date estimate. Lune focuses
              on clarity: enter up to five recent period start dates, set your
              typical cycle and bleeding length, and immediately view your
              upcoming period, ovulation day, fertile window, and PMS window.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Transparent prediction math
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              When you provide two or more period start dates, Lune calculates
              your observed cycle intervals and blends them at 65% real history
              plus 35% stated cycle length. Every estimate on the Results screen
              explains exactly how the dates were derived so nothing feels like
              a black box.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              On-device by design
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Your cycle dates stay strictly inside your browser on your own
              device. Lune works offline as an installable Progressive Web App
              and never sells or shares your cycle history.
            </p>
          </section>

          <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-5">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#D81B60] px-5 text-xs font-semibold text-white hover:bg-[#BE185D] transition-colors"
            >
              Go to Cycle Setup
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FFF1F4] px-5 text-xs font-semibold text-[#9D174D] hover:bg-rose-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
