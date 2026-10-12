export type Job = {
  id: string;                          // slug
  title: string;
  location: string;                    // "United States · on-site or remote"
  type: 'Full-time' | 'Contract' | 'Contract-to-hire';
  experience: string;                  // "5+ years"
  skills: string[];
  summary: string;                     // ≤ 2 sentences, no client, no city
};

export const jobs: Job[] = [
  {
    id: 'full-stack-developer',
    title: 'Full-Stack Developer',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '4+ years',
    skills: ['React', 'Node or .NET', 'REST APIs', 'SQL', 'Git'],
    summary: 'Builds and maintains web applications and internal tools on mainstream stacks. Comfortable owning a feature end to end, from database to UI.',
  },
  {
    id: 'sap-consultant',
    title: 'SAP Consultant',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '6+ years',
    skills: ['SAP S/4HANA', 'FI/CO or MM/SD', 'ABAP exposure', 'Integration', 'Requirements gathering'],
    summary: 'Functional consultant for implementation, rollout and support engagements. Works with business stakeholders to configure, test and document SAP processes.',
  },
  {
    id: 'database-architect',
    title: 'Database Architect',
    location: 'United States · on-site or remote',
    type: 'Contract-to-hire',
    experience: '8+ years',
    skills: ['SQL Server or PostgreSQL', 'Data modeling', 'Performance tuning', 'Migrations', 'Azure or AWS'],
    summary: 'Designs and tunes relational databases for line-of-business and reporting workloads. Leads schema design, migrations and performance work.',
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    location: 'United States · remote',
    type: 'Contract',
    experience: '5+ years',
    skills: ['AWS or Azure', 'Terraform', 'CI/CD', 'Docker', 'Monitoring'],
    summary: 'Owns infrastructure, pipelines and environments for application teams. Automates deployments and keeps production boring.',
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    location: 'United States · on-site or remote',
    type: 'Contract',
    experience: '4+ years',
    skills: ['Python', 'SQL', 'dbt or Airflow', 'Power BI', 'Data warehousing'],
    summary: 'Builds pipelines, data models and reporting layers over operational systems. Turns scattered data into dashboards people open.',
  },
  {
    id: 'qa-automation-engineer',
    title: 'QA Automation Engineer',
    location: 'United States · remote',
    type: 'Contract',
    experience: '3+ years',
    skills: ['Playwright or Selenium', 'API testing', 'Test planning', 'CI integration', 'JavaScript or Python'],
    summary: 'Designs and automates test coverage for web applications and integrations. Works alongside developers from the first sprint, not after it.',
  },
];
