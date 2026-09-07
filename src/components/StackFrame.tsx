import type { Employment } from '../data/cv';
import './StackFrame.css';

interface Props {
  employment: Employment;
  depth: number;
  executing: boolean;
  active: boolean;
  innerRef?: (el: HTMLElement | null) => void;
}

export default function StackFrame({ employment: e, depth, executing, active, innerRef }: Props) {
  const args: [string, string, string][] = [
    ['company', `'${e.company}'`, 't-str'],
    ['period', `'${e.start}' → ${e.end ? `'${e.end}'` : 'present'}`, 't-str'],
    ['location', `'${e.location}'`, 't-str'],
    [
      'contract',
      `'${e.commitment}${e.nature === 'internship' ? ', internship' : ''}, ${e.mode}'`,
      't-str',
    ],
  ];

  return (
    <li
      className="fc"
      id={`frame-${e.id}`}
      data-frame-id={e.id}
      data-testid="stack-frame"
      data-depth={depth}
      data-executing={executing || undefined}
      data-active={active || undefined}
      ref={innerRef}
    >
      <div className="fc-head">
        <span className="fc-caret mono" aria-hidden="true">▾</span>
        <h3 className="fc-fn mono">
          <span className="t-fn">{e.id}</span><span className="t-punc">()</span>
        </h3>
        <span className="fc-company">{e.company}</span>
        <span className="fc-depth mono" title="stack depth">⟨{depth}⟩</span>
        {executing && (
          <span className="fc-live mono">
            <i aria-hidden="true" /> executing
          </span>
        )}
      </div>

      <dl className="fc-args mono">
        {args.map(([k, v, cls]) => (
          <div key={k}>
            <dt className="t-prop">{k}</dt>
            <dd className={cls}>{v}</dd>
          </div>
        ))}
      </dl>

      <ol className="fc-roles">
        {e.roles.map((r) => (
          <li key={r.title}>
            <span className="fc-role">{r.title}</span>
            <span className="fc-role-span mono t-com">
              {r.start} → {r.end ?? 'present'}
            </span>
          </li>
        ))}
      </ol>

      {e.points.length > 0 && (
        <div className="fc-ret">
          <p className="fc-ret-line mono">
            <span className="t-kw">return</span> <span className="t-punc">[</span>
          </p>
          <ul className="fc-points">
            {e.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="fc-ret-line mono t-punc">];</p>
        </div>
      )}
    </li>
  );
}
