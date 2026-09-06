import { EMPLOYMENT, NOW } from '../data/cv';
import { spansOf, toMonths, peakConcurrency } from '../lib/timeline';
import './ParallelRegion.css';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

export default function ParallelRegion() {
  const early = EMPLOYMENT;
  const spans = spansOf(early);

  const lo = Math.min(...spans.map((s) => toMonths(s.start)));
  const hiCandidates = early
    .filter((e) => e.end !== null)
    .map((e) => toMonths(e.end as string));
  const hi = Math.max(...hiCandidates);
  const width = hi - lo;
  const months = hi - lo + 1;

  const peak = peakConcurrency(spans, NOW);

  const ordered = [...early].sort((a, b) => toMonths(a.start) - toMonths(b.start));

  return (
    <section aria-labelledby="parallel-heading" className="parallel">
      <h2 id="parallel-heading">Parallel region, settled</h2>
      <p className="parallel-note">
        {cap(WORDS[early.length])} roles across {WORDS[months]} months, peaking at{' '}
        <strong>{WORDS[peak.count]} at once</strong>. Two were part-time
        internships, which is what makes the overlap ordinary rather than
        remarkable.
      </p>

      <ol className="lanes" aria-label="Concurrent early roles">
        {ordered.map((e) => {
          const start = toMonths(e.start);
          const end = e.end ? toMonths(e.end) : hi;
          const left = ((start - lo) / width) * 100;
          const span = ((end - start) / width) * 100;

          return (
            <li
              key={e.id}
              className="lane"
              data-commitment={e.commitment}
              data-open={e.end === null || undefined}
            >
              <div className="lane-label">
                <span className="lane-company">{e.company}</span>
                <span className="mono lane-period">
                  {e.start} to {e.end ?? 'present'}
                </span>
              </div>
              <div className="lane-track">
                <span
                  className="lane-bar"
                  data-testid="lane-bar"
                  style={{ left: `${left}%`, width: `${span}%` }}
                />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
