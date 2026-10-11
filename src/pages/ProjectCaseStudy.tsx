import { ArrowLeft, ArrowRight, ExternalLink, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GitHubIcon } from '../components/BrandIcons';
import { Motif } from '../components/Motif';
import { ArchitectureDiagram } from '../components/ui';
import { getProject, imageSize, projects } from '../content';
import NotFound from './NotFound';

const sections = [
  ['overview', 'Overview'],
  ['problem', 'Problem'],
  ['objectives', 'Objectives'],
  ['architecture', 'Architecture'],
  ['features', 'Key features'],
  ['workflow', 'Workflow'],
  ['decisions', 'Decisions'],
  ['challenges', 'Challenges'],
  ['testing', 'Testing'],
  ['limits', 'Limits & next'],
  ['media', 'Screenshots'],
] as const;

function Block({ id, n, title, children }: { id: string; n: number; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="reveal scroll-mt-24 border-t border-line pt-10">
      <p className="label">
        <span className="text-accent">{String(n).padStart(2, '0')}</span>
      </p>
      <h2 id={`${id}-h`} className="h-display mt-2 text-2xl sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((x) => (
        <li key={x} className="flex gap-3 leading-relaxed">
          <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
          <span>{x}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ProjectCaseStudy() {
  const { slug = '' } = useParams();
  const p = getProject(slug);
  if (!p || !p.caseStudy) return <NotFound />;

  const list = projects.filter((x) => x.caseStudy);
  const idx = list.findIndex((x) => x.slug === p.slug);
  const next = list[(idx + 1) % list.length];
  const has: Record<(typeof sections)[number][0], boolean> = {
    overview: true,
    problem: !!(p.problem || p.motivation),
    objectives: p.objectives.length > 0,
    architecture: p.architecture.length > 0,
    features: p.features.length > 0,
    workflow: p.workflow.length > 0,
    decisions: p.decisions.length > 0,
    challenges: p.challenges.length > 0,
    testing: p.testing.length > 0,
    limits: p.limitations.length + p.improvements.length > 0,
    media: p.media.length > 0,
  };
  const visible = sections.filter(([id]) => has[id]);
  let n = 0;

  return (
    <article>
      <header className="relative overflow-hidden border-b border-line">
        <div className="dot-field pointer-events-none absolute inset-0" aria-hidden />
        <div className="page relative grid gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" aria-hidden /> All projects
            </Link>
            <p className="label mt-8">
              {p.context} · {p.date}
            </p>
            <h1 className="h-display mt-3 text-5xl leading-none sm:text-7xl">{p.title}</h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-muted">{p.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener" className="btn-primary">
                  <GitHubIcon /> View source
                </a>
              )}
              {p.demo && (
                <a href={p.demo} target="_blank" rel="noopener" className="btn-ghost">
                  <ExternalLink className="h-4 w-4" aria-hidden /> Live demo
                </a>
              )}
              {!p.repo && <span className="chip py-2">Repository not public yet</span>}
            </div>
          </div>
          <div className="card overflow-hidden">
            <Motif kind={p.motif} className="aspect-[16/9] w-full" />
            <div className="border-t border-line p-4">
              <p className="label mb-2">Stack</p>
              <ul className="flex flex-wrap gap-1.5">
                {p.stack.map((t) => (
                  <li key={t} className="chip">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="page grid gap-12 py-14 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 border-l border-line text-sm">
            {visible.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-muted hover:border-accent hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-3xl space-y-14">
          {p.verification && (
          <aside className="flex gap-3 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <p>
              <span className="font-medium text-ink">Source of this case study. </span>
              {p.verification}
            </p>
          </aside>
          )}

          <Block id="overview" n={++n} title="Overview">
            <p className="text-lg leading-relaxed">{p.overview}</p>
          </Block>

          {has.problem && (
          <Block id="problem" n={++n} title="Problem & motivation">
            <div className="grid gap-6 sm:grid-cols-2">
              {p.problem && (
              <div>
                <p className="label mb-2">The problem</p>
                <p className="leading-relaxed text-muted">{p.problem}</p>
              </div>
              )}
              {p.motivation && (
              <div>
                <p className="label mb-2">Why build it</p>
                <p className="leading-relaxed text-muted">{p.motivation}</p>
              </div>
              )}
            </div>
          </Block>
          )}

          {has.objectives && (
          <Block id="objectives" n={++n} title="Objectives">
            <Bullets items={p.objectives} />
          </Block>
          )}

          {has.architecture && (
          <Block id="architecture" n={++n} title="Architecture">
            <ArchitectureDiagram stages={p.architecture} title={`${p.title} architecture`} />
          </Block>
          )}

          {has.features && (
          <Block id="features" n={++n} title="Key features">
            <Bullets items={p.features} />
          </Block>
          )}

          {has.workflow && (
          <Block id="workflow" n={++n} title="End-to-end workflow">
            <ol className="space-y-0">
              {p.workflow.map((w, i) => (
                <li key={w.title} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-7 last:pb-0">
                  <span className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface font-mono text-xs text-accent">
                    {i + 1}
                  </span>
                  {i < p.workflow.length - 1 && <span className="absolute left-[1.1rem] top-9 h-full w-px bg-line" aria-hidden />}
                  <div className="pt-1.5">
                    <p className="font-medium">{w.title}</p>
                    <p className="mt-1 leading-relaxed text-muted">{w.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>
          )}

          {has.decisions && (
          <Block id="decisions" n={++n} title="Implementation decisions">
            <dl className="grid gap-4 sm:grid-cols-2">
              {p.decisions.map((d) => (
                <div key={d.title} className="card p-5">
                  <dt className="font-medium">{d.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{d.detail}</dd>
                </div>
              ))}
            </dl>
          </Block>
          )}

          {has.challenges && (
          <Block id="challenges" n={++n} title="Challenges & solutions">
            <div className="overflow-hidden rounded-xl border border-line">
              {p.challenges.map((c, i) => (
                <div key={c.challenge} className={`grid gap-2 p-5 sm:grid-cols-2 sm:gap-6 ${i ? 'border-t border-line' : ''}`}>
                  <p className="font-medium">{c.challenge}</p>
                  <p className="leading-relaxed text-muted">{c.solution}</p>
                </div>
              ))}
            </div>
          </Block>
          )}

          {has.testing && (
          <Block id="testing" n={++n} title="Testing & validation">
            <Bullets items={p.testing} />
          </Block>
          )}

          {has.limits && (
          <Block id="limits" n={++n} title="Limitations & what’s next">
            <div className="grid gap-8 sm:grid-cols-2">
              {p.limitations.length > 0 && (
              <div>
                <p className="label mb-3">Current limitations</p>
                <Bullets items={p.limitations} />
              </div>
              )}
              {p.improvements.length > 0 && (
              <div>
                <p className="label mb-3">Planned improvements</p>
                <Bullets items={p.improvements} />
              </div>
              )}
            </div>
          </Block>
          )}

          {p.media.length > 0 && (
            <Block id="media" n={++n} title="Screenshots">
              <div className="space-y-8">
                {p.media.map((m) => {
                  const size = imageSize(m.src);
                  return (
                    <figure key={m.src} className="card overflow-hidden">
                      <img src={m.src} alt={m.alt} width={size?.w} height={size?.h} loading="lazy" decoding="async" className="h-auto w-full bg-raised" />
                      {m.caption && <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">{m.caption}</figcaption>}
                    </figure>
                  );
                })}
              </div>
            </Block>
          )}
        </div>
      </div>

      <nav aria-label="Next project" className="page">
        <Link to={`/projects/${next.slug}`} className="group card flex items-center justify-between gap-6 p-6 sm:p-8">
          <div>
            <p className="label">Next case study</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{next.title}</p>
            <p className="mt-1 text-muted">{next.tagline}</p>
          </div>
          <ArrowRight className="h-6 w-6 shrink-0 text-accent transition-transform group-hover:translate-x-1" aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
