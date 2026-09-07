import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the subject name as the page heading', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Mohammad Arif Hossain/i }),
    ).toBeInTheDocument();
  });

  it('has exactly one h1', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('never skips a heading level', () => {
    render(<App />);
    const levels = screen
      .getAllByRole('heading')
      .map((h) => Number(h.tagName[1]));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it('presents the sections in recruiter reading order', () => {
    render(<App />);
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(h2s).toEqual([
      'Call stack',
      'Parallel region, settled',
      'Heap',
      'Scope chain',
      'Module resolution',
      'References',
    ]);
  });

  it('offers a theme toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });
});
