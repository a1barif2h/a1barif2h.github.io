import { PROJECTS, EMPLOYMENT } from '../data/cv';
import HeapObject from './HeapObject';
import './Heap.css';

interface Props {
  activeEmploymentId?: string | null;
  registerRef?: (id: string, el: HTMLElement | null) => void;
}

export default function Heap({ activeEmploymentId = null, registerRef }: Props) {
  const companyOf = (id: string | null) =>
    id === null ? null : (EMPLOYMENT.find((e) => e.id === id)?.company ?? null);

  return (
    <div className="heap">
      {PROJECTS.map((p) => (
        <HeapObject
          key={p.id}
          project={p}
          allocatedBy={companyOf(p.employmentId)}
          allocatorId={p.employmentId}
          active={activeEmploymentId !== null && p.employmentId === activeEmploymentId}
          registerRef={registerRef}
        />
      ))}
    </div>
  );
}
