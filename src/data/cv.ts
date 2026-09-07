export const NOW = '2026-09';
/* The saved filename, not just the path: `cv.pdf` in a stranger's Downloads
   folder says nothing about whose CV it is. */
export const CV_FILE = 'Mohammad_Arif_Hossain_CV.pdf';
export const CV_URL = `/${CV_FILE}`;

export interface Role {
  title: string;
  start: string;
  end: string | null;
}

export interface Employment {
  id: string;
  company: string;
  location: string;
  commitment: 'full-time' | 'part-time';
  nature: 'internship' | 'permanent';
  mode: 'onsite' | 'remote';
  roles: Role[];
  start: string;
  end: string | null;
  points: string[];
}

export interface Project {
  id: string;
  name: string;
  employmentId: string | null;
  kind: string;
  stack: string[];
  period: string;
  features: string[];
}

export type Tier = 'proficient' | 'comfortable' | 'familiar';

export interface SkillTier {
  tier: Tier;
  label: string;
  scope: string;
  items: string[];
}

export interface Education {
  qualification: string;
  institute: string;
  detail: string[];
}

export interface Credential {
  title: string;
  institute: string;
  detail: string[];
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  linkedin: string;
}

export const IDENTITY = {
  name: 'Mohammad Arif Hossain',
  title: 'Full Stack Engineer',
  location: 'Dhaka, Bangladesh',
  email: 'mohammadarifhossain80@gmail.com',
  phone: '+8801682221674',
  github: 'https://github.com/a1barif2h',
  linkedin: 'https://www.linkedin.com/in/arifhossain80/',
  summary:
    'Full Stack Engineer building and running government-scale web platforms end to end — React and Next.js front ends, Java Spring Boot, Node.js and Python FastAPI services, on Docker.',
} as const;

export const EMPLOYMENT: Employment[] = [
  {
    id: 'penta',
    company: 'Penta Global Limited',
    location: 'Gulshan, Dhaka, Bangladesh',
    commitment: 'full-time',
    nature: 'permanent',
    mode: 'onsite',
    start: '2021-09',
    end: null,
    roles: [
      { title: 'Frontend Web Developer', start: '2021-09', end: '2024-02' },
      { title: 'Full Stack Engineer', start: '2024-02', end: null },
    ],
    points: [
      'Lead front-end developer for the BEZA One Stop Service portal — a 70k+ line React application covering investor registration, application submission, desk approvals and certificate issuance; over 1,000 commits, the largest single contribution in the repository.',
      'Built and maintained the certificate service (Node.js, Puppeteer, pdf-lib, QR and barcode generation) that issues legally binding certificates — trade licences, occupancy certificates, land use permissions — with config-driven, multi-tenant organisation branding.',
      'Worked across the Java Spring Boot core service, the Camunda BPMN process-flow service, and the Spring Boot integration gateway connecting BEZA to the Bangladesh and National Single Window systems.',
      'Designed and shipped a transactional integration outbox with an Apache Airflow drain DAG, giving safe, idempotency-aware, retry-capped delivery to a non-idempotent external government system.',
      'Delivered the Bangladesh Election Commission online nomination system: the React and TypeScript candidate portal, the returning officer portal, and the Node.js reporting service that generates official result, funding and Barta reports as paginated PDFs.',
      'Designed and built ContentOps almost single-handedly — a FastAPI and Next.js 15 content operations platform with Celery and Redis background pipelines, LLM-driven content generation, scheduled multi-channel publishing, and a 171-file test suite.',
      'Secured applications with Keycloak and OIDC, including a customised Keycloakify login theme, and shipped to staging and production via Docker and Jenkins.',
      'Mentored junior developers joining the team — onboarding them into a 15-repo microservice codebase, pairing through debugging and architecture walkthroughs, and teaching unfamiliar parts of the stack until they could take tickets on their own.',
      'Reviewed and merged 256 pull requests across the Penta repositories, and set the front-end patterns and conventions the team builds against.',
    ],
  },
  {
    id: 'cogniable',
    company: 'CogniAble',
    location: 'Gurugram, Haryana, India',
    commitment: 'full-time',
    nature: 'permanent',
    mode: 'remote',
    start: '2021-04',
    end: '2021-10',
    roles: [{ title: 'React Developer', start: '2021-04', end: '2021-10' }],
    points: [
      'Built and maintained web applications in React.',
      'Built mobile applications with React Native.',
      'Consumed a GraphQL API as the primary data layer.',
    ],
  },
  {
    id: 'hwsaver',
    company: 'HW Saver LLP',
    location: 'Uttar Pradesh, India',
    commitment: 'part-time',
    nature: 'internship',
    mode: 'remote',
    start: '2021-01',
    end: '2021-10',
    roles: [{ title: 'Frontend Web Developer', start: '2021-01', end: '2021-10' }],
    points: ['Built and maintained web applications in React under tight delivery deadlines.'],
  },
  {
    id: 'virtuera',
    company: 'Virtuera',
    location: 'Mumbai, Maharashtra, India',
    commitment: 'part-time',
    nature: 'internship',
    mode: 'remote',
    start: '2020-12',
    end: '2021-04',
    roles: [{ title: 'Frontend Web Developer', start: '2020-12', end: '2021-04' }],
    points: [],
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'beza',
    name: 'BEZA One Stop Service',
    employmentId: 'penta',
    kind: 'Government platform',
    period: '2021 – present',
    stack: [
      'React', 'Redux', 'Java', 'Spring Boot', 'Node.js', 'PostgreSQL',
      'Camunda BPMN', 'Keycloak', 'Apache Airflow', 'Docker',
    ],
    features: [
      'Single national window for investors to register, apply for and renew economic-zone services online.',
      '15-service microservice architecture: core, process flow (BPMN desk approvals), certificate, PDF, file, email, integration gateway and config server.',
      'Automated certificate issuance with QR and barcode verification and per-organisation branding.',
      'Two-way integration with the Bangladesh and National Single Window systems through a transactional outbox and Airflow-scheduled delivery.',
    ],
  },
  {
    id: 'ec',
    name: 'Bangladesh Election Commission — Online Nomination',
    employmentId: 'penta',
    kind: 'Government platform',
    period: '2023 – 2026',
    stack: [
      'React 18', 'TypeScript', 'Vite', 'Redux Toolkit', 'Keycloak',
      'Node.js', 'Express.js', 'Puppeteer', 'PDFKit', 'Cypress', 'Docker',
    ],
    features: [
      'Secure online submission of candidate nomination papers, replacing a paper-based process.',
      'Returning officer portal for scrutiny and decision workflows.',
      'Reporting service generating official national and constituency-level result, funding and Barta reports as paginated PDFs.',
    ],
  },
  {
    id: 'contentops',
    name: 'ContentOps',
    employmentId: 'penta',
    kind: 'AI content platform',
    period: '2026 — primary author',
    stack: [
      'FastAPI', 'Python 3.13', 'SQLAlchemy 2.0', 'PostgreSQL 17', 'Celery',
      'Redis', 'Next.js 15', 'React 19', 'TypeScript', 'TanStack Query',
      'Zustand', 'TailwindCSS 4', 'shadcn/ui', 'Docker',
    ],
    features: [
      'End-to-end content operations: brand ideation, draft generation, asset and image pipelines, scheduling and multi-channel publishing.',
      'LLM-backed generation and brand crawling on Celery with separate queues, so image fan-out cannot starve the control plane.',
      'Modular monolith with a three-layer router, service and repository architecture, and clean-architecture modules for complex domains.',
      'Fully typed frontend and backend contract via generated OpenAPI types, with a 170-file async test suite.',
    ],
  },
  {
    id: 'badlao',
    name: 'Badlao',
    employmentId: null,
    kind: 'Client project — fintech, SME lending',
    period: '2025 – 2026',
    stack: [
      'Next.js 15', 'React', 'TypeScript', 'TailwindCSS', 'shadcn/ui',
      'React Hook Form', 'Zod', 'Recharts', 'Strapi', 'PostgreSQL', 'Docker',
    ],
    features: [
      'Loan application, business valuation and instalment-tracking workflows for SME borrowers.',
      'Reusable dynamic form-table component driving complex multi-section financial forms.',
      'Internationalised App Router frontend with a dashboard and downloadable reports.',
    ],
  },
];

