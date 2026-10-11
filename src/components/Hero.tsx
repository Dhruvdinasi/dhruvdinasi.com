import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Download, Mail, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProject, home, site } from '../content';
import { usePrefersReducedMotion } from '../lib/hooks';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { Motif } from './Motif';

/** Each rotating word maps to the project that "pays attention" to it (edited in /admin → Home page). */
const signals = home.signals.filter((s) => getProject(s.project));

const INTERVAL = 3600;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const running = !paused && !hovering && !reduced;

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % signals.length), INTERVAL);
    return () => window.clearInterval(t);
  }, [running]);

  const s = signals[i % Math.max(1, signals.length)];
  const p = s ? getProject(s.project) : undefined;

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="dot-field pointer-events-none absolute inset-0" aria-hidden />
      <div className="glow pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem]" aria-hidden />

      <div className="page relative grid gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16 lg:pb-16 lg:pt-20">
        <div>
          <p className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {home.eyebrow}
          </p>

          <h1 id="hero-title" className="h-display mt-6 max-w-[13ch] text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]">
            <span className="sr-only">
              {home.headlineStart} {signals.map((x) => x.word.replace(/\.$/, '')).join(', ')}.
            </span>
            <span aria-hidden="true">
              {home.headlineStart}{' '}
              <span className="relative inline-grid align-baseline">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={s?.word}
                    initial={{ y: '0.45em', opacity: 0, filter: 'blur(6px)' }}
                    animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-0.45em', opacity: 0, filter: 'blur(6px)' }}
                    transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                    className="serif-accent col-start-1 row-start-1 text-accent"
                  >
                    {s?.word}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">{home.lede}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/projects" className="btn-primary">
              Explore projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={site.resumePdf} download className="btn-ghost">
              <Download className="h-4 w-4" aria-hidden /> Download resume
            </a>
            <Link to="/contact" className="btn-ghost">
              <Mail className="h-4 w-4" aria-hidden /> Contact me
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-5 text-sm text-muted">
            <a href={site.github} target="_blank" rel="me noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <GitHubIcon /> github.com/{site.githubHandle}
            </a>
            <a href={site.linkedin} target="_blank" rel="me noopener" className="inline-flex items-center gap-2 hover:text-ink">
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>

        {/* Instrument panel: the project behind the current word */}
        {p && s && (
        <div
          className="card relative overflow-hidden"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onFocusCapture={() => setHovering(true)}
          onBlurCapture={() => setHovering(false)}
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex items-center gap-2" aria-hidden>
              {signals.map((x, n) => (
                <span key={x.project} className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? 'w-6 bg-accent' : 'w-1.5 bg-line'}`} />
              ))}
            </div>
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-raised hover:text-ink"
                aria-label={paused ? 'Resume rotating headline' : 'Pause rotating headline'}
              >
                {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
              </button>
            )}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.slug}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Motif kind={p.motif} className="aspect-[16/9] w-full" />
              <div className="border-t border-line p-5">
                <p className="label">Currently showing</p>
                <p className="mt-1.5 text-xl font-semibold tracking-tight">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{p.tagline}</p>
                <ol className="mt-4 flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] text-muted" aria-label="Pipeline">
                  {s.pipeline.map((step, n) => (
                    <li key={step} className="flex items-center gap-1.5">
                      <span className="rounded-md border border-line bg-raised/60 px-2 py-1">{step}</span>
                      {n < s.pipeline.length - 1 && <span aria-hidden>→</span>}
                    </li>
                  ))}
                </ol>
                <Link
                  to={`/projects/${p.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Read the case study <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        )}
      </div>
    </section>
  );
}
