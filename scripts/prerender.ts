/**
 * Prerenders every route to static HTML with its own <head>, then writes 404.html,
 * sitemap.xml and robots.txt. Runs after `vite build` and the SSR build.
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname ?? __dirname, '..');
const dist = join(root, 'dist');
const site = JSON.parse(readFileSync(join(root, 'content', 'site.json'), 'utf8')) as { url: string };
// Preload the two fonts that paint above the fold (body/display sans + the italic serif accent).
const assets = readdirSync(join(dist, 'assets'));
const preloads = [/^inter-tight-latin-wght-normal-.*\.woff2$/, /^instrument-serif-latin-400-italic-.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`)
  .join('\n    ');
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace('<!--app-head-->', `${preloads}\n    <!--app-head-->`);

interface ServerEntry {
  render: (url: string) => { html: string; head: string };
  staticRoutes: string[];
}

const entryPath = join(root, 'dist-ssr', 'entry-server.js');
const { render, staticRoutes } = (await import(pathToFileURL(entryPath).href)) as ServerEntry;

function page(url: string) {
  const { html, head } = render(url);
  return template
    .replace(/<!--app-head-->[\s\S]*?<!--\/app-head-->/, head)
    .replace('<!--app-html-->', html);
}

for (const route of staticRoutes) {
  const out = route === '/' ? join(dist, 'index.html') : join(dist, route.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page(route));
  console.log(`  prerendered ${route}`);
}

writeFileSync(join(dist, '404.html'), page('/404'));
console.log('  prerendered 404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) =>
      `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : r.startsWith('/projects/') ? '0.8' : '0.7'}</priority></url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log('  wrote sitemap.xml, robots.txt');

rmSync(join(root, 'dist-ssr'), { recursive: true, force: true });
