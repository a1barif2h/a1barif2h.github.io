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

      <p className="obj-stack mono scroll-x" data-testid="stack-literal" tabIndex={0}>
        [{project.stack.map((s) => `'${s}'`).join(', ')}]
      </p>

      <ul className="obj-features">
        {project.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
    </article>
  );
}
