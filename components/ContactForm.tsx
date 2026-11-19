'use client';

import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMessage('Please write a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };
      if (!res.ok) {
        setErrorMessage(
          data.error || 'Could not send your message. Please try again.'
        );
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMessage(
        'Network error while sending your message. Check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-teal-200 bg-[#ECFDF5] p-5 text-center">
        <CheckCircle2 className="mx-auto h-7 w-7 text-teal-600" />
        <h2 className="mt-2.5 font-display text-base font-bold text-zinc-900">
          Message sent
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Thank you for reaching out. We have received your message and will
          reply by email soon.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-xs font-semibold text-zinc-800 border border-teal-200 hover:bg-teal-50 transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-semibold text-zinc-800"
          >
            Your name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="h-11 w-full rounded-xl border border-[#E5DADC] bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-semibold text-zinc-800"
          >
            Email address
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-[#E5DADC] bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-xs font-semibold text-zinc-800"
        >
          Subject (optional)
        </label>
        <input
          id="contact-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Feedback, bug report, or question"
          className="h-11 w-full rounded-xl border border-[#E5DADC] bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-semibold text-zinc-800"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="w-full rounded-xl border border-[#E5DADC] bg-white p-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
        />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
        >
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#D81B60] px-6 text-sm font-semibold text-white hover:bg-[#BE185D] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0"
      >
        <Send className="h-4 w-4" />
        <span>{submitting ? 'Sending...' : 'Send message'}</span>
      </button>
    </form>
  );
}
