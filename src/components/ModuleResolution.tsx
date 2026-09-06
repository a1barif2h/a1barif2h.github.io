import { EDUCATION, CREDENTIALS } from '../data/cv';
import './Listing.css';

export default function ModuleResolution() {
  return (
    <section aria-labelledby="modules-heading">
      <h2 id="modules-heading">Module resolution</h2>
      <p className="listing-note">Resolved before execution began.</p>

      <div className="listing">
        {EDUCATION.map((e) => (
          <div key={e.qualification} className="entry">
            <h3>{e.qualification}</h3>
            <p className="entry-sub">{e.institute}</p>
            <ul className="entry-detail mono">
              {e.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
        {CREDENTIALS.map((c) => (
          <div key={c.title} className="entry">
            <h3>{c.title}</h3>
            <p className="entry-sub">{c.institute}</p>
            <ul className="entry-detail mono">
              {c.detail.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
