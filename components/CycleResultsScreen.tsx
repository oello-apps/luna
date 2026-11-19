'use client';

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  Egg,
  Heart,
  Info,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { DatePickerField } from './DatePickerField';
import {
  CycleInput,
  buildMondayFirstMonthGrid,
  computeCyclePrediction,
  formatFullDisplayDate,
  formatMonthYearTitle,
  formatShortDayMonth,
  getCalendarDayKind,
  getTodayIso,
  isValidIsoDate,
} from '@/lib/cycle-engine';

interface CycleResultsScreenProps {
  cycleInput: CycleInput;
  onEditSetup: () => void;
  onLogNewPeriod: (isoDate: string) => void;
  onStartOver: () => void;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function MonthGridBlock({
  year,
  monthIndex0,
  todayIso,
  prediction,
}: {
  year: number;
  monthIndex0: number;
  todayIso: string;
  prediction: NonNullable<ReturnType<typeof computeCyclePrediction>>;
}) {
  const cells = buildMondayFirstMonthGrid(year, monthIndex0);

  return (
    <div>
      <h4 className="mb-2 text-xs font-bold text-zinc-900">
        {formatMonthYearTitle(year, monthIndex0)}
      </h4>
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="text-[10px] font-medium text-zinc-400">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((cell, idx) => {
          if (!cell.iso || cell.dayNumber === null) {
            return <div key={`blank-${idx}`} className="h-8" />;
          }

          const kind = getCalendarDayKind(cell.iso, prediction);
          const isToday = cell.iso === todayIso;

          let bgClass = 'text-zinc-700';
          if (kind === 'period') bgClass = 'bg-[#D81B60] text-white font-bold';
          else if (kind === 'predicted') bgClass = 'bg-[#FCE7F3] text-zinc-900';
          else if (kind === 'ovulation') bgClass = 'bg-[#FDE68A] text-zinc-900 font-semibold';
          else if (kind === 'fertile') bgClass = 'bg-[#D1FAE5] text-zinc-900';
          else if (kind === 'pms') bgClass = 'bg-[#EDE9FE] text-zinc-900';

          return (
            <div key={cell.iso} className="flex items-center justify-center">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium tabular-nums ${bgClass} ${
                  isToday ? 'ring-2 ring-[#D81B60] ring-offset-1' : ''
                }`}
              >
                {cell.dayNumber}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CycleResultsScreen({
  cycleInput,
  onEditSetup,
  onLogNewPeriod,
  onStartOver,
}: CycleResultsScreenProps) {
  const [logDateIso, setLogDateIso] = useState<string>(getTodayIso());
  const [logFeedback, setLogFeedback] = useState<string | null>(null);

  const todayIso = getTodayIso();
  const prediction = computeCyclePrediction(cycleInput, todayIso);

  if (!prediction) {
    return (
      <div className="rounded-2xl border border-[#ECE2E4] bg-white p-6 text-center">
        <p className="text-sm text-zinc-600">
          Add at least one valid period start date to view predictions.
        </p>
        <button
          type="button"
          onClick={onEditSetup}
          className="mt-4 rounded-xl bg-[#D81B60] px-4 py-2 text-xs font-semibold text-white"
        >
          Go to cycle setup
        </button>
      </div>
    );
  }

  const ringSize = 122;
  const strokeWidth = 9;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(
    1,
    Math.max(0.04, prediction.currentCycleDay / prediction.effectiveCycleLength)
  );
  const strokeDashoffset = circumference * (1 - progress);

  const countdownText =
    prediction.daysUntilNextPeriod > 0
      ? `In ${prediction.daysUntilNextPeriod} days`
      : prediction.daysUntilNextPeriod === 0
      ? 'Expected today'
      : `${Math.abs(prediction.daysUntilNextPeriod)} days past estimate`;

  const todayDate = new Date();
  const m1Year = todayDate.getFullYear();
  const m1Month = todayDate.getMonth();
  const nextMonthDate = new Date(m1Year, m1Month + 1, 1);
  const m2Year = nextMonthDate.getFullYear();
  const m2Month = nextMonthDate.getMonth();

  const handleLogDate = (iso: string) => {
    if (!isValidIsoDate(iso)) return;
    onLogNewPeriod(iso);
    setLogFeedback(`Logged period starting ${formatFullDisplayDate(iso)}.`);
    setTimeout(() => setLogFeedback(null), 3000);
  };

  return (
    <div className="space-y-3.5">
      {/* Compact navigation row */}
      <div className="flex items-center justify-between px-0.5">
        <button
          type="button"
          onClick={onEditSetup}
          className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-zinc-700 hover:bg-white hover:text-[#D81B60] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Edit cycle
        </button>
        <h1 className="font-display text-base font-bold text-zinc-900">
          Results
        </h1>
        <span className="w-16" aria-hidden="true" />
      </div>

      {/* Top Split Row: Cycle Ring + Next Period Card */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-12 items-stretch">
        {/* Left: Cycle Day Ring */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center rounded-2xl border border-[#ECE2E4] bg-white p-5 text-center">
          <div className="relative flex h-[122px] w-[122px] items-center justify-center">
            <svg width={ringSize} height={ringSize} className="-rotate-90">
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#FCE7F3"
                strokeWidth={strokeWidth}
                fill="none"
              />
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#D81B60"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-zinc-900 tabular-nums">
                Day {prediction.currentCycleDay}
              </span>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                of {prediction.effectiveCycleLength}
              </span>
            </div>
          </div>

          <span className="mt-3 inline-flex items-center rounded-full bg-[#D81B60] px-3 py-1 text-[11px] font-semibold text-white">
            {prediction.currentPhase}
          </span>

          <p className="mt-2.5 text-[11px] leading-snug text-zinc-500">
            Last period started {formatFullDisplayDate(prediction.lastPeriodStart)}
          </p>
        </div>

        {/* Right: Next Period + 4 Result Windows */}
        <div className="sm:col-span-7 rounded-2xl border border-[#ECE2E4] bg-white p-5">
          <h3 className="font-display text-sm font-bold text-zinc-900">
            Next period
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 tabular-nums">
            {countdownText}
          </p>

          <p className="mt-2.5 font-display text-xl font-bold text-zinc-900 tabular-nums">
            {formatFullDisplayDate(prediction.nextPeriodDate)}
          </p>
          <p className="mt-0.5 text-xs text-zinc-500 tabular-nums">
            Likely range: {formatShortDayMonth(prediction.likelyRangeStart)} –{' '}
            {formatShortDayMonth(prediction.likelyRangeEnd)} (±1 day)
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[#FEF9E7] p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                <Egg className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Ovulation</span>
              </div>
              <p className="mt-1 text-xs font-medium text-zinc-700 tabular-nums">
                {formatFullDisplayDate(prediction.ovulationDate)}
              </p>
            </div>

            <div className="rounded-xl bg-[#ECFDF5] p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                <Heart className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Fertile window</span>
              </div>
              <p className="mt-1 text-xs font-medium text-zinc-700 tabular-nums">
                {formatShortDayMonth(prediction.fertileWindowStart)} –{' '}
                {formatShortDayMonth(prediction.fertileWindowEnd)}
              </p>
            </div>

            <div className="rounded-xl bg-[#F3F0FF] p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                <Sparkles className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                <span>PMS window</span>
              </div>
              <p className="mt-1 text-xs font-medium text-zinc-700 tabular-nums">
                {formatShortDayMonth(prediction.pmsWindowStart)} –{' '}
                {formatShortDayMonth(prediction.pmsWindowEnd)}
              </p>
            </div>

            <div className="rounded-xl bg-[#FFF1F4] p-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-900">
                <CalendarIcon className="h-3.5 w-3.5 text-[#D81B60] shrink-0" />
                <span>Effective cycle</span>
              </div>
              <p className="mt-1 text-xs font-medium text-zinc-700 tabular-nums">
                {prediction.effectiveCycleLength} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Card */}
      <div className="rounded-2xl border border-[#ECE2E4] bg-white p-5">
        <h3 className="font-display text-sm font-bold text-zinc-900">
          Calendar
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Colour-coded for this month and next.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <MonthGridBlock
            year={m1Year}
            monthIndex0={m1Month}
            todayIso={todayIso}
            prediction={prediction}
          />
          <MonthGridBlock
            year={m2Year}
            monthIndex0={m2Month}
            todayIso={todayIso}
            prediction={prediction}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D81B60]" />
            Period
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FBCFE8]" />
            Predicted period
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#A7F3D0]" />
            Fertile
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
            Ovulation
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#DDD6FE]" />
            PMS
          </span>
        </div>
      </div>

      {/* How your prediction is worked out */}
      <div className="rounded-2xl border border-[#ECE2E4] bg-white p-5">
        <h3 className="font-display text-sm font-bold text-zinc-900">
          How your prediction is worked out
        </h3>

        <div className="mt-3 space-y-1.5 text-xs leading-relaxed text-zinc-600">
          <p>
            Stated cycle length:{' '}
            <strong className="font-semibold text-zinc-900 tabular-nums">
              {prediction.statedCycleLength} days
            </strong>
          </p>
          <p>
            Actual gaps between your dates:{' '}
            <strong className="font-semibold text-zinc-900 tabular-nums">
              {prediction.gaps.length > 0
                ? `${prediction.gaps.map((g) => `${g} days`).join(', ')} (average ${prediction.averageGap} days)`
                : 'Add 2+ period dates to blend observed cycle gaps'}
            </strong>
          </p>
          <p>
            Effective cycle:{' '}
            <strong className="font-semibold text-zinc-900 tabular-nums">
              {prediction.effectiveCycleLength} days
            </strong>{' '}
            —{' '}
            {prediction.averageGap !== null
              ? '65% your real gaps + 35% your stated length, so real history weighs more.'
              : 'using your stated cycle length directly until more dates are logged.'}
          </p>
          <p>
            Ovulation is estimated as 14 days before your next period, and the
            fertile window is the 5 days before ovulation plus ovulation day
            itself. PMS window is 7 days before your next period, and the likely
            range is ±1 day around the predicted date.
          </p>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[11px] text-zinc-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" />
          <span>
            These are estimates. Log each new period and the prediction sharpens
            over time.
          </span>
        </p>
      </div>

      {/* Log a period */}
      <div className="rounded-2xl border border-[#ECE2E4] bg-white p-5">
        <h3 className="font-display text-sm font-bold text-zinc-900">
          Log a period
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Logging keeps future predictions accurate.
        </p>

        <div className="mt-3.5">
          <label className="mb-1.5 block text-xs font-semibold text-zinc-800">
            Period start date
          </label>
          <DatePickerField
            valueIso={logDateIso}
            onChangeIso={setLogDateIso}
            ariaLabel="New period start date"
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleLogDate(logDateIso)}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#D81B60] px-4 py-2 text-xs font-semibold text-white hover:bg-[#BE185D] transition-colors whitespace-nowrap shrink-0"
          >
            Log this period
          </button>

          <button
            type="button"
            onClick={() => handleLogDate(todayIso)}
            className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-[#FFF1F4] px-4 py-2 text-xs font-semibold text-[#9D174D] hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0"
          >
            Period started today
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex min-h-[40px] items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Start over
          </button>
        </div>

        {logFeedback && (
          <p className="mt-2.5 text-xs font-medium text-teal-700">
            {logFeedback}
          </p>
        )}
      </div>
    </div>
  );
}
