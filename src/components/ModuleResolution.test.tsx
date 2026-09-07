import { render, screen } from '@testing-library/react';
import ModuleResolution from './ModuleResolution';

describe('ModuleResolution', () => {
  it('lists both education entries', () => {
    render(<ModuleResolution />);
    expect(screen.getByText(/Diploma in Computer Science/)).toBeInTheDocument();
    expect(screen.getByText(/Higher Secondary Certificate/)).toBeInTheDocument();
  });

  it('lists both credentials', () => {
    render(<ModuleResolution />);
    expect(screen.getByText('Certified Web Developer')).toBeInTheDocument();
    expect(screen.getByText('CSE Fundamentals')).toBeInTheDocument();
  });

  it('does not invent a name for the HSC institute', () => {
    render(<ModuleResolution />);
    expect(screen.queryByText(/University College/)).not.toBeInTheDocument();
  });
});
