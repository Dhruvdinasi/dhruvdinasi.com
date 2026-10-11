import { Award, ExternalLink, FileText, Maximize2, Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Accent } from '../components/Accent';
import { achievements, certifications, formatDate, imageSize, pages, type Certification } from '../content';

/** A certificate "has evidence" when there's an image, a PDF or a verification link. */
const hasEvidence = (c: Certification) => !!(c.image || c.file || c.url);

function CertThumb({ c, onOpen }: { c: Certification; onOpen: (c: Certification, el: HTMLElement) => void }) {
  if (c.image) {
    const size = imageSize(c.image);
    const portrait = size ? size.h > size.w : false;
    return (
      <button
        type="button"
        onClick={(e) => onOpen(c, e.currentTarget)}
        className="relative block w-full overflow-hidden border-b border-line bg-white"
        aria-label={`View certificate: ${c.title}, ${c.issuer}`}
      >
        <img
          src={c.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={size?.w}
          height={size?.h}
          className={`aspect-[1.4] h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${portrait ? 'object-[50%_18%]' : 'object-top'}`}
        />
        <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
        </span>
      </button>
    );
  }
  // No image: a typographic placeholder (PDF or link only)
  return (
    <div className="dot-field relative grid aspect-[1.4] place-items-center border-b border-line bg-raised/40" style={{ maskImage: 'none' }}>
      <div className="text-center">
        <Award className="mx-auto h-7 w-7 text-accent" aria-hidden />
        <p className="mt-2 px-6 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">{c.issuer}</p>
      </div>
    </div>
  );
}

export default function Certifications() {
  const [open, setOpen] = useState<Certification | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const withDocs = certifications.filter(hasEvidence);
  const others = certifications.filter((c) => !hasEvidence(c));
  const openCert = (c: Certification, el: HTMLElement) => {
    lastTrigger.current = el;
    setOpen(c);
  };

  return (
    <div className="page pt-14 sm:pt-20">
      <header className="pb-12">
        <p className="label">Certifications & achievements</p>
        <h1 className="h-display mt-4 max-w-3xl text-4xl leading-[1.05] sm:text-6xl">
          <Accent text={pages.certificationsHeadline} />
        </h1>
        {pages.certificationsIntro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{pages.certificationsIntro}</p>}
      </header>

      {achievements.length > 0 && (
        <section aria-labelledby="ach-h" className="mb-16">
          <h2 id="ach-h" className="label mb-4">
            Achievements
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map((a) => (
              <div key={a.title} className="reveal card flex items-start gap-4 p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                  <Trophy className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="mt-1 text-muted">{a.detail}</p>
                  <p className="mt-2 font-mono text-xs text-muted">{a.years}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="certs-h" className="mb-14">
        <h2 id="certs-h" className="label mb-4">
          Certificates · newest first
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withDocs.map((c) => (
            <li key={c.id} id={c.id} className="reveal card group flex scroll-mt-24 flex-col overflow-hidden">
              <CertThumb c={c} onOpen={openCert} />
              <div className="flex flex-1 flex-col p-5">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent">{c.group}</p>
                <p className="mt-2 font-semibold leading-snug">{c.title}</p>
                <p className="mt-1 text-sm text-muted">
                  {c.issuer}
                  {c.via ? ` · ${c.via}` : ''}
                </p>
                {c.topics.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {c.topics.map((t) => (
                      <li key={t} className="chip">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                  <p className="font-mono text-xs text-muted">{formatDate(c.date)}</p>
                  <div className="flex gap-3 text-sm">
                    {c.file && (
                      <a href={c.file} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-muted hover:text-ink">
                        <FileText className="h-3.5 w-3.5" aria-hidden /> PDF
                      </a>
                    )}
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-muted hover:text-ink">
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Verify
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="listed-h" className="mb-8">
          <h2 id="listed-h" className="label mb-4">
            Other credentials
          </h2>
          <ul className="divide-y divide-line border-y border-line">
            {others.map((c) => (
              <li key={c.id} id={c.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-4">
                <FileText className="h-4 w-4 shrink-0 text-muted" aria-hidden />
                <span className="font-medium">{c.title}</span>
                <span className="text-sm text-muted">{c.issuer}</span>
                {c.date && <span className="font-mono text-xs text-muted">{formatDate(c.date)}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Backdrop click closes; keyboard users get Escape natively from <dialog> plus the close button. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <dialog
        ref={dialog}
        onClose={() => {
          setOpen(null);
          lastTrigger.current?.focus();
        }}
        onClick={(e) => e.target === dialog.current && setOpen(null)}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-w-none rounded-2xl border border-line bg-surface p-0 text-ink backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        aria-labelledby="dlg-title"
      >
        {open && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
              <div>
                <p id="dlg-title" className="font-semibold">
                  {open.title}
                </p>
                <p className="text-sm text-muted">
                  {open.issuer}
                  {open.date ? ` · ${formatDate(open.date)}` : ''}
                  {open.credentialId && <span className="ml-2 hidden font-mono text-xs sm:inline">ID {open.credentialId.length > 20 ? `${open.credentialId.slice(0, 18)}…` : open.credentialId}</span>}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(null)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-raised" aria-label="Close certificate">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <img src={open.image} alt={`Certificate: ${open.title}, issued by ${open.issuer}`} className="max-h-[78vh] w-full bg-white object-contain" />
          </div>
        )}
      </dialog>
    </div>
  );
}
