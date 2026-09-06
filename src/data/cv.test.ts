import { EMPLOYMENT, PROJECTS, SKILLS, REFERENCES, IDENTITY } from './cv';

describe('employment data', () => {
  it('is ordered newest first by start date', () => {
    const starts = EMPLOYMENT.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('gives every employment a non-empty roles list', () => {
    for (const e of EMPLOYMENT) {
      expect(e.roles.length).toBeGreaterThan(0);
    }
  });

  it('has roles that tile the employment span with no gap or overlap', () => {
    for (const e of EMPLOYMENT) {
      expect(e.roles[0].start).toBe(e.start);
      expect(e.roles[e.roles.length - 1].end).toBe(e.end);
      for (let i = 1; i < e.roles.length; i++) {
        expect(e.roles[i].start).toBe(e.roles[i - 1].end);
      }
    }
  });

  it('records Penta as a promotion from frontend to full stack in Feb 2024', () => {
    const penta = EMPLOYMENT.find((e) => e.id === 'penta')!;
    expect(penta.roles).toEqual([
      { title: 'Frontend Web Developer', start: '2021-09', end: '2024-02' },
      { title: 'Full Stack Engineer', start: '2024-02', end: null },
    ]);
  });

  it('marks the two internships as part-time and the two others as full-time', () => {
    const byId = Object.fromEntries(EMPLOYMENT.map((e) => [e.id, e]));
    expect(byId.virtuera.commitment).toBe('part-time');
    expect(byId.hwsaver.commitment).toBe('part-time');
    expect(byId.cogniable.commitment).toBe('full-time');
    expect(byId.penta.commitment).toBe('full-time');
  });

  it('includes Virtuera, which the CV omits', () => {
    expect(EMPLOYMENT.map((e) => e.id)).toContain('virtuera');
  });
});

describe('project data', () => {
  it('never dangles: every employmentId resolves to a real employment', () => {
    const ids = new Set(EMPLOYMENT.map((e) => e.id));
    for (const p of PROJECTS) {
      if (p.employmentId !== null) expect(ids).toContain(p.employmentId);
    }
  });

  it('gives every project at least one stack entry and one feature', () => {
    for (const p of PROJECTS) {
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThan(0);
    }
  });
});

describe('skills and references', () => {
  it('has exactly the three tiers in resolution order', () => {
    expect(SKILLS.map((s) => s.tier)).toEqual([
      'proficient',
      'comfortable',
      'familiar',
    ]);
  });

  it('gives each referee a distinct email address', () => {
    const emails = REFERENCES.map((r) => r.email);
    expect(new Set(emails).size).toBe(emails.length);
  });
});

describe('identity', () => {
  it('does not advertise the dead Firebase portfolio URL', () => {
    expect(JSON.stringify(IDENTITY)).not.toContain('web.app');
  });
});
