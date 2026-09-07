import { EMPLOYMENT, NOW } from '../data/cv';
import {
  toMonths, fromMonths, overlaps, concurrentPairs,
  peakConcurrency, yearsSince, experienceHeadline, spansOf, axisBounds,
} from './timeline';

const spans = spansOf(EMPLOYMENT);

describe('month arithmetic', () => {
  it('round-trips a month string', () => {
    expect(fromMonths(toMonths('2021-04'))).toBe('2021-04');
  });

  it('orders months correctly across a year boundary', () => {
    expect(toMonths('2021-01')).toBeGreaterThan(toMonths('2020-12'));
  });
});

describe('overlaps', () => {
  it('counts a single shared month as an overlap', () => {
    expect(
      overlaps(
        { id: 'a', start: '2020-12', end: '2021-04' },
        { id: 'b', start: '2021-04', end: '2021-10' },
        NOW,
      ),
    ).toBe(true);
  });

  it('rejects spans that merely touch end-to-start with a gap', () => {
    expect(
      overlaps(
        { id: 'a', start: '2020-12', end: '2021-03' },
        { id: 'b', start: '2021-04', end: '2021-10' },
        NOW,
      ),
    ).toBe(false);
  });

  it('treats a null end as running to NOW', () => {
    expect(
      overlaps(
        { id: 'a', start: '2021-09', end: null },
        { id: 'b', start: '2026-01', end: '2026-02' },
        NOW,
      ),
    ).toBe(true);
  });
});

describe('concurrentPairs', () => {
  it('finds exactly five overlapping pairs in the real history', () => {
    const pairs = concurrentPairs(spans, NOW).map(([a, b]) => [a, b].sort().join('+')).sort();
    expect(pairs).toEqual([
      'cogniable+hwsaver',
      'cogniable+penta',
      'cogniable+virtuera',
      'hwsaver+penta',
      'hwsaver+virtuera',
    ]);
  });
});

describe('peakConcurrency', () => {
  it('peaks at three, reached in Apr 2021 and again Sep-Oct 2021', () => {
    const peak = peakConcurrency(spans, NOW);
    expect(peak.count).toBe(3);
    expect(peak.windows).toEqual([
      { from: '2021-04', to: '2021-04' },
      { from: '2021-09', to: '2021-10' },
    ]);
  });
});

describe('experience duration', () => {
  it('measures from the earliest start', () => {
    const years = yearsSince('2020-12', new Date('2026-09-06T00:00:00Z'));
    expect(years).toBeGreaterThan(5.7);
    expect(years).toBeLessThan(5.9);
  });

  it('reads as 5+ years today', () => {
    expect(experienceHeadline(spans, new Date('2026-09-06T00:00:00Z'))).toBe('5+ years');
  });

  it('still reads 5+ when counted from the first full-time role', () => {
    const fullTime = spansOf(EMPLOYMENT.filter((e) => e.commitment === 'full-time'));
    expect(experienceHeadline(fullTime, new Date('2026-09-06T00:00:00Z'))).toBe('5+ years');
  });
});

describe('axisBounds', () => {
  it('spans the earliest start to NOW', () => {
    expect(axisBounds(spans, NOW)).toEqual({ from: '2020-12', to: NOW });
  });
});
