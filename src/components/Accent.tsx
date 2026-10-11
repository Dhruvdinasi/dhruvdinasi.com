import { Fragment } from 'react';

/**
 * Renders text where *words in asterisks* get the italic serif accent.
 * Lets headlines be edited in /admin without touching code.
 */
export function Accent({ text, className = 'serif-accent text-accent' }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2 ? (
          <span key={i} className={className}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain text version (asterisks removed) for titles and meta tags. */
export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, '$1');
