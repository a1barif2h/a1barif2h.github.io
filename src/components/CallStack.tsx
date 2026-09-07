import { EMPLOYMENT } from '../data/cv';
import StackFrame from './StackFrame';

interface Props {
  onActivate?: (id: string | null) => void;
}

export default function CallStack({ onActivate }: Props) {
  return (
    <section aria-labelledby="call-stack-heading">
      <h2 id="call-stack-heading">Call stack</h2>
      <ol className="stack" aria-label="Call stack" style={{ padding: 0, margin: 0 }}>
        {EMPLOYMENT.map((e, i) => (
          <StackFrame
            key={e.id}
            employment={e}
            depth={i}
            executing={e.end === null}
            onActivate={onActivate}
          />
        ))}
      </ol>
    </section>
  );
}
