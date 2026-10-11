import { ArrowUpRight, Check, Copy, Download, Loader2, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { GitHubIcon, LinkedInIcon } from '../components/BrandIcons';
import { Accent } from '../components/Accent';
import { formatDate, pages, site } from '../content';

/**
 * The form only renders when VITE_CONTACT_ENDPOINT is set (e.g. a Formspree endpoint).
 * Without it, visitors get the email address — no fake form.
 */
const ENDPOINT = (import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined)?.trim() || '';

type Status = 'idle' | 'sending' | 'sent' | 'error';

function validate(data: { name: string; email: string; message: string }) {
  const e: Partial<Record<keyof typeof data, string>> = {};
  if (data.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) e.email = 'Please enter a valid email address.';
  if (data.message.trim().length < 10) e.message = 'A little more detail, please (10+ characters).';
  if (data.message.length > 5000) e.message = 'Please keep it under 5,000 characters.';
  return e;
}

function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return; // honeypot
    const data = { name: String(fd.get('name') ?? ''), email: String(fd.get('email') ?? ''), message: String(fd.get('message') ?? '') };
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="card flex items-start gap-4 p-6">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="font-semibold">Message sent — thank you.</p>
          <p className="mt-1 text-muted">I’ll reply to the email you gave.</p>
          <button type="button" className="mt-4 text-sm font-medium text-accent hover:underline" onClick={() => setStatus('idle')}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  const field = 'mt-2 w-full rounded-xl border bg-bg px-4 py-3 text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none';
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8" aria-describedby="form-note">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {(['name', 'email'] as const).map((k) => (
        <div key={k}>
          <label htmlFor={k} className="text-sm font-medium">
            {k === 'name' ? 'Your name' : 'Email'}
          </label>
          <input
            id={k}
            name={k}
            type={k === 'email' ? 'email' : 'text'}
            autoComplete={k}
            required
            aria-invalid={!!errors[k]}
            aria-describedby={errors[k] ? `${k}-err` : undefined}
            className={`${field} ${errors[k] ? 'border-warn' : 'border-line'}`}
          />
          {errors[k] && (
            <p id={`${k}-err`} className="mt-1.5 text-sm text-warn">
              {errors[k]}
            </p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="message" className="text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-err' : undefined}
          className={`${field} resize-y ${errors.message ? 'border-warn' : 'border-line'}`}
        />
        {errors.message && (
          <p id="message-err" className="mt-1.5 text-sm text-warn">
            {errors.message}
          </p>
        )}
      </div>
      {status === 'error' && (
        <p role="alert" className="rounded-lg border border-warn/40 bg-warn/10 p-3 text-sm">
          Something went wrong sending that. Please try again, or email me directly at{' '}
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
          .
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p id="form-note" className="text-xs text-muted">
          Your message is delivered to my inbox. No newsletters, no tracking.
        </p>
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>
      </div>
    </form>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  const links = [
    { href: site.github, label: 'GitHub', sub: `github.com/${site.githubHandle}`, icon: <GitHubIcon className="h-5 w-5" /> },
    { href: site.linkedin, label: 'LinkedIn', sub: 'in/dhruv-dinasi', icon: <LinkedInIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="page pt-14 sm:pt-20">
      <header className="pb-12">
        <p className="label">Contact</p>
        <h1 className="h-display mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          <Accent text={pages.contactHeadline} />
        </h1>
        {pages.contactIntro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{pages.contactIntro}</p>}
      </header>

      <div className={`grid gap-6 ${ENDPOINT ? 'lg:grid-cols-[1fr_1.2fr]' : 'lg:grid-cols-2'}`}>
        <div className="space-y-4">
          <div className="card p-6 sm:p-8">
            <p className="label">Email</p>
            <a href={`mailto:${site.email}`} className="mt-3 block break-all text-xl font-semibold tracking-tight hover:text-accent sm:text-2xl">
              {site.email}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={`mailto:${site.email}`} className="btn-primary">
                <Mail className="h-4 w-4" aria-hidden /> Write an email
              </a>
              <button type="button" onClick={copy} className="btn-ghost" aria-live="polite">
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? 'Copied' : 'Copy address'}
              </button>
            </div>
          </div>
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="me noopener" className="card group flex items-center gap-4 p-5 hover:border-ink/25">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised">{l.icon}</span>
              <span className="flex-1">
                <span className="block font-medium">{l.label}</span>
                <span className="block text-sm text-muted">{l.sub}</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          ))}
          <a href={site.resumePdf} download className="card group flex items-center gap-4 p-5 hover:border-ink/25">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-raised">
              <Download className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block font-medium">Resume</span>
              <span className="block text-sm text-muted">PDF · updated {formatDate(site.resumeUpdated)}</span>
            </span>
          </a>
        </div>
        {ENDPOINT ? (
          <ContactForm />
        ) : (
          <div className="card hidden flex-col justify-between p-8 lg:flex">
            <p className="label">Based in</p>
            <div>
              <p className="text-3xl font-semibold tracking-tight">Bangalore, India</p>
              <p className="mt-2 font-mono text-sm text-muted">IST · UTC+05:30</p>
              <p className="mt-6 max-w-sm leading-relaxed text-muted">
                {site.degree} · {site.college} · graduating {site.graduationYear}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
