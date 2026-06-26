export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
};
export type Essay = { id: string; title: string; summary: string; href: string; pdf?: string };
export type SkillGroup = { category: string; items: string[] };
export type EduEntry = { institution: string; detail: string; period: string };

// Paths are relative to the deployed root (existing site), one level up from /city3d/
const ROOT = '..';

export const content = {
  hero: {
    name: 'Vinayak Koli',
    title: 'Computer Science & Social Sciences — IIIT Delhi',
    tagline: 'Aspiring Software Engineer building scalable systems and intelligent solutions.',
  },
  about:
    'Second-year Computer Science and Social Sciences student at IIIT Delhi. I build structured backend systems in Java, Python, and FastAPI, and I write on law, secularism, and democracy. This city is where those two worlds meet.',
  skills: [
    { category: 'Languages', items: ['Java', 'Python', 'SQL', 'C++'] },
    { category: 'Tools & Tech', items: ['Git', 'Docker', 'Linux', 'FastAPI', 'React Native', 'Laravel'] },
    { category: 'Concepts', items: ['OOP', 'Data Structures', 'DBMS', 'AI/ML Basics', 'System Design'] },
  ] as SkillGroup[],
  projects: [
    {
      id: 'orbitguard',
      title: 'OrbitGuard',
      description: 'Satellite collision-avoidance and orbital-safety monitoring system.',
      tech: ['Python'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'course-registration',
      title: 'University Course Registration System',
      description: 'Terminal-based system handling student, professor, and admin roles using OOP principles.',
      tech: ['Java', 'OOP'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'dbms-sim',
      title: 'DBMS Simulation Platform',
      description: 'SQL-based database interactions with query simulation and structured schema design.',
      tech: ['SQL', 'HTML', 'CSS', 'JavaScript'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'ai-classification',
      title: 'AI Classification Model',
      description: 'Classification model built in Python with performance-metric evaluation.',
      tech: ['Python'],
      github: 'https://github.com/vinayakkoli2005',
    },
    {
      id: 'ai-model-eval-app',
      title: 'AI Model Evaluation App',
      description: 'Cross-platform mobile app evaluating and comparing AI model outputs.',
      tech: ['React Native'],
      github: 'https://github.com/vinayakkoli2005',
    },
  ] as Project[],
  essays: [
    {
      id: 'multiculturalism',
      title: 'Multiculturalism and Secularism',
      summary: 'On the tension between group rights and the secular state.',
      href: `${ROOT}/articles/multiculturalism-and-secularism.html`,
      pdf: `${ROOT}/Multiculturalisms and secularism.pdf`,
    },
    {
      id: 'ucc',
      title: 'The UCC Debate',
      summary: 'Targeted reforms versus a uniform civil code.',
      href: `${ROOT}/articles/ucc-debate.html`,
      pdf: `${ROOT}/UCC debate.pdf`,
    },
    {
      id: 'poverty-democracy',
      title: 'Poverty and Democracy',
      summary: 'How democratic institutions interact with poverty.',
      href: `${ROOT}/articles/poverty-and-democracy.html`,
      pdf: `${ROOT}/poverty and democracy.pdf`,
    },
    {
      id: 'welfare-schemes',
      title: 'India Welfare Schemes',
      summary: 'A response paper on Indian welfare schemes.',
      href: `${ROOT}/articles/india-welfare-schemes.html`,
      pdf: `${ROOT}/response paper on schemes.pdf`,
    },
  ] as Essay[],
  education: [
    { institution: 'IIIT Delhi', detail: 'B.Tech — Computer Science & Social Sciences', period: '2023 – present' },
    { institution: 'KHMS', detail: 'Higher Secondary Education', period: 'completed' },
  ] as EduEntry[],
  contact: {
    email: 'vinayak23597@iiitd.ac.in',
    linkedin: 'https://www.linkedin.com/in/vinayak-koli-940b0728b/',
    github: 'https://github.com/vinayakkoli2005',
  },
  resumeHref: `${ROOT}/Vinayak koli resume software.pdf`,
};
