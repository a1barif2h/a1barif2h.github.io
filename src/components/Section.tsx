import type { ReactNode } from 'react';
import './Section.css';

interface Props {
  id: string;
  fn: string;
  title: string;
  note: string;
  children: ReactNode;
}

/**
 * Every section is a function declaration. The fold caret, brace and closing
 * `}` are what make the page read as source rather than as a document with
 * programming words in the headings.
 */
export default function Section({ id, fn, title, note, children }: Props) {
  return (
    <section className="fn-block" id={id} aria-labelledby={`${id}-h`}>
      <h2 className="fn-sig mono" id={`${id}-h`}>
        <span aria-hidden="true">
          <span className="fn-caret">▾</span>
          <span className="t-kw">function</span>{' '}
          <span className="t-fn">{fn}</span><span className="t-punc">()</span>{' '}
          <span className="t-punc">{'{'}</span>
          <span className="fn-note t-com">// {title} — {note}</span>
        </span>
        <span className="vh">{title}</span>
      </h2>

      <div className="fn-body">{children}</div>

      <p className="fn-close mono t-punc" aria-hidden="true">{'}'}</p>
    </section>
  );
}
