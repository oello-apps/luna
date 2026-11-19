export interface CycleInput {
  periodDates: string[]; // Array of 1..5 ISO YYYY-MM-DD strings
  statedCycleLength: number; // 21..45
  bleedingLength: number; // 2..10
}

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export type CalendarDayKind =
  | 'period'
  | 'predicted'
  | 'ovulation'
  | 'fertile'
  | 'pms'
  | 'none';

export interface CyclePrediction {
  sortedDates: string[];
  lastPeriodStart: string;
  statedCycleLength: number;
  bleedingLength: number;
  gaps: number[];
  averageGap: number | null;
  effectiveCycleLength: number;
  currentCycleDay: number;
  daysUntilNextPeriod: number;
  currentPhase: CyclePhase;
  nextPeriodDate: string;
  likelyRangeStart: string;
  likelyRangeEnd: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  pmsWindowStart: string;
  pmsWindowEnd: string;
  loggedPeriodDays: Set<string>;
  predictedPeriodDays: Set<string>;
  fertileDays: Set<string>;
  pmsDays: Set<string>;
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const MONTH_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function getDaysInMonth(year: number, month1To12: number): number {
  return new Date(year, month1To12, 0).getDate();
}

export function isValidIsoDate(iso: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1900 || year > 2100 || month < 1 || month > 12) return false;
  const maxDay = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDay;
}

