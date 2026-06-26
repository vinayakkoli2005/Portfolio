import { describe, it, expect } from 'vitest';
import { content } from './content';

describe('content', () => {
  it('has all sections populated', () => {
    expect(content.hero.name).toBe('Vinayak Koli');
    expect(content.projects.length).toBeGreaterThanOrEqual(4);
    expect(content.essays.length).toBeGreaterThanOrEqual(4);
    expect(content.skills.length).toBeGreaterThanOrEqual(3);
    expect(content.education.length).toBeGreaterThanOrEqual(2);
  });

  it('every project has title, description, and at least one tech', () => {
    for (const p of content.projects) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.description.length).toBeGreaterThan(0);
      expect(p.tech.length).toBeGreaterThan(0);
    }
  });

  it('every essay href points to an articles page', () => {
    for (const e of content.essays) {
      expect(e.href).toMatch(/articles\//);
    }
  });

  it('resume href points to the resume pdf', () => {
    expect(content.resumeHref).toMatch(/resume/i);
  });
});
