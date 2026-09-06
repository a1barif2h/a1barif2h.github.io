import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type BootPhase = 'creating' | 'pushed' | 'settled';

const PUSH_AT = 600;
const SETTLE_AT = 1400;

export function useBootSequence(): BootPhase {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<BootPhase>(() =>
    reduced ? 'settled' : 'creating',
  );

  useEffect(() => {
    if (reduced) {
      setPhase('settled');
      return;
    }
    const a = window.setTimeout(() => setPhase('pushed'), PUSH_AT);
    const b = window.setTimeout(() => setPhase('settled'), SETTLE_AT);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [reduced]);

  return phase;
}
