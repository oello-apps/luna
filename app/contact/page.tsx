import type { Metadata } from 'next';
import { AppHeader } from '@/components/AppHeader';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us — Lune Cycle Tracker',
  description:
    'Send feedback, questions, or bug reports to the Lune Cycle Tracker team.',
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        <div className="rounded-2xl border border-[#ECE2E4] bg-white p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              Contact Us
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
              Have a question, feature suggestion, or spotted an issue? Send us
              a message below and we will get back to you by email.
            </p>
          </div>

          <ContactForm />
        </div>
      </main>
    </div>
  );
}
