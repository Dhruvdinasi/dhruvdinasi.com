/**
 * Reads everything in content/, validates it, and writes one normalised file:
 * src/content/generated.json — the only content the site imports.
 *
 * Fails with a readable list of problems (file + field + message) if anything is wrong,
 * so a bad edit in /admin breaks the build instead of the live site.
 *
 * Run directly: npx tsx scripts/build-content.ts   (npm run dev / build do this for you)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { imageSize } from 'image-size';
import type { ZodType } from 'zod';
import {
  aboutSchema,
  achievementsSchema,
  certificationSchema,
  experienceSchema,
  homeSchema,
  pagesSchema,
  projectSchema,
  resumeSchema,
  siteSchema,
  skillsSchema,
  type Certification,
  type Experience,
  type Project,
} from '../src/content/schema';

export interface TimelineEntry {
  when: string;
  sort: string;
  title: string;
  detail: string;
  kind: 'education' | 'project' | 'credential' | 'achievement' | 'experience';
  href?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const fmtMonth = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;

export function buildContent(root = resolve(import.meta.dirname ?? __dirname, '..')) {
  const dir = join(root, 'content');
  const pub = join(root, 'public');
  const problems: string[] = [];

  function parse<T>(schema: ZodType<T>, file: string, extra: Record<string, string> = {}): T | undefined {
    let raw: unknown;
    try {
      raw = { ...JSON.parse(readFileSync(join(dir, file), 'utf8')), ...extra };
    } catch (e) {
      problems.push(`content/${file}: not valid JSON (${(e as Error).message})`);
      return undefined;
    }
    const r = schema.safeParse(raw);
    if (!r.success) {
      for (const i of r.error.issues) problems.push(`content/${file} → ${i.path.join('.') || '(root)'}: ${i.message}`);
      return undefined;
    }
    return r.data;
  }
  /** One file per entry. The file name (without .json) is the entry's id / URL slug. */
  function collection<T>(sub: string, schema: ZodType<T>, idKey: 'slug' | 'id'): T[] {
    const d = join(dir, sub);
    if (!existsSync(d)) return [];
    return readdirSync(d)
      .filter((f) => f.endsWith('.json'))
      .sort()
      .map((f) => parse(schema, `${sub}/${f}`, { [idKey]: f.replace(/\.json$/, '') }))
      .filter((x): x is T => x !== undefined);
  }

  const site = parse(siteSchema, 'site.json');
  const home = parse(homeSchema, 'home.json');
  const about = parse(aboutSchema, 'about.json');
  const pages = parse(pagesSchema, 'pages.json');
  const achievements = parse(achievementsSchema, 'achievements.json');
  const skills = parse(skillsSchema, 'skills.json');
  const resume = parse(resumeSchema, 'resume.json');
  const projects = collection<Project>('projects', projectSchema, 'slug').sort((a, b) => a.order - b.order || b.sortDate.localeCompare(a.sortDate));
  const certifications = collection<Certification>('certifications', certificationSchema, 'id')
    .filter((c) => !c.hidden)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  const experience = collection<Experience>('experience', experienceSchema, 'id').sort(
    (a, b) => a.order - b.order || (b.end ?? '9999').localeCompare(a.end ?? '9999'),
  );

  // ---- Cross-references ----
  const slugs = new Set(projects.map((p) => p.slug));
  const certIds = new Set(certifications.map((c) => c.id));
  const dup = (arr: string[], what: string) =>
    arr.filter((x, i) => arr.indexOf(x) !== i).forEach((x) => problems.push(`Duplicate ${what}: "${x}"`));
  dup(projects.map((p) => p.slug), 'project slug');
  dup(certifications.map((c) => c.id), 'certificate id');
  home?.signals.forEach((s) => {
    if (!slugs.has(s.project)) problems.push(`content/home.json → signals: unknown project "${s.project}"`);
  });
  skills?.groups.forEach((g) =>
    g.skills.forEach((s) =>
      s.usedIn.forEach((u) => {
        if (!slugs.has(u)) problems.push(`content/skills.json → ${g.title} → ${s.name}: unknown project "${u}"`);
      }),
    ),
  );
  experience.forEach((e) => {
    if (e.certificate && !certIds.has(e.certificate)) problems.push(`content/experience/${e.id}.json → certificate: unknown id "${e.certificate}"`);
  });

  // ---- Files referenced from content must exist; record image sizes ----
  const imageSizes: Record<string, { w: number; h: number }> = {};
  const checkFile = (src: string | undefined, where: string, isImage: boolean) => {
    if (!src) return;
    if (/^https?:\/\//.test(src)) return;
    const p = join(pub, src.replace(/^\//, ''));
    if (!existsSync(p)) {
      problems.push(`${where}: file not found — ${src}`);
      return;
    }
    if (isImage) {
      try {
        const { width, height } = imageSize(readFileSync(p));
        if (width && height) imageSizes[src] = { w: width, h: height };
      } catch {
        problems.push(`${where}: ${src} is not a readable image`);
      }
    }
  };
  projects.forEach((p) => p.media.forEach((m) => checkFile(m.src, `content/projects/${p.slug}.json → media`, true)));
  certifications.forEach((c) => {
    checkFile(c.image, `content/certifications/${c.id}.json → image`, true);
    checkFile(c.file, `content/certifications/${c.id}.json → file`, false);
    if (c.image && /\.pdf$/i.test(c.image)) problems.push(`content/certifications/${c.id}.json → image: use a PNG/JPG/WebP here; put the PDF in “Certificate file”`);
  });
  if (site) checkFile(site.resumePdf, 'content/site.json → resumePdf', false);

  if (problems.length || !site || !home || !about || !pages || !achievements || !skills || !resume) {
    const msg = `\nContent has ${problems.length} problem(s):\n${problems.map((p) => `  ✗ ${p}`).join('\n')}\n`;
    throw new Error(msg);
  }

  // ---- Timeline (generated — no separate file to maintain) ----
  const timeline: TimelineEntry[] = [
    ...experience.map((e) => ({
      when: e.end ? fmtMonth(e.end) : 'Now',
      sort: e.end ?? '9999-12',
      title: `${e.role} · ${e.organisation}`,
      detail: [e.programme, e.type, e.duration].filter(Boolean).join(' · '),
      kind: 'experience' as const,
      href: '/resume#experience',
    })),
    ...projects.map((p) => ({
      when: fmtMonth(p.sortDate),
      sort: p.sortDate,
      title: p.title,
      detail: p.tagline,
      kind: 'project' as const,
      href: p.caseStudy ? `/projects/${p.slug}` : `/projects#${p.slug}`,
    })),
    ...certifications
      .filter((c) => c.date && c.group !== 'Internship')
      .map((c) => ({
        when: fmtMonth(c.date!.slice(0, 7)),
        sort: c.date!.slice(0, 7),
        title: c.title,
        detail: [c.issuer, c.via].filter(Boolean).join(' · '),
        kind: 'credential' as const,
        href: '/certifications',
      })),
    ...achievements.items.map((a) => ({ when: a.years, sort: a.sortDate, title: a.title, detail: a.detail, kind: 'achievement' as const })),
    ...resume.education.map((e) => ({
      when: e.when ?? fmtMonth(e.sortDate).slice(4),
      sort: e.sortDate,
      title: e.degree,
      detail: [e.school, e.score].filter(Boolean).join(' · '),
      kind: 'education' as const,
    })),
  ].sort((a, b) => b.sort.localeCompare(a.sort));

  const out = { site, home, about, pages, achievements, skills, resume, projects, certifications, experience, timeline, imageSizes };
  const file = join(root, 'src', 'content', 'generated.json');
  const json = JSON.stringify(out, null, 1) + '\n';
  const prev = existsSync(file) ? readFileSync(file, 'utf8') : '';
  if (json !== prev) writeFileSync(file, json);
  return { counts: { projects: projects.length, certifications: certifications.length, experience: experience.length }, file };
}

// CLI
if (process.argv[1] && /build-content\.ts$/.test(process.argv[1])) {
  try {
    const { counts } = buildContent();
    console.log(`✓ Content valid — ${counts.projects} projects, ${counts.certifications} certificates, ${counts.experience} experience entries`);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}
