import { motion, LayoutGroup } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ProjectCard } from '../components/ui';
import { Accent } from '../components/Accent';
import { categories, pages, projects, type Category } from '../content';

type Filter = 'All' | Category;

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const full = projects.filter((p) => p.caseStudy);
  const small = projects.filter((p) => !p.caseStudy);
  const shown = useMemo(() => (filter === 'All' ? full : full.filter((p) => p.categories.includes(filter))), [filter, full]);
  const counts = (c: Filter) => (c === 'All' ? full.length : full.filter((p) => p.categories.includes(c)).length);

  return (
    <>
      <header className="page pb-10 pt-14 sm:pt-20">
        <p className="label">Work</p>
        <h1 className="h-display mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          <Accent text={pages.projectsHeadline} />
        </h1>
        {pages.projectsIntro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{pages.projectsIntro}</p>}
      </header>

      <section className="page" aria-label="Project list">
        <div role="group" aria-label="Filter projects by category" className="mb-8 flex flex-wrap gap-2">
          <LayoutGroup>
            {(['All', ...categories] as Filter[]).map((c) => {
              const active = filter === c;
              const n = counts(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={active}
                  disabled={n === 0}
                  className={`relative min-h-[40px] rounded-full border px-4 text-sm transition-colors disabled:opacity-40 ${
                    active ? 'border-transparent text-accent-ink' : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />
                  )}
                  <span className="relative">
                    {c} <span className="font-mono text-xs opacity-70">{n}</span>
                  </span>
                </button>
              );
            })}
          </LayoutGroup>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {shown.length} {shown.length === 1 ? 'project' : 'projects'}
          {filter === 'All' ? '' : ` in ${filter}`}.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {shown.map((p) => (
            <motion.div key={p.slug} layout transition={{ duration: 0.3 }} className="flex">
              <ProjectCard project={p} reveal={false} />
            </motion.div>
          ))}
        </div>

        {small.length > 0 && (
          <div className="mt-16">
            <p className="label mb-4">Smaller projects</p>
            <ul className="divide-y divide-line border-y border-line">
              {small.map((p) => (
                <li key={p.slug} id={p.slug} className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr_auto] sm:gap-8">
                  <span className="font-mono text-xs text-muted">{p.date}</span>
                  <div>
                    <h2 className="font-semibold">{p.title}</h2>
                    <p className="mt-1 max-w-2xl leading-relaxed text-muted">{p.overview}</p>
                  </div>
                  <ul className="flex flex-wrap gap-1.5 sm:justify-end">
                    {p.stack.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}
