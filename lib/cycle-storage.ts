import { CycleInput, isValidIsoDate } from './cycle-engine';

export const CYCLE_STORAGE_KEY = 'lune_cycle_input_v1';

export const DEFAULT_CYCLE_INPUT: CycleInput = {
  periodDates: ['', ''],
  statedCycleLength: 28,
  bleedingLength: 5,
};

export function loadStoredCycleInput(): CycleInput {
  if (typeof window === 'undefined') return DEFAULT_CYCLE_INPUT;
  try {
    const raw = window.localStorage.getItem(CYCLE_STORAGE_KEY);
    if (!raw) return DEFAULT_CYCLE_INPUT;
    const parsed = JSON.parse(raw) as CycleInput;
    if (!Array.isArray(parsed.periodDates)) return DEFAULT_CYCLE_INPUT;
    return {
      periodDates:
        parsed.periodDates.length > 0 ? parsed.periodDates : ['', ''],
      statedCycleLength: parsed.statedCycleLength || 28,
      bleedingLength: parsed.bleedingLength || 5,
    };
  } catch {
    return DEFAULT_CYCLE_INPUT;
  }
}

export function hasSavedValidCycle(): boolean {
  const stored = loadStoredCycleInput();
  return stored.periodDates.some((d) => isValidIsoDate(d));
}

export function saveStoredCycleInput(data: CycleInput): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CYCLE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage quota or privacy mode fallback
  }
}

export function clearStoredCycleInput(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CYCLE_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
