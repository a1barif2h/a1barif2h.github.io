import { render, screen } from '@testing-library/react';
import References from './References';

describe('References', () => {
  it('lists both referees with mailto links', () => {
    render(<References />);
    expect(screen.getByRole('link', { name: 'nazmulfarhan@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:nazmulfarhan@gmail.com',
    );
    expect(screen.getByRole('link', { name: 'arif18bari@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:arif18bari@gmail.com',
    );
  });

  it('gives each referee a distinct email', () => {
    render(<References />);
    const links = screen.getAllByRole('link', { name: /@gmail\.com$/ });
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});
