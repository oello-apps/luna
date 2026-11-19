'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { DatePickerField } from './DatePickerField';
import { addDays, clamp, getTodayIso, isValidIsoDate } from '@/lib/cycle-engine';

interface CycleSetupScreenProps {
  initialDates: string[];
  initialCycleLength: number;
  initialBleedingLength: number;
  onSaveAndContinue: (payload: {
    periodDates: string[];
    statedCycleLength: number;
    bleedingLength: number;
  }) => void;
}

const MAX_DATES = 5;

export function CycleSetupScreen({
  initialDates,
  initialCycleLength,
  initialBleedingLength,
  onSaveAndContinue,
}: CycleSetupScreenProps) {
  const [dates, setDates] = useState<string[]>(() =>
    initialDates.length > 0 ? initialDates.slice(0, MAX_DATES) : ['', '']
  );
  const [cycleLength, setCycleLength] = useState<number>(initialCycleLength);
  const [cycleInputText, setCycleInputText] = useState<string>(
    String(initialCycleLength)
  );
  const [bleedingLength, setBleedingLength] = useState<number>(
    initialBleedingLength
  );
  const [bleedingInputText, setBleedingInputText] = useState<string>(
    String(initialBleedingLength)
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDateChange = (index: number, iso: string) => {
    setErrorMessage(null);
    setDates((prev) => prev.map((d, i) => (i === index ? iso : d)));
  };

  const handleAddDate = () => {
    if (dates.length >= MAX_DATES) return;
    setDates((prev) => [...prev, '']);
  };

  const handleRemoveDate = (index: number) => {
    if (dates.length <= 1) return;
    setDates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCycleSlider = (val: number) => {
    const safe = clamp(val, 21, 45);
    setCycleLength(safe);
    setCycleInputText(String(safe));
  };

  const handleCycleText = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    setCycleInputText(digits);
    const num = Number(digits);
    if (!Number.isNaN(num) && num >= 21 && num <= 45) {
      setCycleLength(num);
    }
  };

  const handleBleedingSlider = (val: number) => {
    const safe = clamp(val, 2, 10);
    setBleedingLength(safe);
    setBleedingInputText(String(safe));
  };

  const handleBleedingText = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    setBleedingInputText(digits);
    const num = Number(digits);
    if (!Number.isNaN(num) && num >= 2 && num <= 10) {
      setBleedingLength(num);
    }
  };

  const handleFillSample = () => {
    const today = getTodayIso();
    setErrorMessage(null);
    setDates([addDays(today, -64), addDays(today, -36), addDays(today, -8)]);
    setCycleLength(28);
    setCycleInputText('28');
    setBleedingLength(5);
    setBleedingInputText('5');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = Array.from(
      new Set(dates.filter((d) => isValidIsoDate(d)))
    ).sort();

    if (valid.length === 0) {
      setErrorMessage(
        'Please enter or pick at least 1 valid period start date.'
      );
      return;
    }

    onSaveAndContinue({
      periodDates: valid.slice(-MAX_DATES),
      statedCycleLength: clamp(cycleLength, 21, 45),
      bleedingLength: clamp(bleedingLength, 2, 10),
    });
  };

  const cyclePercent = ((cycleLength - 21) / (45 - 21)) * 100;
  const bleedingPercent = ((bleedingLength - 2) / (10 - 2)) * 100;

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#ECE2E4] bg-white p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight text-zinc-900">
              Your cycle
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
              Add 1 to 5 of your most recent period start dates. More dates make
              the prediction more accurate.
            </p>
          </div>
          <button
            type="button"
            onClick={handleFillSample}
            className="shrink-0 whitespace-nowrap text-xs font-medium text-[#D81B60] hover:underline"
          >
            Fill sample
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2.5 block text-sm font-semibold text-zinc-900">
            Last period start dates
          </label>

          <div className="space-y-2.5">
            {dates.map((iso, idx) => (
              <DatePickerField
                key={`date-row-${idx}`}
                valueIso={iso}
                onChangeIso={(nextIso) => handleDateChange(idx, nextIso)}
                onRemove={() => handleRemoveDate(idx)}
                canRemove={dates.length > 1}
                ariaLabel={`Period start date ${idx + 1}`}
              />
            ))}
          </div>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            {dates.length < MAX_DATES ? (
              <button
                type="button"
                onClick={handleAddDate}
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#FFF1F4] px-3 py-1.5 text-xs font-semibold text-[#D81B60] hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Add date ({dates.length}/{MAX_DATES})
              </button>
            ) : (
              <span className="text-xs font-medium text-zinc-500">
                Maximum 5 dates added
              </span>
            )}
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            Tip: use the first day of bleeding for each period, most recent
            last.
          </p>
        </div>

        {/* Cycle length */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="cycle-length-slider"
              className="text-sm font-semibold text-zinc-900"
            >
              Your cycle length:{' '}
              <span className="tabular-nums">{cycleLength} days</span>
            </label>
          </div>

          <input
            id="cycle-length-slider"
            type="range"
            min={21}
            max={45}
            value={cycleLength}
            onChange={(e) => handleCycleSlider(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #D81B60 0%, #D81B60 ${cyclePercent}%, #E2E8F0 ${cyclePercent}%, #E2E8F0 100%)`,
            }}
            className="lune-slider"
          />

          <div className="mt-3 flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={cycleInputText}
              onChange={(e) => handleCycleText(e.target.value)}
              onBlur={() => setCycleInputText(String(cycleLength))}
              aria-label="Cycle length days"
              className="h-11 w-16 shrink-0 rounded-xl border border-[#E5DADC] bg-white px-3 text-center text-sm font-semibold text-zinc-900 tabular-nums focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
            <p className="text-xs leading-relaxed text-zinc-500">
              Days from the first day of one period to the first day of the
              next. E.g. 26 or 27.
            </p>
          </div>
        </div>

        {/* Bleeding duration */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="bleeding-length-slider"
              className="text-sm font-semibold text-zinc-900"
            >
              Bleeding usually lasts:{' '}
              <span className="tabular-nums">{bleedingLength} days</span>
            </label>
          </div>

          <input
            id="bleeding-length-slider"
            type="range"
            min={2}
            max={10}
            value={bleedingLength}
            onChange={(e) => handleBleedingSlider(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #D81B60 0%, #D81B60 ${bleedingPercent}%, #E2E8F0 ${bleedingPercent}%, #E2E8F0 100%)`,
            }}
            className="lune-slider"
          />

          <div className="mt-3 flex items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={bleedingInputText}
              onChange={(e) => handleBleedingText(e.target.value)}
              onBlur={() => setBleedingInputText(String(bleedingLength))}
              aria-label="Bleeding duration days"
              className="h-11 w-16 shrink-0 rounded-xl border border-[#E5DADC] bg-white px-3 text-center text-sm font-semibold text-zinc-900 tabular-nums focus:border-[#D81B60] focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
            <p className="text-xs leading-relaxed text-zinc-500">
              Typical number of bleeding days per period (2 to 10 days).
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          className="mt-6 inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-[#D81B60] px-6 text-sm font-semibold text-white hover:bg-[#BE185D] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D81B60] focus-visible:ring-offset-2"
        >
          Save and see my predictions
        </button>
      </form>

      <p className="px-3 text-center text-[11px] leading-relaxed text-zinc-500">
        Estimates only — not medical advice, and not a method of contraception.
        Your data is stored only in this browser, on this device.
      </p>
    </div>
  );
}
