import { render, screen } from '@testing-library/react';
import Identity from './Identity';

describe('Identity', () => {
  it('renders the name as the single h1', () => {
    render(<Identity />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Mohammad Arif Hossain',
    );
  });

  it('states the derived experience headline, not a hard-coded one', () => {
    render(<Identity />);
    expect(screen.getByText(/5\+ years/)).toBeInTheDocument();
  });

  it('renders the portrait at its native size with alt text', () => {
    render(<Identity />);
    const img = screen.getByAltText(/Mohammad Arif Hossain/i) as HTMLImageElement;
    expect(img).toHaveAttribute('width', '210');
    expect(img).toHaveAttribute('height', '270');
  });

  it('offers the CV download', () => {
    render(<Identity />);
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      '/cv.pdf',
    );
  });

  it('links GitHub, LinkedIn and email', () => {
    render(<Identity />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/a1barif2h',
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/arifhossain80/',
    );
    expect(screen.getByRole('link', { name: /mohammadarifhossain80/i })).toHaveAttribute(
      'href',
      'mailto:mohammadarifhossain80@gmail.com',
    );
  });

  it('shows all content immediately, without waiting on the boot animation', () => {
    render(<Identity />);
    const shell = screen.getByTestId('global-context');
    expect(shell).toBeVisible();
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
