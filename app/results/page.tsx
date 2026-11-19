'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { Calendar } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { CycleResultsScreen } from '@/components/CycleResultsScreen';
import {
  DEFAULT_CYCLE_INPUT,
  clearStoredCycleInput,
  loadStoredCycleInput,
  saveStoredCycleInput,
} from '@/lib/cycle-storage';
import { CycleInput, isValidIsoDate } from '@/lib/cycle-engine';

const emptySubscribe = () => () => {};

export default function ResultsPage() {
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
        {!hydrated ? (
          <div className="h-[620px] animate-pulse rounded-2xl border border-[#ECE2E4] bg-white" />
        ) : (
          <ResultsContent />
        )}
      </main>
    </div>
  );
}

function ResultsContent() {
  const router = useRouter();
  const [cycleInput, setCycleInput] = useState<CycleInput>(() =>
    loadStoredCycleInput()
  );

  const hasValidDate = cycleInput.periodDates.some((d) => isValidIsoDate(d));

  if (!hasValidDate) {
    return (
      <div className="rounded-2xl border border-[#ECE2E4] bg-white p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1F4] text-[#D81B60]">
          <Calendar className="h-5 w-5" />
        </div>
        <h1 className="mt-4 font-display text-lg font-bold text-zinc-900">
          No cycle dates saved yet
        </h1>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-zinc-600">
          Add at least one recent period start date to generate your ovulation,
          fertile window, PMS window, and calendar predictions.
        </p>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#D81B60] px-5 text-sm font-semibold text-white hover:bg-[#BE185D] transition-colors"
        >
          Go to Cycle Setup
        </button>
      </div>
    );
  }

  const handleLogNewPeriod = (isoDate: string) => {
    const validExisting = cycleInput.periodDates.filter((d) =>
      isValidIsoDate(d)
    );
    const merged = Array.from(new Set([...validExisting, isoDate]))
      .sort()
      .slice(-5);
    const updated: CycleInput = {
      ...cycleInput,
      periodDates: merged,
    };
    setCycleInput(updated);
    saveStoredCycleInput(updated);
  };

  const handleStartOver = () => {
    clearStoredCycleInput();
    setCycleInput(DEFAULT_CYCLE_INPUT);
    router.push('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16 }}
    >
      <CycleResultsScreen
        cycleInput={cycleInput}
        onEditSetup={() => router.push('/')}
        onLogNewPeriod={handleLogNewPeriod}
        onStartOver={handleStartOver}
      />
    </motion.div>
  );
}
