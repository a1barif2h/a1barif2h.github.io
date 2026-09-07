import { useCallback } from 'react';
import TitleBar from './components/TitleBar';
import Hero from './components/Hero';
import Section from './components/Section';
import CallStack from './components/CallStack';
import ParallelRegion from './components/ParallelRegion';
import Heap from './components/Heap';
import ScopeChain from './components/ScopeChain';
import ModuleResolution from './components/ModuleResolution';
import References from './components/References';
import StackPanel from './components/StackPanel';
import ScopePanel from './components/ScopePanel';
import HeapPanel from './components/HeapPanel';
import StatusBar from './components/StatusBar';
import { useActiveFrame } from './hooks/useActiveFrame';
import { useBootSequence } from './hooks/useBootSequence';
import { EMPLOYMENT } from './data/cv';
import './components/Rail.css';
import './App.css';

const FRAME_IDS = EMPLOYMENT.map((e) => e.id);

export default function App() {
  const [activeId, register] = useActiveFrame(FRAME_IDS);
  const boot = useBootSequence(EMPLOYMENT.length);

  // Selecting a frame in the rail scrolls to it; the observer then picks it
  // up, so there is only ever one source of truth for what is executing.
  const jumpTo = useCallback((id: string) => {
    document.getElementById(`frame-${id}`)?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div className="ide">
      <TitleBar dirty={boot.phase !== 'settled'} />

      <div className="ide-body">
        <aside className="rail" aria-label="Debugger">
          <StackPanel pushed={boot.pushed} activeId={activeId} onSelect={jumpTo} />
          <ScopePanel activeId={activeId} />
          <HeapPanel activeId={activeId} />
        </aside>

        <main className="pane">
          <Hero />

          <Section
            id="stack"
            fn="callStack"
            title="Employment"
            note="four frames, newest on top"
          >
            <CallStack activeId={activeId} register={register} />
          </Section>

          <Section
            id="parallel"
            fn="parallelRegion"
            title="Overlap"
            note="two internships and a first full-time role, concurrently"
          >
            <ParallelRegion />
          </Section>

          <Section
            id="heap"
            fn="allocate"
            title="Projects"
            note="objects these frames allocated"
          >
            <Heap activeEmploymentId={activeId} />
          </Section>

          <Section
            id="scope"
            fn="resolve"
            title="Skills"
            note="lookup proceeds outward — click any identifier"
          >
            <ScopeChain />
          </Section>

          <Section
            id="modules"
            fn="require"
            title="Education"
            note="resolved before execution began"
          >
            <ModuleResolution />
          </Section>

          <Section id="refs" fn="references" title="References" note="held elsewhere">
            <References />
          </Section>
        </main>
      </div>

      <StatusBar activeId={activeId} />
    </div>
  );
}
