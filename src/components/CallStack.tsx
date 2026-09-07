import { EMPLOYMENT } from '../data/cv';
import StackFrame from './StackFrame';

interface Props {
  activeId: string | null;
  register: (id: string) => (el: HTMLElement | null) => void;
}

export default function CallStack({ activeId, register }: Props) {
  return (
    <ol className="stack" aria-label="Call stack">
      {EMPLOYMENT.map((e, i) => (
        <StackFrame
          key={e.id}
          employment={e}
          depth={i}
          executing={e.end === null}
          active={activeId === e.id}
          innerRef={register(e.id)}
        />
      ))}
    </ol>
  );
}
