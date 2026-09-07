import { useReducedMotion } from '../hooks/useReducedMotion';
import './EventLoop.css';

export default function EventLoop() {
  const reduced = useReducedMotion();
  return (
    <p className="loop mono">
      <span className="loop-dot" data-testid="tick" data-running={!reduced || undefined} />
      event loop, idle
    </p>
  );
}
