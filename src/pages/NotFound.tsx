import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../content';

export default function NotFound() {
  return (
    <div className="page grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="font-mono text-sm text-accent">404 · no detections in this zone</p>
        <h1 className="h-display mt-4 text-4xl sm:text-6xl">
          This page <span className="serif-accent text-accent">doesn’t exist.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-muted">The link may be old or mistyped. Here are some places that do exist:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Home
          </Link>
          {projects
            .filter((p) => p.featured)
            .slice(0, 3)
            .map((p) => (
              <Link key={p.slug} to={`/projects/${p.slug}`} className="btn-ghost">
                {p.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
