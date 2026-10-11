import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Project, Stage } from '../content';
import { GitHubIcon } from './BrandIcons';
import { Motif } from './Motif';

export function SectionHeader({
  index,
  kicker,
  title,
  children,
  id,
}: {
  index?: string;
  kicker: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className="reveal mb-10 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
      <div>
        <p className="label">
          {index && <span className="mr-2 text-accent">{index}</span>}
          {kicker}
        </p>
        <h2 id={id} className="h-display mt-3 text-3xl leading-tight sm:text-4xl">
          {title}
        </h2>
      </div>
      {children && <div className="max-w-md text-muted md:justify-self-end">{children}</div>}
    </div>
  );
}

export function ProjectCard({ project, delay = 0, reveal = true }: { project: Project; delay?: number; reveal?: boolean }) {
  const href = `/projects/${project.slug}`;
  return (
    <article
      className={`${reveal ? 'reveal ' : ''}card group relative flex flex-1 flex-col overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-ink/25`}
      style={{ ['--d' as string]: `${delay}ms` }}
    >
      <div className="relative border-b border-line bg-bg/40">
        <Motif kind={project.motif} className="aspect-[16/9] w-full transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="chip absolute left-4 top-4 bg-bg/70 backdrop-blur">{project.context}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight">
            <Link to={href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {project.title}
            </Link>
          </h3>
          <span className="shrink-0 font-mono text-xs text-muted">{project.date}</span>
        </div>
        <p className="mt-2 leading-relaxed text-muted">{project.tagline}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.stack.slice(0, 5).map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
          {project.stack.length > 5 && <li className="chip">+{project.stack.length - 5}</li>}
        </ul>
        <div className="mt-auto flex items-center justify-between pt-6 text-sm">
          <span className="inline-flex items-center gap-1.5 font-medium text-accent">
            Case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </span>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener"
              className="relative z-10 inline-flex items-center gap-1.5 text-muted hover:text-ink"
              aria-label={`${project.title} source code on GitHub`}
            >
              <GitHubIcon /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Architecture drawn from the project's real stages: a numbered flow, horizontal on wide screens. */
export function ArchitectureDiagram({ stages, title }: { stages: Stage[]; title: string }) {
  return (
    <figure className="card overflow-hidden">
      <div className="dot-field relative p-5 sm:p-7" style={{ maskImage: 'none' }}>
        <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stages.map((s, i) => (
            <li key={s.label} className="relative rounded-xl border border-line bg-surface/95 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.7rem] text-accent">{String(i + 1).padStart(2, '0')}</span>
                {s.tech && <span className="font-mono text-[0.68rem] text-muted">{s.tech}</span>}
              </div>
              <p className="mt-2 font-medium">{s.label}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{s.detail}</p>
              {i < stages.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -bottom-3 left-6 h-3 w-px bg-accent/50 sm:hidden"
                />
              )}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="border-t border-line px-5 py-3 text-xs text-muted">
        <span className="font-mono">fig.</span> {title} — stages in the order data flows through them.
      </figcaption>
    </figure>
  );
}

export function ExternalLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
    </a>
  );
}
