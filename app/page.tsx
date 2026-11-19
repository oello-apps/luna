'use client';

import React, { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { AppHeader } from '@/components/AppHeader';
import { CycleSetupScreen } from '@/components/CycleSetupScreen';
import {
  DEFAULT_CYCLE_INPUT,
  loadStoredCycleInput,
  saveStoredCycleInput,
} from '@/lib/cycle-storage';
import { CycleInput } from '@/lib/cycle-engine';

const emptySubscribe = () => () => {};

export default function CycleSetupPage() {
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const initialInput = hydrated ? loadStoredCycleInput() : DEFAULT_CYCLE_INPUT;

  const handleSaveAndContinue = (payload: CycleInput) => {
    saveStoredCycleInput(payload);
    router.push('/results');
  };

  return (
    <div className="flex-1 bg-[#FDF8F9]">
      <AppHeader />
      <main className="mx-auto max-w-xl px-4 py-6 md:py-10">
        {!hydrated ? (
          <div className="h-[520px] animate-pulse rounded-2xl border border-[#ECE2E4] bg-white" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
          >
            <CycleSetupScreen
              initialDates={initialInput.periodDates}
              initialCycleLength={initialInput.statedCycleLength}
              initialBleedingLength={initialInput.bleedingLength}
              onSaveAndContinue={handleSaveAndContinue}
            />
          </motion.div>
        )}
      </main>
    </div>
  );
}
