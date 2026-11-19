import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';

export const metadata: Metadata = {
  title: 'Medical Disclaimer — Lune Cycle Tracker',
  description:
    'Important health and medical disclaimer for Lune Cycle Tracker cycle and fertility estimates.',
};

export default function DisclaimerPage() {
  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        <article className="rounded-2xl border border-[#ECE2E4] bg-white p-6 sm:p-8 space-y-5">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              Disclaimer
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Last updated: November 2026
            </p>
          </div>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Not medical advice
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Lune provides calendar-based cycle, ovulation, fertile window, and
              PMS estimates for general informational and personal planning
              purposes only. Nothing displayed in this application constitutes
              medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Not a method of contraception
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              Do not rely on Lune to prevent pregnancy or to time conception
              without clinical guidance. Individual ovulation and menstrual
              cycles vary naturally from cycle to cycle due to stress, illness,
              sleep, medication, hormonal changes, and other biological factors.
            </p>
          </section>

          <section className="space-y-2.5 border-t border-zinc-100 pt-5">
            <h2 className="font-display text-base font-bold text-zinc-900">
              Consult a healthcare professional
            </h2>
            <p className="text-sm leading-relaxed text-zinc-600">
              If you experience missed periods, unusually heavy bleeding,
              severe pain, sudden cycle irregularity, or any health concern,
              please consult a qualified physician or licensed healthcare
              provider.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
