import { render, screen } from '@testing-library/react';
import References from './References';

describe('References', () => {
  it('lists both referees with their roles', () => {
    render(<References />);
    expect(screen.getByText('MD. Nazmul Huda')).toBeInTheDocument();
    expect(screen.getByText('A.K.M Ariful Islam Shimul')).toBeInTheDocument();
  });

  it('links each referee by LinkedIn rather than publishing an email address', () => {
    render(<References />);
    const links = screen.getAllByRole('link', { name: /linkedin/i });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', 'https://www.linkedin.com/in/md-nazmul-huda-prince/');
    expect(links[1]).toHaveAttribute('href', 'https://www.linkedin.com/in/arif18bari/');
    expect(document.querySelectorAll('a[href^="mailto:"]')).toHaveLength(0);
  });
});
