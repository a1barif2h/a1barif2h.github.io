import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { setMedia } from '../../vitest.setup';
import { useBootSequence } from './useBootSequence';

const REDUCE = '(prefers-reduced-motion: reduce)';

describe('useBootSequence', () => {
  it('starts settled when reduced motion is requested', () => {
    setMedia({ [REDUCE]: true });
    const { result } = renderHook(() => useBootSequence());
    expect(result.current).toBe('settled');
  });

  it('runs creating then pushed then settled otherwise', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence());

    expect(result.current).toBe('creating');
    act(() => { vi.advanceTimersByTime(600); });
    expect(result.current).toBe('pushed');
    act(() => { vi.advanceTimersByTime(800); });
    expect(result.current).toBe('settled');

    vi.useRealTimers();
  });

  it('settles within the 1.5s budget', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence());
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toBe('settled');
    vi.useRealTimers();
  });
});
