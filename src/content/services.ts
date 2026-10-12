/** The four service lines (spec §5.2 cards and §6 sections). Copy is final — do not edit wording. */
export type Service = {
  id: 'ai-automation' | 'development' | 'data-integration' | 'team-augmentation';
  number: '01' | '02' | '03' | '04';
  title: string;
  /** Home card copy (§5.2) */
  card: string;
  /** Services page intro paragraph (§6) */
  intro: string;
  listTitle: string;
  items: string[];
  footLabel: 'Stack:' | 'Good for:';
  foot: string;
};

export const services: Service[] = [
  {
    id: 'ai-automation',
    number: '01',
    title: 'AI & workflow automation',
    card: 'Agents, document pipelines and LLM-driven workflows that take real work off your team’s plate — scoped to one process at a time, measured on hours saved.',
    intro: 'Most businesses don’t need an AI strategy. They need one repetitive, document-heavy process to stop eating their team’s week. We map the process first, then build LLM-driven workflows — invoice and email triage, document extraction, approval routing, assistants over your own data — one process at a time, with a human in the loop until the numbers say otherwise.',
    listTitle: 'Typical engagements',
    items: [
      'Process analysis: where the hours go, what can be automated, and what should stay manual',
      'Automating an inbox: classify, extract, route and draft replies for a shared mailbox',
      'Document pipelines: contracts, invoices, forms → structured data → your system of record',
      'Internal assistants grounded in your SOPs, tickets or knowledge base',
      'Evaluation and guardrails for an AI feature a vendor already sold you',
    ],
    footLabel: 'Stack:',
    foot: 'Anthropic and OpenAI APIs, Python, Node, Postgres, vector search where it earns its place.',
  },
  {
    id: 'development',
    number: '02',
    title: 'Custom web & application development',
    card: 'Web apps, portals, internal tools and integrations, built on mainstream stacks your own team can maintain after we leave.',
    intro: 'Web applications, customer and partner portals, internal tools and the integrations between them. We build on mainstream stacks deliberately, so your own team — or any competent vendor — can take the code over later. No proprietary frameworks, no lock-in.',
    listTitle: 'Typical engagements',
    items: [
      'A customer or vendor portal replacing email-and-spreadsheet workflows',
      'Internal operations tools: dashboards, approvals, scheduling, inventory',
      'Modernizing a legacy PHP, .NET or jQuery application without a big-bang rewrite',
      'Mobile-responsive front ends over existing back ends',
    ],
    footLabel: 'Stack:',
    foot: 'React, Next.js, Node, Python/Django, .NET, Postgres, MySQL; AWS and Azure.',
  },
  {
    id: 'data-integration',
    number: '03',
    title: 'Data, integration & modernization',
    card: 'APIs, migrations, reporting layers and the unglamorous plumbing between the systems you already own.',
    intro: 'The unglamorous work that makes everything else possible: getting systems to talk to each other, moving data out of places it shouldn’t be, and building the reporting layer people actually open.',
    listTitle: 'Typical engagements',
    items: [
      'REST and webhook integrations between CRM, ERP, accounting and line-of-business systems',
      'Data migrations with reconciliation reports, not just “it ran”',
      'Reporting and dashboards (Power BI, Metabase, custom) over a cleaned-up data model',
      'E-commerce platform integrations: orders, inventory, fulfilment, payments',
    ],
    footLabel: 'Stack:',
    foot: 'SQL, Python, dbt, Airflow or cron where cron is enough, Power BI, Metabase.',
  },
  {
    id: 'team-augmentation',
    number: '04',
    title: 'Team augmentation & dedicated teams',
    card: 'Experienced developers, consultants and specialists who join your team on contract or as a managed group — scaled up or down as the work changes.',
    intro: 'When the work is clear but the people aren’t there, we supply them. Individual developers, consultants and specialists who join your team on contract — on-site, hybrid or remote — or a named, managed group working as an extension of your team on a monthly engagement. You interview the people; we handle the sourcing, the contracts and the continuity.',
    listTitle: 'How it works',
    items: [
      'You define the role or the team; we propose named people and you interview them',
      'Monthly billing per person, with notice terms you can live with',
      'A single iLexicon lead owns communication, priorities and quality',
      'Your tools, your repositories, your standards',
    ],
    footLabel: 'Good for:',
    foot: 'filling a specific skill gap (SAP, database, cloud, data, QA), sustained product work, maintenance of systems we or others built, and backlogs that never make it to the top of an in-house team’s list.',
  },
];

export const serviceHref = (s: Service) => `/services#${s.id}`;
