import type { Project } from '../content';

/**
 * Abstract artwork for each project, drawn from what the project actually does:
 * grid = CrowdX's 3×3 zones, wave = power readings with an anomaly,
 * orbit = a taste profile with recommendations around it, route = a day-by-day trip,
 * nodes = symptom → disease classification.
 */
export function Motif({ kind, className = '' }: { kind: Project['motif']; className?: string }) {
  const stroke = 'rgb(var(--ink) / 0.22)';
  const faint = 'rgb(var(--ink) / 0.08)';
  const accent = 'rgb(var(--accent))';
  const violet = 'rgb(var(--violet))';

  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id={`g-${kind}`} cx="70%" cy="40%" r="70%">
          <stop offset="0" stopColor="rgb(var(--glow))" stopOpacity="0.28" />
          <stop offset="1" stopColor="rgb(var(--glow))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="180" fill={`url(#g-${kind})`} />

      {kind === 'grid' && (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => {
              const hot = (r === 1 && c === 2) || (r === 0 && c === 2);
              return (
                <rect
                  key={`${r}${c}`}
                  x={90 + c * 48}
                  y={22 + r * 46}
                  width="44"
                  height="42"
                  rx="6"
                  fill={hot ? (r === 1 ? 'rgb(var(--warn) / 0.35)' : 'rgb(var(--warn) / 0.15)') : faint}
                  stroke={hot ? 'rgb(var(--warn) / 0.7)' : stroke}
                />
              );
            }),
          )}
          {[
            [112, 40], [104, 92], [124, 138], [160, 50], [150, 120], [205, 38], [218, 52], [204, 64],
            [196, 86], [210, 92], [224, 102], [214, 112], [200, 104], [226, 84],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={i > 4 ? 'rgb(var(--warn))' : accent} />
          ))}
        </g>
      )}

      {kind === 'wave' && (
        <g fill="none">
          {[40, 80, 120, 160].map((y) => (
            <line key={y} x1="20" x2="300" y1={y} y2={y} stroke={faint} />
          ))}
          <path
            d="M20 120 C40 110 50 128 70 118 S100 104 120 116 S150 126 165 112 L172 40 L180 112 S205 124 225 110 S260 102 280 114 L300 110"
            stroke={accent}
            strokeWidth="2"
          />
          <path d="M20 140 C60 134 100 146 140 138 S220 132 300 140" stroke={violet} strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4 5" />
          <circle cx="172" cy="40" r="10" fill="none" stroke="rgb(var(--warn))" />
          <circle cx="172" cy="40" r="3" fill="rgb(var(--warn))" />
        </g>
      )}

      {kind === 'orbit' && (
        <g fill="none">
          <circle cx="160" cy="90" r="34" stroke={stroke} />
          <circle cx="160" cy="90" r="62" stroke={faint} />
          <circle cx="160" cy="90" r="88" stroke={faint} strokeDasharray="2 5" />
          <circle cx="160" cy="90" r="9" fill={accent} />
          {[
            [194, 88, accent], [134, 66, violet], [212, 40, accent], [102, 120, violet], [238, 118, accent], [86, 52, stroke],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <line x1="160" y1="90" x2={x as number} y2={y as number} stroke={faint} />
              <circle cx={x as number} cy={y as number} r={i < 2 ? 6 : 4} fill={c as string} />
            </g>
          ))}
        </g>
      )}

      {kind === 'route' && (
        <g fill="none">
          <path d="M40 140 C80 140 80 70 130 70 S180 130 220 110 S260 40 285 45" stroke={accent} strokeWidth="2" strokeDasharray="6 6" />
          {[
            [40, 140], [130, 70], [220, 110], [285, 45],
          ].map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="11" fill="rgb(var(--surface))" stroke={i === 3 ? violet : stroke} />
              <text x={x} y={y + 3.5} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono Variable, monospace" fill="rgb(var(--ink) / 0.75)">
                {i + 1}
              </text>
            </g>
          ))}
        </g>
      )}

      {kind === 'nodes' && (
        <g fill="none">
          {[40, 70, 100, 130].map((y, i) =>
            [60, 95, 130].map((y2, j) => <line key={`${i}${j}`} x1="100" y1={y} x2="220" y2={y2} stroke={faint} />),
          )}
          {[40, 70, 100, 130].map((y) => (
            <circle key={y} cx="100" cy={y} r="5" fill={stroke} />
          ))}
          {[60, 95, 130].map((y, i) => (
            <circle key={y} cx="220" cy={y} r="7" fill={i === 1 ? accent : stroke} />
          ))}
        </g>
      )}
    </svg>
  );
}
