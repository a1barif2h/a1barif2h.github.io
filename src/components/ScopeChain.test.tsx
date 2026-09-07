import { render, screen, within, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import { setMedia } from '../../vitest.setup';
import ScopeChain from './ScopeChain';

describe('ScopeChain', () => {
  it('nests the scopes so the outermost contains the ones nearer the lookup', () => {
    render(<ScopeChain />);
    const groups = screen.getAllByRole('group');
    expect(groups).toHaveLength(3);

    const [outer, middle, inner] = groups;
    expect(outer).toHaveAttribute('aria-label', 'Familiar');
    expect(middle).toHaveAttribute('aria-label', 'Comfortable');
    expect(inner).toHaveAttribute('aria-label', 'Proficient');

    // Containment is the whole point: a lookup reaches the inner scope first.
    expect(outer).toContainElement(middle);
    expect(middle).toContainElement(inner);
  });

  it('names the scope each tier corresponds to', () => {
    render(<ScopeChain />);
    expect(screen.getByText('local scope')).toBeInTheDocument();
    expect(screen.getByText('closure scope')).toBeInTheDocument();
    expect(screen.getByText('global scope')).toBeInTheDocument();
  });

  it('lists React under the proficient tier', () => {
    render(<ScopeChain />);
    const proficient = screen.getByRole('group', { name: 'Proficient' });
    expect(within(proficient).getByRole('button', { name: 'React' })).toBeInTheDocument();
  });
});

describe('ScopeChain lookup', () => {
  it('resolves an identifier in the scope that holds it', () => {
    setMedia({ '(prefers-reduced-motion: reduce)': true });
    render(<ScopeChain />);

    fireEvent.click(screen.getByRole('button', { name: 'Spring Boot' }));

    const comfortable = screen.getByRole('group', { name: 'Comfortable' });
    expect(comfortable).toHaveAttribute('data-found');
    expect(screen.getByRole('button', { name: 'Spring Boot' })).toHaveAttribute('data-hit');
    expect(screen.getByRole('status')).toHaveTextContent(/resolve\('Spring Boot'\)/);
  });

  it('walks outward one scope at a time, reporting each miss', () => {
    vi.useFakeTimers();
    setMedia({ '(prefers-reduced-motion: reduce)': false });
    render(<ScopeChain />);

    // Kubernetes lives in the outermost scope, so the walk passes two misses.
    fireEvent.click(screen.getByRole('button', { name: 'Kubernetes' }));

    expect(screen.getByRole('status')).toHaveTextContent(/local scope not found/);
    // Only the first scope has been probed so far.
    expect(screen.getByRole('status')).not.toHaveTextContent(/global scope/);

    act(() => { vi.advanceTimersByTime(420); });
    expect(screen.getByRole('status')).toHaveTextContent(/closure scope not found/);

    act(() => { vi.advanceTimersByTime(420); });
    expect(screen.getByRole('status')).toHaveTextContent(/global scope found/);
    expect(screen.getByRole('group', { name: 'Familiar' })).toHaveAttribute('data-found');

    vi.useRealTimers();
  });
});
