import { CV_URL, CV_FILE, IDENTITY } from '../data/cv';
import ThemeToggle from './ThemeToggle';
import './TitleBar.css';

export default function TitleBar({ dirty }: { dirty: boolean }) {
  return (
    <header className="bar" data-testid="titlebar">
      <div className="bar-lights" aria-hidden="true">
        <i /><i /><i />
      </div>

      <div className="bar-tabs" role="presentation">
        <span className="bar-tab is-active mono">
          arif.js{dirty ? <b className="bar-dot" aria-hidden="true" /> : null}
        </span>
        <span className="bar-tab mono">experience.log</span>
      </div>

      <div className="bar-actions">
        <ThemeToggle />
        <a className="bar-cv mono" href={CV_URL} download={CV_FILE}>
          <span aria-hidden="true">↓</span> CV.pdf
        </a>
        <a className="bar-ico mono" href={IDENTITY.github} aria-label="GitHub">GH</a>
        <a className="bar-ico mono" href={IDENTITY.linkedin} aria-label="LinkedIn">IN</a>
      </div>
    </header>
  );
}
