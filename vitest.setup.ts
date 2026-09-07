import '@testing-library/jest-dom/vitest';
import { vi, beforeEach } from 'vitest';

export function setMedia(matches: Record<string, boolean>) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: matches[query] ?? false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
  constructor(_cb: IntersectionObserverCallback, _opts?: IntersectionObserverInit) {}
}

beforeEach(() => {
  setMedia({});
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});
