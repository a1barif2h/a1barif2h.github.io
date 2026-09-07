import './PointerLayer.css';

export interface Edge {
  from: DOMRect;
  to: DOMRect;
}

interface Props {
  edges: Edge[];
  containerRect: DOMRect | null;
}

export default function PointerLayer({ edges, containerRect }: Props) {
  if (!containerRect || edges.length === 0) return null;

  const path = (e: Edge) => {
    const x1 = e.from.right - containerRect.left;
    const y1 = e.from.top + e.from.height / 2 - containerRect.top;
    const x2 = e.to.left - containerRect.left;
    const y2 = e.to.top + e.to.height / 2 - containerRect.top;
    const mid = x1 + (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
  };

  return (
    <svg
      className="pointers"
      data-testid="pointer-layer"
      aria-hidden="true"
      width={containerRect.width}
      height={containerRect.height}
      viewBox={`0 0 ${containerRect.width} ${containerRect.height}`}
    >
      {edges.map((e, i) => (
        <path key={i} d={path(e)} fill="none" />
      ))}
    </svg>
  );
}
