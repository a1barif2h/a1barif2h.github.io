import type { CSSProperties } from 'react';
import { SKILLS } from '../data/cv';
import './ScopeChain.css';

export default function ScopeChain() {
  return (
    <section aria-labelledby="scope-heading">
      <h2 id="scope-heading">Scope chain</h2>
      <p className="scope-note">
        Resolution proceeds outward. Nearer scopes are reached faster.
      </p>

      <div className="scopes">
        {SKILLS.map((tier, i) => (
          <div
            key={tier.tier}
            role="group"
            aria-label={tier.label}
            className="scope"
            style={{ '--depth': String(i) } as CSSProperties}
          >
            <div className="scope-head">
              <h3>{tier.label}</h3>
              <span className="mono scope-kind">{tier.scope}</span>
            </div>
            <ul className="scope-items">
              {tier.items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
