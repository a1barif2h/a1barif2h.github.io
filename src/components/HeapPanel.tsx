import { PROJECTS } from '../data/cv';
import { addr } from '../lib/addr';

/** Heap objects, with the active frame's allocations lit. */
export default function HeapPanel({ activeId }: { activeId: string | null }) {
  return (
    <section className="panel" aria-labelledby="p-heap">
      <h2 className="panel-h mono" id="p-heap">
        Heap
        <span className="panel-n mono">{PROJECTS.length}</span>
      </h2>

      <ul className="objs mono" data-testid="heap-panel">
        {PROJECTS.map((p) => {
          const own = activeId !== null && p.employmentId === activeId;
          return (
            <li key={p.id}>
              <a className="obj-row" href={`#obj-${p.id}`} data-own={own || undefined}>
                <span className="obj-addr t-num">{addr(p.id)}</span>
                <span className="obj-name">{p.id}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
