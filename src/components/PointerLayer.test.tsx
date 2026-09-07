import { render, screen } from '@testing-library/react';
import PointerLayer from './PointerLayer';

const rect = (x: number, y: number, w = 100, h = 40) =>
  ({ x, y, width: w, height: h, top: y, left: x, right: x + w, bottom: y + h } as DOMRect);

describe('PointerLayer', () => {
  it('renders nothing when there are no edges', () => {
    const { container } = render(<PointerLayer edges={[]} containerRect={rect(0, 0, 800, 600)} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('draws one path per edge', () => {
    render(
      <PointerLayer
        edges={[
          { from: rect(0, 0), to: rect(400, 200) },
          { from: rect(0, 0), to: rect(400, 300) },
        ]}
        containerRect={rect(0, 0, 800, 600)}
      />,
    );
    expect(screen.getByTestId('pointer-layer').querySelectorAll('path')).toHaveLength(2);
  });

  it('is hidden from assistive technology, since the relationship is also in text', () => {
    render(
      <PointerLayer edges={[{ from: rect(0, 0), to: rect(400, 200) }]} containerRect={rect(0, 0, 800, 600)} />,
    );
    expect(screen.getByTestId('pointer-layer')).toHaveAttribute('aria-hidden', 'true');
  });

  it('positions coordinates relative to the container, not the viewport', () => {
    render(
      <PointerLayer
        edges={[{ from: rect(100, 100), to: rect(500, 300) }]}
        containerRect={rect(50, 50, 800, 600)}
      />,
    );
    const d = screen.getByTestId('pointer-layer').querySelector('path')!.getAttribute('d')!;
    expect(d.startsWith('M 150 70')).toBe(true);
  });
});
