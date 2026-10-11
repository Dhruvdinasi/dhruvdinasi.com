import { getProject, projects, site } from './content';

export interface Meta {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>[];
}

const person = {
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  alternateName: site.fullName,
  url: site.url,
  email: `mailto:${site.email}`,
  jobTitle: 'Information Science and Engineering student',
  description: site.description,
  address: { '@type': 'PostalAddress', addressLocality: 'Bangalore', addressCountry: 'IN' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: site.college },
  knowsAbout: ['Software engineering', 'Machine learning', 'Computer vision', 'Recommendation systems', 'Full-stack development', 'Data analytics'],
  sameAs: [site.github, site.linkedin],
};

/** Every indexable route. Used by the prerenderer and sitemap. */
export const staticRoutes = [
  '/',
  '/about',
  '/projects',
  ...projects.filter((p) => p.caseStudy).map((p) => `/projects/${p.slug}`),
  '/resume',
  '/certifications',
  '/contact',
];

export function metaFor(path: string): Meta {
  const clean = path.replace(/\/+$/, '') || '/';
  switch (clean) {
    case '/':
      return {
        title: `${site.name} — AI & software engineering portfolio`,
        description: site.description,
        path: '/',
        type: 'profile',
        jsonLd: [
          { '@context': 'https://schema.org', '@type': 'ProfilePage', mainEntity: person, url: site.url },
          { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url },
        ],
      };
    case '/about':
      return {
        title: `About — ${site.name}`,
        description: 'Education, approach, skills, timeline and interests of Dhruv Dinasi, an Information Science student at RVITM Bangalore.',
        path: '/about',
        type: 'profile',
        jsonLd: [{ '@context': 'https://schema.org', ...person }],
      };
    case '/projects':
      return {
        title: `Projects — ${site.name}`,
        description: 'Case studies: CINEMETA (cold-start recommendations), CrowdX (real-time crowd monitoring), Smart Energy Meter and AI Travel Planner.',
        path: '/projects',
      };
    case '/resume':
      return {
        title: `Resume — ${site.name}`,
        description: 'Resume of Dhruv Dinasi: education, technical skills, projects and certifications. Download the PDF.',
        path: '/resume',
      };
    case '/certifications':
      return {
        title: `Certifications & achievements — ${site.name}`,
        description: 'Verified certificates from Cisco, Microsoft & LinkedIn, AWS, IBM, JPMorgan Chase and Deloitte, plus cricket achievements.',
        path: '/certifications',
      };
    case '/contact':
      return {
        title: `Contact — ${site.name}`,
        description: 'Get in touch with Dhruv Dinasi about internships, projects or collaboration.',
        path: '/contact',
      };
    default: {
      const m = clean.match(/^\/projects\/([\w-]+)$/);
      const p = m ? getProject(m[1]) : undefined;
      if (p && p.caseStudy) {
        return {
          title: `${p.title} — case study · ${site.name}`,
          description: `${p.tagline} Built with ${p.stack.slice(0, 4).join(', ')}.`,
          path: clean,
          type: 'article',
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: p.title,
              description: p.tagline,
              ...(p.repo ? { codeRepository: p.repo } : {}),
              programmingLanguage: p.stack,
              author: { '@id': `${site.url}/#person`, '@type': 'Person', name: site.name },
              url: `${site.url}${clean}`,
            },
          ],
        };
      }
      return {
        title: `Page not found — ${site.name}`,
        description: 'This page does not exist.',
        path: clean,
        noindex: true,
      };
    }
  }
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** Head tags as an HTML string — used at prerender time. */
export function headHtml(meta: Meta): string {
  const url = `${site.url}${meta.path === '/' ? '/' : meta.path}`;
  const img = `${site.url}${meta.image ?? site.ogImage}`;
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${meta.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${site.name}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc(site.name)} — AI &amp; software engineering" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${img}" />`,
    ...(meta.jsonLd ?? []).map(
      (j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`,
    ),
  ];
  return tags.join('\n    ');
}
