import { render, screen, within } from '@testing-library/react';
import ParallelRegion from './ParallelRegion';

describe('ParallelRegion', () => {
  it('renders one lane per settled early role', () => {
    render(<ParallelRegion />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
  });

  it('reports the derived peak concurrency rather than a written number', () => {
    render(<ParallelRegion />);
    expect(screen.getByText(/three at once/i)).toBeInTheDocument();
  });

  it('distinguishes part-time lanes from full-time ones', () => {
    render(<ParallelRegion />);
    const lanes = screen.getAllByRole('listitem');
    const virtuera = lanes.find((l) => within(l).queryByText('Virtuera'))!;
    const cogniable = lanes.find((l) => within(l).queryByText('CogniAble'))!;
    expect(virtuera).toHaveAttribute('data-commitment', 'part-time');
    expect(cogniable).toHaveAttribute('data-commitment', 'full-time');
  });

  it('positions each lane along the shared axis', () => {
    render(<ParallelRegion />);
    const virtuera = screen
      .getAllByRole('listitem')
      .find((l) => within(l).queryByText('Virtuera'))!;
    const bar = within(virtuera).getByTestId('lane-bar');
    expect(bar.style.left).toBe('0%');
    expect(parseFloat(bar.style.width)).toBeGreaterThan(0);
  });

  it('gives each lane an accessible period description', () => {
    render(<ParallelRegion />);
    expect(screen.getByText(/2020-12 to 2021-04/)).toBeInTheDocument();
  });

  it('marks the ongoing role as open-ended so its clipped bar is not read as a terminus', () => {
    render(<ParallelRegion />);
    const lanes = screen.getAllByRole('listitem');
    const penta = lanes.find((l) => within(l).queryByText('Penta Global Limited'))!;
    const hwsaver = lanes.find((l) => within(l).queryByText('HW Saver LLP'))!;
    expect(penta).toHaveAttribute('data-open');
    expect(hwsaver).not.toHaveAttribute('data-open');
  });
});
