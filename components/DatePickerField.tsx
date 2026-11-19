'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, X } from 'lucide-react';
import {
  buildMondayFirstMonthGrid,
  formatMMDDYYYY,
  formatMonthYearTitle,
  getTodayIso,
  isValidIsoDate,
  parseUserDateInput,
  toLocalDate,
} from '@/lib/cycle-engine';

interface DatePickerFieldProps {
  valueIso: string;
  onChangeIso: (iso: string) => void;
  onRemove?: () => void;
  canRemove?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function formatSlashInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function DatePickerField({
  valueIso,
  onChangeIso,
  onRemove,
  canRemove = false,
  placeholder = 'mm/dd/yyyy',
  ariaLabel = 'Period start date',
}: DatePickerFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const initialAnchor = isValidIsoDate(valueIso)
    ? toLocalDate(valueIso)
    : new Date();
  const [viewYear, setViewYear] = useState(initialAnchor.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialAnchor.getMonth());

  const textValue =
    draft !== null
      ? draft
      : isValidIsoDate(valueIso)
      ? formatMMDDYYYY(valueIso)
      : '';

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSlashInput(e.target.value);

    if (formatted === '') {
      setDraft(null);
      onChangeIso('');
      return;
    }

    if (formatted.length === 10) {
      const parsed = parseUserDateInput(formatted);
      if (parsed) {
        setDraft(null);
        onChangeIso(parsed);
        return;
      }
    }

    setDraft(formatted);
  };

  const openModal = () => {
    const anchor = isValidIsoDate(valueIso)
      ? toLocalDate(valueIso)
      : new Date();
    setViewYear(anchor.getFullYear());
    setViewMonth(anchor.getMonth());
    setModalOpen(true);
  };

  const stepMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const selectIso = (iso: string) => {
    setDraft(null);
    onChangeIso(iso);
    setModalOpen(false);
  };

  const todayIso = getTodayIso();
  const gridCells = buildMondayFirstMonthGrid(viewYear, viewMonth);
  const hasInvalidPartial =
    textValue.length === 10 && parseUserDateInput(textValue) === null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex flex-1 items-center h-11 rounded-xl border bg-white px-3.5 transition-colors focus-within:border-[#D81B60] focus-within:ring-2 focus-within:ring-rose-100 ${
            hasInvalidPartial ? 'border-red-500' : 'border-[#E5DADC]'
          }`}
        >
          <input
            type="text"
            inputMode="numeric"
            value={textValue}
            onChange={handleTextChange}
            placeholder={placeholder}
            maxLength={10}
            aria-label={ariaLabel}
            className="w-full bg-transparent text-[15px] text-zinc-900 placeholder:text-zinc-400 font-mono tabular-nums focus:outline-none"
          />
          <button
            type="button"
            onClick={openModal}
            aria-label="Open calendar date picker"
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-600 hover:bg-rose-50 hover:text-[#D81B60] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D81B60]"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={!canRemove}
            aria-label="Remove date"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-500 hover:bg-rose-50 hover:text-[#D81B60] disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D81B60]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {hasInvalidPartial && (
        <p className="text-xs text-red-600">
          Enter a valid calendar date in MM/DD/YYYY format.
        </p>
      )}

      {modalOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-slate-950/40 backdrop-blur-[2px] p-4"
            onClick={() => setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Select date"
          >
            <div
              className="my-auto w-full max-w-[340px] max-h-[85dvh] overflow-y-auto rounded-2xl border border-[#ECE2E4] bg-white p-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-sm font-semibold text-zinc-900">
                  Select period start date
                </h3>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close calendar"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => stepMonth(-1)}
                  aria-label="Previous month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1F4] text-[#D81B60] hover:bg-rose-100 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-display text-sm font-semibold text-zinc-900">
                  {formatMonthYearTitle(viewYear, viewMonth)}
                </span>
                <button
                  type="button"
                  onClick={() => stepMonth(1)}
                  aria-label="Next month"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF1F4] text-[#D81B60] hover:bg-rose-100 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-1.5 grid grid-cols-7 text-center">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="text-[11px] font-semibold text-zinc-400"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {gridCells.map((cell, idx) => {
                  if (!cell.iso || cell.dayNumber === null) {
                    return <div key={`blank-${idx}`} className="h-9" />;
                  }

                  const isSelected = cell.iso === valueIso;
                  const isToday = cell.iso === todayIso;

                  return (
                    <button
                      key={cell.iso}
                      type="button"
                      onClick={() => selectIso(cell.iso!)}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors ${
                        isSelected
                          ? 'bg-[#D81B60] font-semibold text-white'
                          : isToday
                          ? 'border-2 border-[#D81B60] text-zinc-900 hover:bg-rose-50'
                          : 'text-zinc-800 hover:bg-rose-50'
                      }`}
                    >
                      {cell.dayNumber}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
                <button
                  type="button"
                  onClick={() => selectIso(todayIso)}
                  className="rounded-lg bg-[#FFF1F4] px-3 py-1.5 text-xs font-semibold text-[#D81B60] hover:bg-rose-100 transition-colors"
                >
                  Select Today
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
