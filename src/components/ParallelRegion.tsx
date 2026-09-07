import { EMPLOYMENT, NOW } from '../data/cv';
import {
  spansOf, toMonths, peakConcurrency, concurrentPairs, yearsSince,
} from '../lib/timeline';
import './ParallelRegion.css';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve'];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

function monthName(ym: string): string {
  const [y, m] = ym.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

export default function ParallelRegion() {
  const spans = spansOf(EMPLOYMENT);

  const lo = Math.min(...spans.map((s) => toMonths(s.start)));
  const hi = Math.max(
    ...EMPLOYMENT.filter((e) => e.end !== null).map((e) => toMonths(e.end as string)),
  );
  const width = hi - lo;
  const months = hi - lo + 1;

  const peak = peakConcurrency(spans, NOW);
  const pairs = concurrentPairs(spans, NOW);
  const window = peak.windows[0];

  // Everything the sentence claims is read back out of the dates, so a
  // correction to the employment data rewrites the prose with it.
  const interns = EMPLOYMENT.filter(
    (e) => e.commitment === 'part-time' && e.nature === 'internship',
  );
  const internsRemote = interns.every((e) => e.mode === 'remote');

  const ongoing = EMPLOYMENT.find((e) => e.end === null);
  const settledYears = ongoing
    ? Math.floor(yearsSince(ongoing.start, new Date()))
    : 0;

  const ordered = [...EMPLOYMENT].sort((a, b) => toMonths(a.start) - toMonths(b.start));
  const pct = (ym: string) => ((toMonths(ym) - lo) / width) * 100;

  const bands = peak.windows.map((w) => ({
    left: pct(w.from),
    width: Math.max(((toMonths(w.to) - toMonths(w.from)) / width) * 100, 1.6),
    label: `${WORDS[peak.count]} concurrent`,
  }));

  return (
    <div className="parallel">
      <p className="parallel-lead">
        For {WORDS[months]} months the call stack was not a stack.
      </p>

      <p className="parallel-note">
        {cap(WORDS[EMPLOYMENT.length])} roles overlapped, peaking at{' '}
        <strong>{WORDS[peak.count]} at once</strong> — first in {monthName(window.from)}
        {peak.windows[1] ? `, then again in ${monthName(peak.windows[1].from)}` : ''}.{' '}
        {cap(WORDS[interns.length])} were part-time internships
        {internsRemote ? ', run remotely alongside the others' : ''}. They resolved into
        one frame, still executing {WORDS[settledYears]} years later.
      </p>

      <p className="parallel-stat mono t-com">
        // concurrency: peak {peak.count} · overlapping pairs {pairs.length} ·
        span {months} months
      </p>

      <div className="chart">
        <div className="chart-head" aria-hidden="true">
          <span className="chart-gutter" />
          <div className="chart-plot">
            {bands.map((b) => (
              <span className="peak-tag mono" key={b.left} style={{ left: `${b.left}%` }}>
                peak {peak.count}
              </span>
            ))}
          </div>
        </div>

        <div className="chart-body">
          <div className="chart-bands" aria-hidden="true">
            {bands.map((b) => (
              <span key={b.left} style={{ left: `${b.left}%`, width: `${b.width}%` }} />
            ))}
          </div>

          <ol className="lanes" aria-label="Concurrent early roles">
          {ordered.map((e) => {
            const start = toMonths(e.start);
            const end = e.end ? toMonths(e.end) : hi;
            return (
              <li
                key={e.id}
                className="lane"
                data-commitment={e.commitment}
                data-open={e.end === null || undefined}
              >
                <div className="lane-label chart-gutter">
                  <span className="lane-company">{e.company}</span>
                  <span className="mono lane-period">
                    {e.start} to {e.end ?? 'present'}
                  </span>
                </div>

                <div className="lane-track chart-plot">
                  <span
                    className="lane-bar"
                    data-testid="lane-bar"
                    style={{
                      left: `${((start - lo) / width) * 100}%`,
                      width: `${((end - start) / width) * 100}%`,
                    }}
                  />
                </div>
              </li>
            );
          })}
          </ol>
        </div>

        <div className="chart-axis mono" aria-hidden="true">
          <span className="chart-gutter" />
          <div className="chart-plot">
            <span className="axis-tick" style={{ left: '0%' }}>{ordered[0].start}</span>
            <span className="axis-tick axis-end" style={{ left: '100%' }}>
              {EMPLOYMENT.filter((e) => e.end !== null)
                .map((e) => e.end as string)
                .sort()
                .at(-1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
