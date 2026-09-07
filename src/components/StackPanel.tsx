import { EMPLOYMENT } from '../data/cv';

interface Props {
  pushed: number;
  activeId: string | null;
  onSelect: (id: string) => void;
}

/**
 * The call stack. EMPLOYMENT is newest-first, which is also top-of-stack
 * first, so it renders in order; frames arrive oldest-first during boot,
 * the way a real stack fills.
 */
export default function StackPanel({ pushed, activeId, onSelect }: Props) {
  const total = EMPLOYMENT.length;

  return (
    <section className="panel" aria-labelledby="p-stack">
      <h2 className="panel-h mono" id="p-stack">
        Call stack
        <span className="panel-n mono">{pushed}</span>
      </h2>

      <ol className="frames" data-testid="call-stack">
        {EMPLOYMENT.map((e, i) => {
          const depth = total - 1 - i;          // 0 = oldest, pushed first
          const on = pushed > depth;
          const active = activeId === e.id;
          return (
            <li key={e.id}>
              <button
                type="button"
                className="frame-row mono"
                data-on={on || undefined}
                data-active={active || undefined}
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(e.id)}
              >
                <span className="frame-caret" aria-hidden="true">{active ? '▸' : ' '}</span>
                <span className="frame-fn">{e.id}<span className="t-punc">()</span></span>
                <span className="frame-depth">⟨{i}⟩</span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="panel-note mono">
        <span className="t-com">// scroll to move the frame pointer</span>
      </p>
    </section>
  );
}
