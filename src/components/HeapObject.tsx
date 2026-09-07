import { Fragment } from 'react';
import type { Project } from '../data/cv';

interface Props {
  project: Project;
  allocatedBy: string | null;
  active: boolean;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function HeapObject({ project, allocatedBy, active, registerRef }: Props) {
  return (
    <article
      className="obj"
      aria-label={project.name}
      data-active={active || undefined}
      ref={(el) => registerRef?.(project.id, el)}
    >
      <h3>{project.name}</h3>

      <p className="obj-meta mono">
        {project.kind}, {project.period}
      </p>

      <p className="obj-alloc mono">
        {allocatedBy
          ? `allocated by ${allocatedBy}`
          : 'independent client work, no allocating frame'}
      </p>

      <p className="obj-stack mono" data-testid="stack-literal">
        [
        {project.stack.map((s, i) => (
          <Fragment key={s}>
            <span className="obj-stack-item">{`'${s}'`}</span>
            {i < project.stack.length - 1 ? ', ' : ''}
          </Fragment>
        ))}
        ]
      </p>

      <ul className="obj-features">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
