import type { CSSProperties } from 'react';
import type { Employment } from '../data/cv';
import './StackFrame.css';

interface Props {
  employment: Employment;
  depth: number;
  executing: boolean;
  onActivate?: (id: string | null) => void;
}

function period(start: string, end: string | null): string {
  return `${start} to ${end ?? 'present'}`;
}

export default function StackFrame({ employment, depth, executing, onActivate }: Props) {
  const e = employment;

  return (
    <li
      className="frame"
      data-executing={executing || undefined}
      data-depth={depth}
      style={{ '--depth': String(depth) } as CSSProperties}
      tabIndex={0}
      data-testid="stack-frame"
      onFocus={() => onActivate?.(e.id)}
      onBlur={() => onActivate?.(null)}
      onMouseEnter={() => onActivate?.(e.id)}
      onMouseLeave={() => onActivate?.(null)}
    >
      <div className="frame-head">
        <h3>{e.company}</h3>
        {executing && <span className="frame-state mono">executing</span>}
      </div>

      <p className="frame-meta mono">
        {period(e.start, e.end)}, {e.commitment}, {e.mode}
        {e.nature === 'internship' ? ', internship' : ''}
      </p>
      <p className="frame-meta mono">{e.location}</p>

      <ol className="frame-roles">
        {e.roles.map((r) => (
          <li key={r.title}>
            <span className="frame-role">{r.title}</span>{' '}
            <span className="mono frame-role-span">
              {r.start} to {r.end ?? 'present'}
            </span>
          </li>
        ))}
      </ol>

      {e.points.length > 0 && (
        <ul className="frame-points">
          {e.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
