import { REFERENCES } from '../data/cv';
import './Listing.css';

export default function References() {
  return (
    <section aria-labelledby="refs-heading">
      <h2 id="refs-heading">References</h2>
      <div className="listing">
        {REFERENCES.map((r) => (
          <div key={r.linkedin} className="entry">
            <h3>{r.name}</h3>
            <p className="entry-sub">
              {r.position}, {r.company}
            </p>
            <ul className="entry-detail mono">
              <li>
                <a href={r.linkedin}>LinkedIn profile</a>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