export const SKILLS: SkillTier[] = [
  {
    tier: 'proficient',
    label: 'Proficient',
    scope: 'local scope',
    items: [
      'React', 'Next.js', 'TypeScript', 'JavaScript', 'Redux Toolkit',
      'TanStack Query', 'Zustand', 'React Hook Form', 'TailwindCSS',
      'shadcn/ui', 'Bootstrap', 'Ant Design', 'SASS', 'Node.js',
      'Express.js', 'REST API design',
    ],
  },
  {
    tier: 'comfortable',
    label: 'Comfortable',
    scope: 'closure scope',
    items: [
      'Python', 'FastAPI', 'Celery', 'NestJS', 'Java', 'Spring Boot',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLAlchemy', 'Alembic',
      'Flyway', 'Sequelize', 'Mongoose', 'Docker', 'Docker Compose',
      'Keycloak / OIDC', 'Camunda BPMN', 'Apache Airflow', 'Pytest', 'Jest',
      'React Testing Library',
    ],
  },
  {
    tier: 'familiar',
    label: 'Familiar',
    scope: 'global scope',
    items: [
      'Flutter', 'Dart', 'React Native', 'Kubernetes', 'Helm', 'Jenkins',
      'Cypress', 'Spring Cloud Config', 'Nginx',
    ],
  },
];

export const EDUCATION: Education[] = [
  {
    qualification: 'Diploma in Computer Science and Application',
    institute: 'Bangladesh Open University',
    detail: ['Session 2021–2023', 'Result 3.76 of 4.00'],
  },
  {
    qualification: 'Higher Secondary Certificate',
    institute: 'Hazi Misir Ali University',
    detail: ['Dhaka board, 2012', 'Result 4.00 of 5.00'],
  },
];

export const CREDENTIALS: Credential[] = [
  {
    title: 'Certified Web Developer',
    institute: 'Programming Hero',
    detail: ['10 months', 'Top 5 percent, Black Belt', 'Advanced JavaScript, React, Node.js, Next.js, Redux, React Native'],
  },
  {
    title: 'CSE Fundamentals',
    institute: 'Phitron',
    detail: ['1.5 years, completed', 'C, C++, Python', 'Data structures, algorithms, OOP', 'Databases, deployment, cloud'],
  },
];

export const REFERENCES: Reference[] = [
  {
    name: 'MD. Nazmul Huda',
    position: 'Tech Lead',
    company: 'Penta Global Ltd.',
    linkedin: 'https://www.linkedin.com/in/md-nazmul-huda-prince/',
  },
  {
    name: 'A.K.M Ariful Islam Shimul',
    position: 'Senior Java Developer',
    company: 'Penta Global Ltd.',
    linkedin: 'https://www.linkedin.com/in/arif18bari/',
  },
];
