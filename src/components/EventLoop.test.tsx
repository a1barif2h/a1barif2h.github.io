import { render, screen } from '@testing-library/react';
import { setMedia } from '../../vitest.setup';
import EventLoop from './EventLoop';

const REDUCE = '(prefers-reduced-motion: reduce)';

describe('EventLoop', () => {
  it('ticks when motion is allowed', () => {
    setMedia({ [REDUCE]: false });
    render(<EventLoop />);
    expect(screen.getByTestId('tick')).toHaveAttribute('data-running', 'true');
  });

  it('stops ticking under reduced motion', () => {
    setMedia({ [REDUCE]: true });
    render(<EventLoop />);
    expect(screen.getByTestId('tick')).not.toHaveAttribute('data-running');
  });
});
