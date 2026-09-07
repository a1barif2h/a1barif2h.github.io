import type { Employment } from '../data/cv';

export interface Span {
  id: string;
  start: string;
  end: string | null;
}

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

export function toMonths(ym: string): number {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
}

export function fromMonths(n: number): string {
  const y = Math.floor(n / 12);
  const m = (n % 12) + 1;
  return `${y}-${String(m).padStart(2, '0')}`;
}

export function spansOf(employment: Employment[]): Span[] {
  return employment.map(({ id, start, end }) => ({ id, start, end }));
}

function endMonth(s: Span, now: string): number {
  return toMonths(s.end ?? now);
}

export function overlaps(a: Span, b: Span, now: string): boolean {
  return (
    toMonths(a.start) <= endMonth(b, now) && toMonths(b.start) <= endMonth(a, now)
  );
}

export function concurrentPairs(spans: Span[], now: string): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  for (let i = 0; i < spans.length; i++) {
    for (let j = i + 1; j < spans.length; j++) {
      if (overlaps(spans[i], spans[j], now)) pairs.push([spans[i].id, spans[j].id]);
    }
  }
  return pairs;
}

export interface PeakResult {
  count: number;
  windows: Array<{ from: string; to: string }>;
}

export function peakConcurrency(spans: Span[], now: string): PeakResult {
  const { from, to } = axisBounds(spans, now);
  const lo = toMonths(from);
  const hi = toMonths(to);

  const active: number[] = [];
  for (let m = lo; m <= hi; m++) {
    active.push(
      spans.filter((s) => toMonths(s.start) <= m && m <= endMonth(s, now)).length,
    );
  }

  const count = Math.max(...active);
  const windows: Array<{ from: string; to: string }> = [];
  let open: number | null = null;

  for (let i = 0; i < active.length; i++) {
    const isPeak = active[i] === count;
    if (isPeak && open === null) open = i;
    if (!isPeak && open !== null) {
      windows.push({ from: fromMonths(lo + open), to: fromMonths(lo + i - 1) });
      open = null;
    }
  }
  if (open !== null) {
    windows.push({ from: fromMonths(lo + open), to: fromMonths(hi) });
  }

  return { count, windows };
}

export function axisBounds(spans: Span[], now: string): { from: string; to: string } {
  const starts = spans.map((s) => toMonths(s.start));
  const ends = spans.map((s) => endMonth(s, now));
  return { from: fromMonths(Math.min(...starts)), to: fromMonths(Math.max(...ends)) };
}

export function yearsSince(startYm: string, now: Date): number {
  const [y, m] = startYm.split('-').map(Number);
  const start = Date.UTC(y, m - 1, 1);
  return (now.getTime() - start) / MS_PER_YEAR;
}

export function experienceHeadline(spans: Span[], now: Date): string {
  const earliest = spans.reduce(
    (min, s) => (toMonths(s.start) < toMonths(min) ? s.start : min),
    spans[0].start,
  );
  return `${Math.floor(yearsSince(earliest, now))}+ years`;
}
