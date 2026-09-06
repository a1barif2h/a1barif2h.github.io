import { EMPLOYMENT } from '../data/cv';
import EventLoop from './EventLoop';
import ThemeToggle from './ThemeToggle';
import './InstrumentRail.css';

interface Props {
  activeEmploymentId: string | null;
}

export default function InstrumentRail({ activeEmploymentId }: Props) {
  const active = EMPLOYMENT.find((e) => e.id === activeEmploymentId);

  return (
    <aside className="rail" aria-label="Runtime state">
      <dl className="rail-readout mono">
        <dt>stack depth</dt>
        <dd>{EMPLOYMENT.length}</dd>
        <dt>executing</dt>
        <dd>{EMPLOYMENT.find((e) => e.end === null)?.company ?? 'none'}</dd>
        <dt>selected frame</dt>
        <dd>{active ? active.company : 'none'}</dd>
      </dl>
      <EventLoop />
      <ThemeToggle />
    </aside>
  );
}
