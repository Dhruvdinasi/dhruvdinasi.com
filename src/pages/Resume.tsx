import { Download, ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { certifications, experience, formatDate, projects, resume, site } from '../content';
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons';

function Row({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="reveal grid scroll-mt-24 gap-4 border-t border-line py-10 md:grid-cols-[12rem_1fr] md:gap-10" aria-label={title}>
      <h2 className="label pt-1">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default function Resume() {
  const updated = formatDate(site.resumeUpdated);
  const resumeProjects = projects.filter((p) => p.showOnResume);
  const additional: [string, string][] = (
    [
      ['Workshops', resume.workshops],
      ['Extra-curricular', resume.extracurricular],
      ['Soft skills', resume.softSkills],
    ] as [string, string | undefined][]
  ).filter((x): x is [string, string] => !!x[1]);
  const resumeCerts = certifications.filter((c) => c.showOnResume && c.group !== 'Internship');
  return (
    <div className="page pt-14 sm:pt-20">
      <header className="flex flex-col gap-8 pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label">Resume · updated {updated}</p>
          <h1 className="h-display mt-4 text-4xl sm:text-6xl">{site.fullName}</h1>
          <p className="mt-3 text-muted">
            {site.location} ·{' '}
            <a href={`mailto:${site.email}`} className="link-underline hover:text-ink">
              {site.email}
            </a>
          </p>
          <div className="mt-4 flex gap-4 text-sm text-muted">
            <a href={site.github} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-ink">
              <GitHubIcon /> GitHub
            </a>
            <a href={site.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-ink">
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={site.resumePdf} download="Dhruv-Dinasi-Resume.pdf" className="btn-primary">
            <Download className="h-4 w-4" aria-hidden /> Download PDF
          </a>
          <a href={site.resumePdf} target="_blank" rel="noopener" className="btn-ghost">
            <ExternalLink className="h-4 w-4" aria-hidden /> Open in new tab
          </a>
        </div>
      </header>

      <Row title="Summary">
        <p className="max-w-3xl text-lg leading-relaxed">{resume.summary}</p>
      </Row>

      {experience.length > 0 && (
        <Row title="Experience" id="experience">
          <ul className="space-y-8">
            {experience.map((e) => (
              <li key={e.id}>
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-6">
                  <div>
                    <p className="font-medium">{e.role}</p>
                    <p className="text-muted">
                      {e.organisation}
                      {e.programme ? ` · ${e.programme}` : ''}
                    </p>
                  </div>
                  <div className="shrink-0 font-mono text-sm text-muted sm:text-right">
                    <p>{e.start ? `${formatDate(e.start)} – ${e.end ? formatDate(e.end) : 'Present'}` : e.end ? `Completed ${formatDate(e.end)}` : 'Ongoing'}</p>
                    {(e.type || e.duration) && <p>{[e.type, e.duration].filter(Boolean).join(' · ')}</p>}
                  </div>
                </div>
                <p className="mt-3 max-w-3xl leading-relaxed text-muted">{e.summary}</p>
                {e.points.length > 0 && (
                  <ul className="mt-3 space-y-2 text-muted">
                    {e.points.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                )}
                {e.certificate && (
                  <Link to={`/certifications#${e.certificate}`} className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                    View certificate →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Row>
      )}

      <Row title="Education">
        <ul className="space-y-6">
          {resume.education.map((e) => (
            <li key={e.school} className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-6">
              <div>
                <p className="font-medium">{e.degree}</p>
                <p className="text-muted">{e.school}</p>
              </div>
              <div className="shrink-0 font-mono text-sm text-muted sm:text-right">
                {e.when && <p>{e.when}</p>}
                <p className="text-ink">{e.score}</p>
              </div>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Technical skills">
        <dl className="space-y-4">
          {resume.skills.map((s) => (
            <div key={s.label} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="font-medium">{s.label}</dt>
              <dd className="text-muted">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Row>

      <Row title="Projects">
        <ul className="space-y-8">
          {resumeProjects.map((p) => (
            <li key={p.slug}>
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-6">
                <p className="font-medium">
                  {p.caseStudy ? (
                    <Link to={`/projects/${p.slug}`} className="link-underline hover:text-accent">
                      {p.title}
                    </Link>
                  ) : (
                    p.title
                  )}
                </p>
                <p className="shrink-0 font-mono text-sm text-muted">{formatDate(p.sortDate)}</p>
              </div>
              <p className="mt-1 font-mono text-xs text-muted">{p.resumeStack ?? p.stack.join(', ')}</p>
              <ul className="mt-3 space-y-2 text-muted">
                {(p.resumePoints.length ? p.resumePoints : [p.tagline]).map((x) => (
                  <li key={x} className="flex gap-3">
                    <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Row>

      {resumeCerts.length > 0 && (
      <Row title="Certifications">
        <ul className="space-y-2">
          {resumeCerts.map((c) => (
            <li key={c.id}>
              {c.title} — <span className="text-muted">{c.issuer}</span>
            </li>
          ))}
        </ul>
        <Link to="/certifications" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          See all certificates →
        </Link>
      </Row>
      )}

      {additional.length > 0 && (
        <Row title="Additional">
          <dl className="space-y-3">
            {additional.map(([label, value]) => (
              <div key={label} className="grid gap-1 sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="font-medium">{label}</dt>
                <dd className="text-muted">{value}</dd>
              </div>
            ))}
          </dl>
        </Row>
      )}
    </div>
  );
}
