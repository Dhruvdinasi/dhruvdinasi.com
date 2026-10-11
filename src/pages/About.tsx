import { ArrowUpRight, Award, BookOpen, Briefcase, Code2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui';
import { Accent } from '../components/Accent';
import { about, getProject, site, skillGroups, timeline, type TimelineEntry } from '../content';

const kindIcon: Record<TimelineEntry['kind'], typeof Code2> = {
  education: BookOpen,
  project: Code2,
  credential: Award,
  achievement: Trophy,
  experience: Briefcase,
};

export default function About() {
  return (
    <>
      <header className="page pb-12 pt-14 sm:pt-20">
        <p className="label">About</p>
        <h1 className="h-display mt-4 max-w-4xl text-4xl leading-[1.05] sm:text-6xl">
          <Accent text={about.headline} />
        </h1>
      </header>

      <section className="page grid gap-12 lg:grid-cols-[1fr_20rem]" aria-label="Introduction">
        <div className="prose-body max-w-2xl text-lg leading-relaxed text-muted">
          {about.intro.map((p) => (
            <p key={p.slice(0, 20)} className="reveal">
              {p}
            </p>
          ))}
          {about.aspiration && <p className="reveal text-ink">{about.aspiration}</p>}
        </div>
        <aside className="reveal card h-fit p-6">
          <p className="label">At a glance</p>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted">Studying</dt>
              <dd className="mt-0.5 font-medium">{site.degree}</dd>
            </div>
            <div>
              <dt className="text-muted">College</dt>
              <dd className="mt-0.5 font-medium">
                {site.college}, {site.location.split(',')[0]}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Years</dt>
              <dd className="mt-0.5 font-medium">
                {site.startYear} – {site.graduationYear} (expected){site.cgpa ? ` · CGPA ${site.cgpa}` : ''}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Focus</dt>
              <dd className="mt-0.5 font-medium">{site.focus}</dd>
            </div>
          </dl>
        </aside>
      </section>

      {/* Approach */}
      <section className="page py-20" aria-labelledby="approach">
        <SectionHeader kicker="Approach" title="How I work on a project" id="approach" />
        <div className="grid gap-5 md:grid-cols-3">
          {about.approach.map((a, i) => (
            <div key={a.title} className="reveal card p-6" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-3 font-semibold">{a.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="border-y border-line bg-surface/40" aria-labelledby="skills-h">
        <div className="page py-20">
          <SectionHeader kicker="Skills" title="Toolkit, grouped by purpose" id="skills-h">
            No percentages. Where a tool was used in a project, the project is linked.
          </SectionHeader>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((g, i) => (
              <div key={g.id} className="reveal card p-6" style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}>
                <h3 className="font-semibold tracking-tight">{g.title}</h3>
                <p className="mt-1 text-sm text-muted">{g.blurb}</p>
                <ul className="mt-5 divide-y divide-line/70 text-sm">
                  {g.skills.map((s) => (
                    <li key={s.name} className="flex items-baseline justify-between gap-3 py-2.5">
                      <span>{s.name}</span>
                      {s.usedIn && (
                        <span className="flex flex-wrap justify-end gap-x-2 font-mono text-[0.7rem]">
                          {s.usedIn.map((slug) => {
                            const p = getProject(slug);
                            if (!p) return null;
                            return p.caseStudy ? (
                              <Link key={slug} to={`/projects/${slug}`} className="text-accent hover:underline">
                                {p.title.split(' ')[0]}
                              </Link>
                            ) : (
                              <span key={slug} className="text-muted">
                                {p.title.split(' ')[0]}
                              </span>
                            );
                          })}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="page py-20" aria-labelledby="timeline-h">
        <SectionHeader kicker="Timeline" title="Education, projects and milestones" id="timeline-h" />
        <ol className="relative ml-3 border-l border-line">
          {timeline.map((t) => {
            const Icon = kindIcon[t.kind];
            const body = (
              <>
                <p className="font-mono text-xs text-muted">{t.when}</p>
                <p className="mt-1 font-medium">
                  {t.title}
                  {t.href && <ArrowUpRight className="ml-1 inline h-3.5 w-3.5 text-muted" aria-hidden />}
                </p>
                <p className="mt-1 text-sm text-muted">{t.detail}</p>
              </>
            );
            return (
              <li key={`${t.kind}-${t.title}`} className="reveal relative pb-8 pl-8 last:pb-0">
                <span className="absolute -left-[13px] top-0 grid h-6 w-6 place-items-center rounded-full border border-line bg-bg text-accent">
                  <Icon className="h-3 w-3" aria-hidden />
                </span>
                {t.href ? (
                  <Link to={t.href} className="block rounded-lg hover:[&_p:nth-child(2)]:text-accent">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* Learning next */}
      <section className="page pb-20" aria-labelledby="next-h">
        <SectionHeader kicker="Learning next" title="Where I’m heading" id="next-h" />
        <ul className="grid gap-3 md:grid-cols-2">
          {about.learningNext.map((l, i) => (
            <li key={l} className="reveal flex gap-4 rounded-xl border border-line p-5">
              <span className="font-mono text-xs text-accent">→{i + 1}</span>
              <span className="leading-relaxed">{l}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Beyond code */}
      <section id="beyond-code" className="border-t border-line bg-surface/40" aria-labelledby="beyond-h">
        <div className="page py-20">
          <SectionHeader kicker="Beyond code" title={<>Outside the editor</>} id="beyond-h" />
          <div className="grid gap-5 md:grid-cols-3">
            {about.interests.map((x, i) => (
              <article key={x.title} className="reveal card p-6" style={{ ['--d' as string]: `${i * 70}ms` }}>
                <p className="label">{x.kicker}</p>
                <h3 className="mt-3 text-lg font-semibold">{x.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{x.body}</p>
              </article>
            ))}
          </div>
          <div className="reveal mt-12 rounded-2xl border border-line p-6 sm:p-8">
            <p className="label">Now · {about.nowReviewed}</p>
            <ul className="mt-4 grid gap-5 sm:grid-cols-3">
              {about.now.map((n) => (
                <li key={n.label}>
                  <p className="font-mono text-xs text-muted">{n.label}</p>
                  <p className="mt-1">{n.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
