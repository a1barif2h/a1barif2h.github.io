import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { EMPLOYMENT } from '../data/cv';
import './StatusBar.css';

const TICK = 1100;

/**
 * The event loop, always running. Alternating macrotask/microtask ticks give
 * the page a resting pulse without demanding attention.
 */
export default function StatusBar({ activeId }: { activeId: string | null }) {
  const reduced = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK);
    return () => window.clearInterval(id);
  }, [reduced]);

  const frame = EMPLOYMENT.find((e) => e.id === activeId);
  const queue = tick % 2 === 0 ? 'macrotask' : 'microtask';

  return (
    <footer className="status mono" data-testid="status-bar">
      <span className="status-cell status-loop">
        <span className="status-pulse" aria-hidden="true" />
        event loop
        <span className="t-com">·</span>
        <span className="t-num">{queue}</span>
      </span>

      <span className="status-cell status-exec">
        <span className="t-kw">executing</span>{' '}
        <span className="t-fn">{frame ? `${frame.id}()` : 'global'}</span>
      </span>

      <span className="status-cell status-hint">
        <span className="t-com">// scroll to execute · click a frame to jump</span>
      </span>

      <span className="status-cell status-right">
        <span className="t-com">utf-8</span>
        <span className="t-com">js</span>
      </span>
    </footer>
  );
}
