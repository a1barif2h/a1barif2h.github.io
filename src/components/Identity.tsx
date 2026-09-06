import portrait from '../assets/portrait.webp';
import { IDENTITY, CV_URL, EMPLOYMENT } from '../data/cv';
import { spansOf, experienceHeadline } from '../lib/timeline';
import { useBootSequence } from '../hooks/useBootSequence';
import './Identity.css';

export default function Identity() {
  const phase = useBootSequence();
  const headline = experienceHeadline(spansOf(EMPLOYMENT), new Date());

  return (
    <header
      className="ctx"
      data-testid="global-context"
      data-phase={phase}
      aria-label="Global execution context"
    >
      <p className="ctx-label mono">global execution context</p>

      <div className="ctx-body">
        <img
          className="ctx-portrait"
          src={portrait}
          width={210}
          height={270}
          alt="Mohammad Arif Hossain"
          decoding="async"
        />

        <div className="ctx-text">
          <h1>{IDENTITY.name}</h1>
          <p className="ctx-role mono">
            {IDENTITY.title}, {headline}, {IDENTITY.location}
          </p>
          <p className="ctx-summary">{IDENTITY.summary}</p>

          <nav className="ctx-links" aria-label="Contact">
            <a className="ctx-cv" href={CV_URL}>Download CV</a>
            <a href={IDENTITY.github}>GitHub</a>
            <a href={IDENTITY.linkedin}>LinkedIn</a>
            <a href={`mailto:${IDENTITY.email}`}>{IDENTITY.email}</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
