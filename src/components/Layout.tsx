import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { pages, site } from '../content';
import { Accent } from './Accent';
import { GitHubIcon, LinkedInIcon } from './BrandIcons';
import { ThemeToggle } from './ThemeToggle';

const nav = [
  { to: '/projects', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/resume', label: 'Resume' },
  { to: '/certifications', label: 'Certifications' },
  { to: '/contact', label: 'Contact' },
];

function Monogram() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface font-mono text-[0.78rem] font-semibold text-ink transition-colors group-hover:border-accent/60">
        dd
      </span>
      <span className="sr-only text-[0.95rem] font-medium tracking-tight text-ink sm:not-sr-only">Dhruv Dinasi</span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || open ? 'border-b border-line/70 bg-bg/80 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="page flex h-16 items-center justify-between">
        <Monogram />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm transition-colors ${isActive ? 'bg-raised text-ink' : 'text-muted hover:text-ink'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-raised md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="page flex flex-col pb-5 pt-1">
              {nav.map((n) => (
                <li key={n.to}>
                  <NavLink
                    to={n.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between border-b border-line/60 py-4 text-lg ${isActive ? 'text-ink' : 'text-muted'}`
                    }
                  >
                    {n.label}
                    <ArrowUpRight className="h-4 w-4 opacity-50" aria-hidden />
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold tracking-tight">
            <Accent text={pages.footerLine} />
          </p>
          <a href={`mailto:${site.email}`} className="link-underline mt-3 inline-block text-muted hover:text-ink">
            {site.email}
          </a>
        </div>
        <div>
          <p className="label mb-3">Elsewhere</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={site.github} className="inline-flex items-center gap-2 text-muted hover:text-ink" rel="me noopener" target="_blank">
                <GitHubIcon /> GitHub
              </a>
            </li>
            <li>
              <a href={site.linkedin} className="inline-flex items-center gap-2 text-muted hover:text-ink" rel="me noopener" target="_blank">
                <LinkedInIcon /> LinkedIn
              </a>
            </li>
            <li>
              <a href={site.resumePdf} className="text-muted hover:text-ink" download>
                Resume (PDF)
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="label mb-3">Site</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-muted hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="page flex flex-col gap-2 border-t border-line/60 py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.fullName} · Bangalore, India</p>
        <p className="font-mono">dhruvdinasi.com · dhruvdinasi.in</p>
      </div>
    </footer>
  );
}

export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-full bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-3"
    >
      Skip to content
    </a>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
