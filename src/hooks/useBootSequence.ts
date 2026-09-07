import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type BootPhase = 'creating' | 'pushing' | 'settled';

export interface BootState {
  phase: BootPhase;
  /** Frames currently on the stack, pushed oldest-first. */
  pushed: number;
}

const FIRST_PUSH = 260;
const PER_FRAME = 230;

/**
 * Drives the cold start: the global context is created, then one frame is
 * pushed per employment, oldest first, so the stack builds the way a real
 * one does. Reduced motion lands on the settled state immediately.
 */
export function useBootSequence(frames: number): BootState {
  const reduced = useReducedMotion();
  const [state, setState] = useState<BootState>(() =>
    reduced ? { phase: 'settled', pushed: frames } : { phase: 'creating', pushed: 0 },
  );

  useEffect(() => {
    if (reduced) {
      setState({ phase: 'settled', pushed: frames });
      return;
    }

    const timers: number[] = [];
    for (let i = 1; i <= frames; i += 1) {
      timers.push(
        window.setTimeout(
          () => setState({ phase: 'pushing', pushed: i }),
          FIRST_PUSH + (i - 1) * PER_FRAME,
        ),
      );
    }
    timers.push(
      window.setTimeout(
        () => setState({ phase: 'settled', pushed: frames }),
        FIRST_PUSH + frames * PER_FRAME,
      ),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [reduced, frames]);

  return state;
}
