import { useEffect, useState } from 'react';
import { SKILLS } from '../data/cv';
import { useReducedMotion } from '../hooks/useReducedMotion';
import './ScopeChain.css';

const STEP_MS = 420;

/** Index of the scope that actually holds an identifier. */
function scopeOf(item: string): number {
  return SKILLS.findIndex((t) => t.items.includes(item));
}

export default function ScopeChain() {
  const reduced = useReducedMotion();
  const [query, setQuery] = useState<string | null>(null);
  const [probe, setProbe] = useState(-1);

  const target = query ? scopeOf(query) : -1;

  useEffect(() => {
    if (query === null) return;
    if (reduced) {
      setProbe(target);
      return;
    }
    setProbe(0);
    const timers: number[] = [];
    for (let i = 1; i <= target; i += 1) {
      timers.push(window.setTimeout(() => setProbe(i), i * STEP_MS));
    }
    return () => timers.forEach(window.clearTimeout);
  }, [query, target, reduced]);

  const resolved = query !== null && probe >= target;

  // Innermost scope first: a lookup starts local and walks outward.
  const render = (i: number) => {
    if (i < 0) return null;
    const tier = SKILLS[i];
    const searching = query !== null && probe === i && !resolved;
    const found = resolved && i === target;

    return (
      <div
        className="sc"
        role="group"
        aria-label={tier.label}
        data-scope={tier.tier}
        data-searching={searching || undefined}
        data-found={found || undefined}
        data-skipped={query !== null && probe > i && i !== target ? true : undefined}
      >
        <div className="sc-head">
          <h3 className="mono">
            <span className="t-kw" aria-hidden="true">scope</span>{' '}
            <span className="t-fn">{tier.scope}</span>
          </h3>
          <span className="sc-tier mono">{tier.label}</span>
          <span className="sc-count mono">{tier.items.length}</span>
        </div>

        <ul className="sc-items">
          {tier.items.map((s) => (
            <li key={s}>
              <button
                type="button"
                className="sc-item mono"
                data-hit={resolved && query === s ? true : undefined}
                onClick={() => setQuery(s)}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>

        {i > 0 && <div className="sc-nest">{render(i - 1)}</div>}
      </div>
    );
  };

  return (
    <div className="scope-chain">
      <div className="sc-trace mono" role="status" aria-live="polite">
        {query === null ? (
          <span className="t-com">// click any identifier to resolve it through the chain</span>
        ) : (
          <>
            <span className="t-fn">resolve</span>
            <span className="t-punc">(</span>
            <span className="t-str">'{query}'</span>
            <span className="t-punc">)</span>
            {SKILLS.map((t, i) =>
              probe >= i ? (
                <span className="sc-step" key={t.tier}>
                  <span className="t-punc">→</span> {t.scope}{' '}
                  {i === target ? (
                    <b className="sc-hit">found</b>
                  ) : (
                    <em className="t-com">not found</em>
                  )}
                </span>
              ) : null,
            )}
          </>
        )}
      </div>

      {/* Outermost scope wraps the ones nearer the lookup, so the nesting
          itself shows why a nearer scope is reached first. */}
      {render(SKILLS.length - 1)}
    </div>
  );
}
