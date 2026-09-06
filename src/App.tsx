import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Identity from './components/Identity';
import CallStack from './components/CallStack';
import ParallelRegion from './components/ParallelRegion';
import Heap from './components/Heap';
import ScopeChain from './components/ScopeChain';
import ModuleResolution from './components/ModuleResolution';
import References from './components/References';
import InstrumentRail from './components/InstrumentRail';
import PointerLayer, { type Edge } from './components/PointerLayer';
import { EMPLOYMENT, PROJECTS } from './data/cv';
import './App.css';

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null);

  const shell = useRef<HTMLDivElement>(null);
  const frameEls = useRef(new Map<string, HTMLElement>());
  const objectEls = useRef(new Map<string, HTMLElement>());

  const registerObject = useCallback((id: string, el: HTMLElement | null) => {
    if (el) objectEls.current.set(id, el);
    else objectEls.current.delete(id);
  }, []);

  const recompute = useCallback(() => {
    if (!shell.current || activeId === null) {
      setEdges([]);
      return;
    }
    const from = frameEls.current.get(activeId);
    if (!from) {
      setEdges([]);
      return;
    }
    const next: Edge[] = PROJECTS.filter((p) => p.employmentId === activeId)
      .map((p) => objectEls.current.get(p.id))
      .filter((el): el is HTMLElement => Boolean(el))
      .map((el) => ({ from: from.getBoundingClientRect(), to: el.getBoundingClientRect() }));

    setContainerRect(shell.current.getBoundingClientRect());
    setEdges(next);
  }, [activeId]);

  useLayoutEffect(() => {
    recompute();
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [recompute]);

  const handleActivate = useCallback((id: string | null) => setActiveId(id), []);

  return (
    <div className="page">
      <InstrumentRail activeEmploymentId={activeId} />

      <main className="content" ref={shell}>
        <Identity />
        <PointerLayer edges={edges} containerRect={containerRect} />

        <div
          ref={(el) => {
            if (!el) {
              frameEls.current.clear();
              return;
            }
            const ids = EMPLOYMENT.map((e) => e.id);
            el.querySelectorAll<HTMLElement>('.frame').forEach((frameEl, i) => {
              const id = ids[i];
              if (id) frameEls.current.set(id, frameEl);
            });
          }}
        >
          <CallStack onActivate={handleActivate} />
        </div>

        <ParallelRegion />
        <Heap activeEmploymentId={activeId} registerRef={registerObject} />
        <ScopeChain />
        <ModuleResolution />
        <References />
      </main>
    </div>
  );
}
