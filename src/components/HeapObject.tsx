import { Fragment } from 'react';
import type { Project } from '../data/cv';
import { addr } from '../lib/addr';

interface Props {
  project: Project;
  allocatedBy: string | null;
  allocatorId: string | null;
  active: boolean;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function HeapObject({
  project, allocatedBy, allocatorId, active, registerRef,
}: Props) {
  return (
    <article
      className="obj"
      id={`obj-${project.id}`}
      aria-label={project.name}
      data-active={active || undefined}
      ref={(el) => registerRef?.(project.id, el)}
    >
      <p className="obj-addr-line mono">
        <span className="t-num">{addr(project.id)}</span>
        <span className="t-com">{project.kind.toLowerCase()}</span>
        <span className="obj-period t-com">{project.period}</span>
      </p>

      <h3>{project.name}</h3>

      <p className="obj-alloc mono">
        <span className="t-prop">allocatedBy</span>
        <span className="t-punc">:</span>{' '}
        {allocatorId ? (
          <a className="t-fn obj-alloc-link" href={`#frame-${allocatorId}`}>
            {allocatorId}()
          </a>
        ) : (
          <span className="t-kw">null</span>
        )}
        {allocatedBy && <span className="t-com"> // {allocatedBy}</span>}
      </p>

      <p className="obj-stack mono" data-testid="stack-literal">
        <span className="t-prop">stack</span><span className="t-punc">: [</span>
        {project.stack.map((s, i) => (
          <Fragment key={s}>
            <span className="obj-stack-item t-str">{`'${s}'`}</span>
            {i < project.stack.length - 1 ? <span className="t-punc">, </span> : null}
          </Fragment>
        ))}
        <span className="t-punc">]</span>
      </p>

      <ul className="obj-features">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
