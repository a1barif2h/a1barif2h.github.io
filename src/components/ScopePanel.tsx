import { EMPLOYMENT, IDENTITY } from '../data/cv';
import { spansOf, experienceHeadline } from '../lib/timeline';

/** Locals of whichever frame is executing — empty means the global context. */
export default function ScopePanel({ activeId }: { activeId: string | null }) {
  const frame = EMPLOYMENT.find((e) => e.id === activeId) ?? null;

  const locals: [string, string, string][] = frame
    ? [
        ['company', `'${frame.company}'`, 't-str'],
        ['start', `'${frame.start}'`, 't-str'],
        ['end', frame.end ? `'${frame.end}'` : 'null', frame.end ? 't-str' : 't-kw'],
        ['mode', `'${frame.mode}'`, 't-str'],
        ['type', `'${frame.commitment}'`, 't-str'],
        ['roles', String(frame.roles.length), 't-num'],
      ]
    : [
        ['name', `'${IDENTITY.name}'`, 't-str'],
        ['role', `'${IDENTITY.title}'`, 't-str'],
        ['experience', `'${experienceHeadline(spansOf(EMPLOYMENT), new Date())}'`, 't-str'],
        ['based', `'${IDENTITY.location}'`, 't-str'],
      ];

  return (
    <section className="panel" aria-labelledby="p-scope">
      <h2 className="panel-h mono" id="p-scope">
        Scope
        <span className="panel-scope mono">{frame ? `${frame.id}()` : 'global'}</span>
      </h2>

      <dl className="locals mono" data-testid="scope-panel">
        {locals.map(([k, v, cls]) => (
          <div className="local" key={k}>
            <dt className="t-prop">{k}</dt>
            <dd className={cls}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
