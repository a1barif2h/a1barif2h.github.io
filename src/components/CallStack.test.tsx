import { render, screen, within } from '@testing-library/react';
import CallStack from './CallStack';

const noop = () => () => {};

describe('CallStack', () => {
  it('is an ordered list, because a stack is ordered', () => {
    render(<CallStack activeId={null} register={noop} />);
    expect(screen.getByRole('list', { name: /call stack/i }).tagName).toBe('OL');
  });

  it('renders frames newest first', () => {
    render(<CallStack activeId={null} register={noop} />);
    const frames = screen.getAllByTestId('stack-frame');
    expect(frames).toHaveLength(4);
    expect(within(frames[0]).getByText('Penta Global Limited')).toBeInTheDocument();
    expect(within(frames[3]).getByText('Virtuera')).toBeInTheDocument();
  });

  it('marks exactly one frame as executing', () => {
    render(<CallStack activeId={null} register={noop} />);
    expect(screen.getAllByText(/executing/i)).toHaveLength(1);
  });

  it('labels the executing frame in text, not only in colour', () => {
    render(<CallStack activeId={null} register={noop} />);
    const frames = screen.getAllByTestId('stack-frame');
    expect(within(frames[0]).getByText(/executing/i)).toBeInTheDocument();
  });

  it('assigns increasing depth so frames recede tonally', () => {
    render(<CallStack activeId={null} register={noop} />);
    const frames = screen.getAllByTestId('stack-frame');
    expect(frames[0]).toHaveAttribute('data-depth', '0');
    expect(frames[3]).toHaveAttribute('data-depth', '3');
  });

  it('shows both Penta roles with the Feb 2024 transition', () => {
    render(<CallStack activeId={null} register={noop} />);
    const penta = screen.getAllByTestId('stack-frame')[0];
    expect(within(penta).getByText(/Frontend Web Developer/)).toBeInTheDocument();
    expect(within(penta).getByText(/Full Stack Engineer/)).toBeInTheDocument();
    expect(within(penta).getAllByText(/2024-02/)).toHaveLength(2);
  });

  it('states commitment and mode for each frame', () => {
    render(<CallStack activeId={null} register={noop} />);
    const virtuera = screen.getAllByTestId('stack-frame')[3];
    expect(within(virtuera).getByText(/part-time/)).toBeInTheDocument();
    expect(within(virtuera).getByText(/remote/)).toBeInTheDocument();
  });
});
