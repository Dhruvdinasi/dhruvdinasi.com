import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProjectCard, SectionHeader } from '../components/ui';
import { Accent } from '../components/Accent';
import { about, achievements, experience, home, projects, site, skillGroups } from '../content';

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const homeAchievements = achievements.filter((a) => a.showOnHome);
  const latestExperience = experience[0];
  return (
    <>
      <Hero />

      {latestExperience && (
        <div className="page">
          <Link
            to="/resume#experience"
            className="reveal group flex flex-col gap-1 rounded-2xl border border-line bg-surface/60 px-5 py-4 transition-colors hover:border-ink/25 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <span className="flex items-center gap-3">
              <span className="label text-accent">Experience</span>
              <span className="font-medium">
                {latestExperience.role} · {latestExperience.organisation}
              </span>
            </span>
            <span className="flex items-center gap-2 text-sm text-muted">
              {[latestExperience.programme, latestExperience.duration].filter(Boolean).join(' · ')}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        </div>
      )}

      {/* Selected work */}
      <section className="page pb-16 pt-12 sm:pb-24 sm:pt-16" aria-labelledby="work-title">
        <SectionHeader index="01" kicker={home.workKicker} title={<Accent text={home.workTitle} />} id="work-title">
          {home.workIntro}
        </SectionHeader>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard key={p.slug} project={p} delay={(i % 2) * 90} />
          ))}
        </div>
        <div className="reveal mt-8">
          <Link to="/projects" className="btn-ghost">
            All projects <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* How I work */}
      <section className="border-y border-line bg-surface/40" aria-labelledby="approach-title">
        <div className="page py-16 sm:py-24">
          <SectionHeader index="02" kicker="Approach" title={<Accent text={home.approachTitle} />} id="approach-title" />
          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {about.approach.map((a, i) => (
              <li key={a.title} className="reveal bg-bg p-7" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <span className="font-mono text-xs text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{a.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Skills, compact */}
      <section className="page py-16 sm:py-24" aria-labelledby="skills-title">
        <SectionHeader index="03" kicker="Toolkit" title={<Accent text={home.skillsTitle} />} id="skills-title">
          {home.skillsIntro}
        </SectionHeader>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(skillGroups.some((g) => g.showOnHome) ? skillGroups.filter((g) => g.showOnHome) : skillGroups.slice(0, 3)).map((g, i) => (
            <div key={g.id} className="reveal card p-6" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <h3 className="font-semibold tracking-tight">{g.title}</h3>
              <p className="mt-1 text-sm text-muted">{g.blurb}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li key={s.name} className="chip">
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link to="/about#skills" className="reveal mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
          Full skills list <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </section>

      {/* Beyond code + Now */}
      <section className="page grid gap-5 pb-8 lg:grid-cols-[1.3fr_1fr]" aria-label="Beyond code and now">
        <div className="reveal card relative overflow-hidden p-7 sm:p-9">
          <p className="label">
            <span className="mr-2 text-accent">04</span>Beyond code
          </p>
          <h2 className="h-display mt-3 text-3xl leading-tight">
            <Accent text={home.beyondTitle} />
          </h2>
          {about.interests[0] && <p className="mt-4 max-w-lg leading-relaxed text-muted">{about.interests[0].body}</p>}
          {homeAchievements.length > 0 && (
            <dl className="mt-7 flex flex-wrap gap-8">
              {homeAchievements.map((a) => (
                <div key={a.title}>
                  <dt className="label">{a.years}</dt>
                  <dd className="mt-1 font-medium">{a.title}</dd>
                </div>
              ))}
            </dl>
          )}
          <Link to="/about#beyond-code" className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
            More about me <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <CricketSeam />
        </div>

        <div className="reveal card p-7 sm:p-9" style={{ ['--d' as string]: '90ms' }}>
          <p className="label flex items-center gap-2">
            <span className="anim-pulse h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Now · {about.nowReviewed}
          </p>
          <ul className="mt-5 space-y-5">
            {about.now.map((n) => (
              <li key={n.label}>
                <p className="font-mono text-xs text-muted">{n.label}</p>
                <p className="mt-1 leading-relaxed">{n.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="page pt-16" aria-labelledby="cta-title">
        <div className="reveal relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="glow pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 -translate-y-1/2" aria-hidden />
          <p className="label relative">{home.ctaKicker}</p>
          <h2 id="cta-title" className="h-display relative mx-auto mt-4 max-w-2xl text-3xl leading-tight sm:text-5xl">
            <Accent text={home.ctaTitle} />
          </h2>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${site.email}`} className="btn-primary">
              Email me
            </a>
            <a href={site.resumePdf} download className="btn-ghost">
              Download resume
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function CricketSeam() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 text-ink/10 sm:h-64 sm:w-64"
      fill="none"
      stroke="currentColor"
    >
      <g className="anim-drift">
        <circle cx="100" cy="100" r="92" strokeWidth="1.5" />
        <path d="M40 30 C80 80 80 120 40 170" strokeWidth="1.2" />
        <path d="M50 24 C92 78 92 122 50 176" strokeWidth="1.2" />
        {Array.from({ length: 12 }).map((_, i) => {
          const y = 40 + i * 11;
          return <line key={i} x1="62" x2="76" y1={y} y2={y + 2} strokeWidth="1" />;
        })}
      </g>
    </svg>
  );
}