export function toLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function dateToIso(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function getTodayIso(): string {
  return dateToIso(new Date());
}

export function parseUserDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (isValidIsoDate(trimmed)) {
    return trimmed;
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (!slashMatch) return null;

  const month = Number(slashMatch[1]);
  const day = Number(slashMatch[2]);
  const year = Number(slashMatch[3]);
  const iso = `${year}-${pad2(month)}-${pad2(day)}`;
  return isValidIsoDate(iso) ? iso : null;
}

export function formatMMDDYYYY(iso: string): string {
  if (!isValidIsoDate(iso)) return '';
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

export function formatShortDayMonth(iso: string): string {
  if (!isValidIsoDate(iso)) return '—';
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTH_SHORT[m - 1]}`;
}

export function formatFullDisplayDate(iso: string): string {
  if (!isValidIsoDate(iso)) return '—';
  const date = toLocalDate(iso);
  const weekday = WEEKDAY_SHORT[date.getDay()];
  const day = date.getDate();
  const month = MONTH_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

export function formatMonthYearTitle(year: number, monthIndex0: number): string {
  return `${MONTH_LONG[monthIndex0]} ${year}`;
}

export function addDays(iso: string, deltaDays: number): string {
  const d = toLocalDate(iso);
  d.setDate(d.getDate() + deltaDays);
  return dateToIso(d);
}

export function diffDays(fromIso: string, toIso: string): number {
  const a = toLocalDate(fromIso);
  const b = toLocalDate(toIso);
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function computeCyclePrediction(
  input: CycleInput,
  todayIso: string = getTodayIso()
): CyclePrediction | null {
  const uniqueValid = Array.from(
    new Set(input.periodDates.filter((d) => isValidIsoDate(d)))
  ).sort();

  if (uniqueValid.length === 0) {
    return null;
  }

  const statedCycleLength = clamp(Math.round(input.statedCycleLength || 28), 21, 45);
  const bleedingLength = clamp(Math.round(input.bleedingLength || 5), 2, 10);

  const gaps: number[] = [];
  for (let i = 1; i < uniqueValid.length; i++) {
    const gap = diffDays(uniqueValid[i - 1], uniqueValid[i]);
    if (gap > 0) {
      gaps.push(gap);
    }
  }

  const averageGap =
    gaps.length > 0
      ? Math.round(gaps.reduce((sum, g) => sum + g, 0) / gaps.length)
      : null;

  const effectiveCycleLength =
    averageGap !== null
      ? clamp(Math.round(averageGap * 0.65 + statedCycleLength * 0.35), 18, 90)
      : statedCycleLength;

  const lastPeriodStart = uniqueValid[uniqueValid.length - 1];
  const nextPeriodDate = addDays(lastPeriodStart, effectiveCycleLength);
  const likelyRangeStart = addDays(nextPeriodDate, -1);
  const likelyRangeEnd = addDays(nextPeriodDate, 1);
  const ovulationDate = addDays(nextPeriodDate, -14);
  const fertileWindowStart = addDays(ovulationDate, -5);
  const fertileWindowEnd = ovulationDate;
  const pmsWindowStart = addDays(nextPeriodDate, -7);
  const pmsWindowEnd = addDays(nextPeriodDate, -1);

  const rawCycleDay = diffDays(lastPeriodStart, todayIso) + 1;
  const currentCycleDay = Math.max(1, rawCycleDay);
  const daysUntilNextPeriod = diffDays(todayIso, nextPeriodDate);

  let currentPhase: CyclePhase = 'Follicular';
  if (currentCycleDay <= bleedingLength) {
    currentPhase = 'Menstrual';
  } else if (todayIso === ovulationDate) {
    currentPhase = 'Ovulation';
  } else if (todayIso >= fertileWindowStart && todayIso <= fertileWindowEnd) {
    currentPhase = 'Ovulation';
  } else if (todayIso >= pmsWindowStart || todayIso > ovulationDate) {
    currentPhase = 'Luteal';
  } else {
    currentPhase = 'Follicular';
  }

  const loggedPeriodDays = new Set<string>();
  for (const startIso of uniqueValid) {
    for (let offset = 0; offset < bleedingLength; offset++) {
      loggedPeriodDays.add(addDays(startIso, offset));
    }
  }

  const predictedPeriodDays = new Set<string>();
  // Project up to 2 future predicted cycles so 2-month calendars always stay rich
  for (let cycleOffset = 1; cycleOffset <= 2; cycleOffset++) {
    const cycleStart = addDays(lastPeriodStart, effectiveCycleLength * cycleOffset);
    for (let offset = 0; offset < bleedingLength; offset++) {
      predictedPeriodDays.add(addDays(cycleStart, offset));
    }
  }

  const fertileDays = new Set<string>();
  for (let offset = 0; offset <= 5; offset++) {
    fertileDays.add(addDays(fertileWindowStart, offset));
  }

  const pmsDays = new Set<string>();
  for (let offset = 0; offset < 7; offset++) {
    pmsDays.add(addDays(pmsWindowStart, offset));
  }

  return {
    sortedDates: uniqueValid,
    lastPeriodStart,
    statedCycleLength,
    bleedingLength,
    gaps,
    averageGap,
    effectiveCycleLength,
    currentCycleDay,
    daysUntilNextPeriod,
    currentPhase,
    nextPeriodDate,
    likelyRangeStart,
    likelyRangeEnd,
    ovulationDate,
    fertileWindowStart,
    fertileWindowEnd,
    pmsWindowStart,
    pmsWindowEnd,
    loggedPeriodDays,
    predictedPeriodDays,
    fertileDays,
    pmsDays,
  };
}

export function getCalendarDayKind(
  iso: string,
  prediction: CyclePrediction
): CalendarDayKind {
  if (prediction.loggedPeriodDays.has(iso)) return 'period';
  if (prediction.predictedPeriodDays.has(iso)) return 'predicted';
  if (iso === prediction.ovulationDate) return 'ovulation';
  if (prediction.fertileDays.has(iso)) return 'fertile';
  if (prediction.pmsDays.has(iso)) return 'pms';
  return 'none';
}

export interface MonthGridCell {
  iso: string | null;
  dayNumber: number | null;
}

/** Monday-first grid (Mo Tu We Th Fr Sa Su) matching the reference screenshot */
export function buildMondayFirstMonthGrid(
  year: number,
  monthIndex0: number
): MonthGridCell[] {
  const firstDay = new Date(year, monthIndex0, 1);
  // JS getDay(): 0 = Sun, 1 = Mon ... 6 = Sat -> convert to 0 = Mon ... 6 = Sun
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = getDaysInMonth(year, monthIndex0 + 1);

  const cells: MonthGridCell[] = [];
  for (let i = 0; i < mondayOffset; i++) {
    cells.push({ iso: null, dayNumber: null });
  }
  for (let day = 1; day <= totalDays; day++) {
    const iso = `${year}-${pad2(monthIndex0 + 1)}-${pad2(day)}`;
    cells.push({ iso, dayNumber: day });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ iso: null, dayNumber: null });
  }
  return cells;
}
