import type { ReactNode } from 'react';
import portrait from '../assets/portrait.webp';
import { IDENTITY, EMPLOYMENT, PROJECTS, CV_URL, CV_FILE } from '../data/cv';
import { toMonths, yearsSince } from '../lib/timeline';
import './Hero.css';

function Line({ n, children }: { n: number; children?: ReactNode }) {
  return (
    <div className="ln" style={{ '--i': n } as React.CSSProperties}>
      <span className="ln-n" aria-hidden="true">{n}</span>
      <span className="ln-c">{children}</span>
    </div>
  );
}

export default function Hero() {
  const earliest = EMPLOYMENT.reduce(
    (min, e) => (toMonths(e.start) < toMonths(min) ? e.start : min),
    EMPLOYMENT[0].start,
  );
  const years = Math.floor(yearsSince(earliest, new Date()));

  return (
    <header className="hero" data-testid="global-context" aria-label="Global execution context">
      <div className="hero-src mono">
        <Line n={1}><span className="t-com">// global execution context — cold start</span></Line>
        <Line n={2} />
        <Line n={3}>
          <span className="t-kw">const</span> <span className="t-fn">arif</span>{' '}
          <span className="t-punc">=</span> <span className="t-punc">{'{'}</span>
        </Line>

        <Line n={4}>
          <span className="ln-in">
            <span className="t-prop">name</span><span className="t-punc">:</span>{' '}
            <h1 className="hero-name t-str">
              <span className="t-punc hero-q">'</span>{IDENTITY.name}<span className="t-punc hero-q">'</span>
            </h1><span className="t-punc">,</span>
          </span>
        </Line>

        <Line n={5}>
          <span className="ln-in">
            <span className="t-prop">role</span><span className="t-punc">:</span>{' '}
            <span className="hero-role t-str">'{IDENTITY.title}'</span><span className="t-punc">,</span>
          </span>
        </Line>
        <Line n={6}>
          <span className="ln-in">
            <span className="t-prop">experience</span><span className="t-punc">:</span>{' '}
            <span className="t-num">{years}</span><span className="t-punc">,</span>{' '}
            <span className="t-com">// years, since {earliest}</span>
          </span>
        </Line>
        <Line n={7}>
          <span className="ln-in">
            <span className="t-prop">based</span><span className="t-punc">:</span>{' '}
            <span className="t-str">'{IDENTITY.location}'</span><span className="t-punc">,</span>
          </span>
        </Line>
        <Line n={8}>
          <span className="ln-in">
            <span className="t-prop">frames</span><span className="t-punc">:</span>{' '}
            <span className="t-num">{EMPLOYMENT.length}</span><span className="t-punc">,</span>{' '}
            <span className="t-prop">heap</span><span className="t-punc">:</span>{' '}
            <span className="t-num">{PROJECTS.length}</span><span className="t-punc">,</span>
          </span>
        </Line>
        <Line n={9}><span className="t-punc">{'};'}</span></Line>
        <Line n={10} />
        <Line n={11}>
          <span className="t-fn">arif</span><span className="t-punc">.</span>
          <span className="t-fn">run</span><span className="t-punc">();</span>
          <span className="hero-caret" aria-hidden="true" />
        </Line>

      </div>

      <div className="hero-out" style={{ '--i': 12 } as React.CSSProperties}>
        <p className="hero-summary">{IDENTITY.summary}</p>
        <nav className="hero-cta" aria-label="Contact">
          <a className="cta cta-1" href={CV_URL} download={CV_FILE}>Download CV</a>
          <a className="cta" href={`mailto:${IDENTITY.email}`}>Email</a>
          <a className="cta" href={IDENTITY.github}>GitHub</a>
          <a className="cta" href={IDENTITY.linkedin}>LinkedIn</a>
        </nav>
      </div>

      <aside className="hero-inspect" aria-label="Object inspector">
        <p className="inspect-h mono">
          <span className="t-com">▾</span> arif <span className="t-punc">{'{'}</span>…<span className="t-punc">{'}'}</span>
        </p>
        <img
          className="inspect-img"
          src={portrait}
          width={210}
          height={270}
          alt="Mohammad Arif Hossain"
          fetchPriority="high"
          decoding="async"
        />
        <dl className="inspect-props mono">
          <div><dt className="t-prop">[[type]]</dt><dd className="t-str">'Engineer'</dd></div>
          <div><dt className="t-prop">[[since]]</dt><dd className="t-str">'{earliest}'</dd></div>
          <div><dt className="t-prop">[[state]]</dt><dd className="t-fn">running</dd></div>
        </dl>
      </aside>
    </header>
  );
}
