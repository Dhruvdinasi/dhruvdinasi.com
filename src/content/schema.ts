/**
 * Content schema — the single definition of every editable field.
 * Used by scripts/validate-content.ts at build time (zod) and for TypeScript types.
 * The /admin editor (public/admin/config.yml) mirrors these fields.
 * Client code only imports *types* from here, so zod never ships to visitors.
 */
import { z } from 'zod';

/** CMS editors may save an empty optional field as "" — treat that as absent. */
const opt = () =>
  z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v && v.trim() ? v.trim() : undefined));
const list = <T extends z.ZodTypeAny>(t: T) =>
  z
    .array(t)
    .optional()
    .nullable()
    .transform((v) => v ?? []);
const strList = () => list(z.string().min(1));
const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM, e.g. 2026-03');
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'Use YYYY-MM-DD');
const url = () =>
  opt().refine((v) => !v || /^https?:\/\//.test(v), 'Must be a full URL starting with https://');
/** Accent words: wrap text in *asterisks* to render it in the italic accent style. */
const text = () => z.string({ error: 'Required' }).trim().min(1, 'Required — this field can’t be empty');

import { categories, certGroups, motifs } from './constants';
export { categories, certGroups, motifs };

/* ---------- Collections (one file per entry) ---------- */

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and dashes only'),
  title: text(),
  tagline: text(),
  order: z.number().default(100),
  featured: z.boolean().default(false),
  caseStudy: z.boolean().default(true),
  date: text(),
  sortDate: yearMonth,
  context: text(),
  categories: list(z.enum(categories)),
  stack: strList(),
  repo: url(),
  demo: url(),
  motif: z.enum(motifs).default('nodes'),
  overview: text(),
  problem: opt(),
  motivation: opt(),
  objectives: strList(),
  features: strList(),
  architecture: list(z.object({ label: text(), detail: text(), tech: opt() })),
  workflow: list(z.object({ title: text(), detail: text() })),
  decisions: list(z.object({ title: text(), detail: text() })),
  challenges: list(z.object({ challenge: text(), solution: text() })),
  testing: strList(),
  limitations: strList(),
  improvements: strList(),
  media: list(z.object({ src: text(), alt: text(), caption: opt() })),
  verification: opt(),
  showOnResume: z.boolean().default(false),
  resumeStack: opt(),
  resumePoints: strList(),
});

export const certificationSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and dashes only'),
  title: text(),
  issuer: text(),
  via: opt(),
  date: isoDate.optional().nullable().transform((v) => v || undefined),
  group: z.enum(certGroups),
  topics: strList(),
  /** Thumbnail image of the certificate (png/jpg/webp). */
  image: opt(),
  /** Original PDF, optional. */
  file: opt(),
  credentialId: opt(),
  url: url(),
  showOnResume: z.boolean().default(false),
  hidden: z.boolean().default(false),
});

export const experienceSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  role: text(),
  organisation: text(),
  programme: opt(),
  type: opt(),
  /** YYYY-MM; leave empty if unknown. */
  start: yearMonth.optional().nullable().transform((v) => v || undefined),
  /** YYYY-MM; empty = ongoing. */
  end: yearMonth.optional().nullable().transform((v) => v || undefined),
  duration: opt(),
  location: opt(),
  summary: text(),
  points: strList(),
  certificate: opt(),
  order: z.number().default(100),
});

/* ---------- Single files (settings) ---------- */

export const siteSchema = z.object({
  name: text(),
  fullName: text(),
  url: z.string().url(),
  role: text(),
  location: text(),
  email: z.string().email(),
  github: z.string().url(),
  githubHandle: text(),
  linkedin: z.string().url(),
  description: text(),
  college: text(),
  degree: text(),
  startYear: z.string(),
  graduationYear: z.string(),
  cgpa: opt(),
  resumePdf: text(),
  resumeUpdated: isoDate,
  ogImage: text(),
  openTo: opt(),
  focus: text(),
});

export const homeSchema = z.object({
  eyebrow: text(),
  headlineStart: text(),
  lede: text(),
  signals: list(z.object({ word: text(), project: text(), pipeline: strList() })),
  workKicker: text(),
  workTitle: text(),
  workIntro: opt(),
  approachTitle: text(),
  skillsTitle: text(),
  skillsIntro: opt(),
  beyondTitle: text(),
  ctaKicker: text(),
  ctaTitle: text(),
});

export const aboutSchema = z.object({
  headline: text(),
  intro: strList(),
  aspiration: opt(),
  approach: list(z.object({ title: text(), body: text() })),
  learningNext: strList(),
  interests: list(z.object({ title: text(), kicker: text(), body: text() })),
  nowReviewed: text(),
  now: list(z.object({ label: text(), text: text() })),
});

export const pagesSchema = z.object({
  projectsHeadline: text(),
  projectsIntro: opt(),
  certificationsHeadline: text(),
  certificationsIntro: opt(),
  contactHeadline: text(),
  contactIntro: opt(),
  footerLine: text(),
});

export const achievementsSchema = z.object({
  items: list(z.object({ title: text(), detail: text(), years: text(), sortDate: yearMonth, showOnHome: z.boolean().default(false) })),
});

export const skillsSchema = z.object({
  groups: list(
    z.object({
      id: z.string().regex(/^[a-z0-9-]+$/),
      title: text(),
      blurb: opt(),
      showOnHome: z.boolean().default(false),
      skills: list(z.object({ name: text(), usedIn: strList() })),
    }),
  ),
});

export const resumeSchema = z.object({
  summary: text(),
  education: list(z.object({ school: text(), degree: text(), when: opt(), score: opt(), sortDate: yearMonth })),
  skills: list(z.object({ label: text(), value: text() })),
  workshops: opt(),
  extracurricular: opt(),
  softSkills: opt(),
});

export type Project = z.output<typeof projectSchema>;
export type Category = (typeof categories)[number];
export type Certification = z.output<typeof certificationSchema>;
export type Experience = z.output<typeof experienceSchema>;
export type Site = z.output<typeof siteSchema>;
export type Home = z.output<typeof homeSchema>;
export type About = z.output<typeof aboutSchema>;
export type Pages = z.output<typeof pagesSchema>;
export type Achievements = z.output<typeof achievementsSchema>;
export type Skills = z.output<typeof skillsSchema>;
export type Resume = z.output<typeof resumeSchema>;
export type Stage = Project['architecture'][number];
