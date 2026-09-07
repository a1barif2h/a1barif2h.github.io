import { render, screen, within } from '@testing-library/react';
import Heap from './Heap';

describe('Heap', () => {
  it('renders one object per project', () => {
    render(<Heap />);
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('renders the stack as an array literal, not a middle-dot string', () => {
    render(<Heap />);
    const beza = screen.getByRole('article', { name: /BEZA One Stop Service/i });
    const stack = within(beza).getByTestId('stack-literal');
    expect(stack.textContent).toMatch(/^\['React', 'Redux'/);
    expect(stack.textContent).not.toContain('·');
  });

  it('names the allocating employer in text so the link survives without JS', () => {
    render(<Heap />);
    const beza = screen.getByRole('article', { name: /BEZA One Stop Service/i });
    expect(within(beza).getByText(/Penta Global Limited/)).toBeInTheDocument();
  });

  it('marks the independent client project as having no allocating frame', () => {
    render(<Heap />);
    const badlao = screen.getByRole('article', { name: /Badlao/i });
    expect(within(badlao).getByText(/independent client/i)).toBeInTheDocument();
  });

  it('highlights only the objects allocated by the active frame', () => {
    render(<Heap activeEmploymentId="penta" />);
    expect(screen.getByRole('article', { name: /BEZA/i })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('article', { name: /Badlao/i })).not.toHaveAttribute('data-active');
  });
});
