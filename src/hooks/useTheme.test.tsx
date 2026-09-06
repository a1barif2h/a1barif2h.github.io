import { renderHook, act } from '@testing-library/react';
import { setMedia } from '../../vitest.setup';
import { useTheme } from './useTheme';

const DARK = '(prefers-color-scheme: dark)';

beforeEach(() => {
  document.documentElement.removeAttribute('data-theme');
});

describe('useTheme', () => {
  it('follows the system preference when nothing is stamped', () => {
    setMedia({ [DARK]: true });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(result.current.explicit).toBe(false);
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('reports light when the system prefers light', () => {
    setMedia({ [DARK]: false });
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('stamps the opposite theme on toggle, overriding the system', () => {
    setMedia({ [DARK]: true });
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(result.current.theme).toBe('light');
    expect(result.current.explicit).toBe(true);
  });

  it('toggles back to dark from an explicit light', () => {
    setMedia({ [DARK]: false });
    const { result } = renderHook(() => useTheme());
    act(() => result.current.toggle());
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
