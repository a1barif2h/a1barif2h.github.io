import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { setMedia } from '../../vitest.setup';
import { useBootSequence } from './useBootSequence';

const REDUCE = '(prefers-reduced-motion: reduce)';

describe('useBootSequence', () => {
  it('starts fully pushed and settled when reduced motion is requested', () => {
    setMedia({ [REDUCE]: true });
    const { result } = renderHook(() => useBootSequence(4));
    expect(result.current).toEqual({ phase: 'settled', pushed: 4 });
  });

  it('pushes one frame at a time, oldest first', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence(4));

    expect(result.current).toEqual({ phase: 'creating', pushed: 0 });

    act(() => { vi.advanceTimersByTime(260); });
    expect(result.current).toEqual({ phase: 'pushing', pushed: 1 });

    act(() => { vi.advanceTimersByTime(230); });
    expect(result.current).toEqual({ phase: 'pushing', pushed: 2 });

    vi.useRealTimers();
  });

  it('settles within the 1.5s budget with every frame on the stack', () => {
    vi.useFakeTimers();
    setMedia({ [REDUCE]: false });
    const { result } = renderHook(() => useBootSequence(4));
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toEqual({ phase: 'settled', pushed: 4 });
    vi.useRealTimers();
  });
});
