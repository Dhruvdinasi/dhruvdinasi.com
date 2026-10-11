/**
 * The site's content, loaded from src/content/generated.json.
 * That file is produced by scripts/build-content.ts from the JSON in /content
 * (edited by hand or through /admin). Do not edit generated.json directly.
 */
import data from './generated.json';
import type {
  About,
  Achievements,
  Category,
  Certification,
  Experience,
  Home,
  Pages,
  Project,
  Resume,
  Site,
  Skills,
} from './schema';
import { categories as allCategories } from './constants';

export type { Category, Certification, Experience, Project, Stage } from './schema';

export interface TimelineEntry {
  when: string;
  sort: string;
  title: string;
  detail: string;
  kind: 'education' | 'project' | 'credential' | 'achievement' | 'experience';
  href?: string;
}

interface Generated {
  site: Site;
  home: Home;
  about: About;
  pages: Pages;
  achievements: Achievements;
  skills: Skills;
  resume: Resume;
  projects: Project[];
  certifications: Certification[];
  experience: Experience[];
  timeline: TimelineEntry[];
  imageSizes: Record<string, { w: number; h: number }>;
}

const content = data as unknown as Generated;

export const site = content.site;
export const home = content.home;
export const about = content.about;
export const pages = content.pages;
export const achievements = content.achievements.items;
export const skillGroups = content.skills.groups;
export const resume = content.resume;
export const projects = content.projects;
export const certifications = content.certifications;
export const experience = content.experience;
export const timeline = content.timeline;

/** Only categories that at least one project uses. */
export const categories: Category[] = allCategories.filter((c) => projects.some((p) => p.categories.includes(c)));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getCertification = (id: string) => certifications.find((c) => c.id === id);
export const imageSize = (src?: string) => (src ? content.imageSizes[src] : undefined);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** "2026-09-18" → "18 Sep 2026"; "2026-09" → "Sep 2026" */
export function formatDate(d?: string) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const mon = MONTHS[Number(m) - 1];
  return day ? `${Number(day)} ${mon} ${y}` : `${mon} ${y}`;
}
