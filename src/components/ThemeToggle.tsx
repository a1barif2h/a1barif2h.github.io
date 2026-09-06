import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button type="button" className="mono" onClick={toggle}>
      theme: {theme}
    </button>
  );
}
