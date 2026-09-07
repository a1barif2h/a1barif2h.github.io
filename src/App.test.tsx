import { render, screen, within } from '@testing-library/react';
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
    // The rail carries its own headings, so scope this to the document body.
    const names = within(screen.getByRole('main'))
      .getAllByRole('heading', { level: 2 })
      // The signature and comment are aria-hidden decoration; the
      // section's real name is the only text a screen reader reaches.
      .map((h) => h.querySelector('.vh')?.textContent);
    expect(names).toEqual([
      'Employment',
      'Overlap',
      'Projects',
      'Skills',
      'Education',
      'References',
    ]);
  });

  it('names each section for assistive tech without the code decoration', () => {
    render(<App />);
    expect(
      within(screen.getByRole('main')).getByRole('heading', { level: 2, name: 'Projects' }),
    ).toBeInTheDocument();
  });

  it('exposes the debugger rail with a live call stack and scope', () => {
    render(<App />);
    const rail = screen.getByRole('complementary', { name: /debugger/i });
    expect(within(rail).getByTestId('call-stack')).toBeInTheDocument();
    expect(within(rail).getByTestId('scope-panel')).toBeInTheDocument();
    expect(within(rail).getByTestId('heap-panel')).toBeInTheDocument();
  });

  it('reports what is executing in the status bar', () => {
    render(<App />);
    const status = screen.getByTestId('status-bar');
    expect(status).toHaveTextContent(/executing/i);
    expect(status).toHaveTextContent(/global/i);
  });

  it('offers a theme toggle', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });
});
