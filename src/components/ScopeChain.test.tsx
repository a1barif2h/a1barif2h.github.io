import { render, screen, within } from '@testing-library/react';
import ScopeChain from './ScopeChain';

describe('ScopeChain', () => {
  it('renders the three tiers in resolution order', () => {
    render(<ScopeChain />);
    const groups = screen.getAllByRole('group');
    expect(within(groups[0]).getByText('Proficient')).toBeInTheDocument();
    expect(within(groups[1]).getByText('Comfortable')).toBeInTheDocument();
    expect(within(groups[2]).getByText('Familiar')).toBeInTheDocument();
  });

  it('names the scope each tier corresponds to', () => {
    render(<ScopeChain />);
    expect(screen.getByText('local scope')).toBeInTheDocument();
    expect(screen.getByText('closure scope')).toBeInTheDocument();
    expect(screen.getByText('global scope')).toBeInTheDocument();
  });

  it('lists React under the proficient tier', () => {
    render(<ScopeChain />);
    const groups = screen.getAllByRole('group');
    expect(within(groups[0]).getByText('React')).toBeInTheDocument();
  });
});
