import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const QUERY = '(prefers-color-scheme: dark)';

function systemTheme(): Theme {
  return window.matchMedia(QUERY).matches ? 'dark' : 'light';
}

export function useTheme() {
  const [explicit, setExplicit] = useState<Theme | null>(null);
  const [system, setSystem] = useState<Theme>(() => systemTheme());

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setSystem(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme: Theme = explicit ?? system;

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setExplicit(next);
    document.documentElement.setAttribute('data-theme', next);
  }, [theme]);

  return { theme, explicit: explicit !== null, toggle };
}
