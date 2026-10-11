/**
 * Static link check over the built site:
 *  - every internal href/src resolves to a file in dist/ (or a prerendered route)
 *  - every #fragment on an internal link exists on its target page
 *  - every page has a title, description, canonical (unless noindex) and exactly one <h1>
 * External links are listed for manual review (the build machine may not have internet access).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname ?? __dirname, '..', 'dist');
const pages: string[] = [];
(function walk(dir: string) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f !== 'admin') walk(p); // the CMS page is not part of the public site
    }
    else if (f.endsWith('.html')) pages.push(p);
  }
})(dist);

const routeFile = (path: string) => {
  const clean = path.split('#')[0].split('?')[0];
  if (clean === '/' || clean === '') return join(dist, 'index.html');
  const direct = join(dist, clean);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const asDir = join(dist, clean, 'index.html');
  return existsSync(asDir) ? asDir : null;
};

const errors: string[] = [];
const external = new Set<string>();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(dist, '') || '/';
  const isNotFound = rel.endsWith('404.html');

  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${rel}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) errors.push(`${rel}: missing description`);
  if (!isNotFound && !/<link rel="canonical" href="https:\/\/dhruvdinasi\.com[^"]*"/.test(html)) errors.push(`${rel}: missing canonical`);
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1s !== 1) errors.push(`${rel}: expected 1 <h1>, found ${h1s}`);
  const imgsNoAlt = html.match(/<img(?![^>]*\balt=)[^>]*>/g);
  if (imgsNoAlt) errors.push(`${rel}: <img> without alt (${imgsNoAlt.length})`);

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1].replace(/&amp;/g, '&');
    if (/^(mailto:|tel:|data:|javascript:)/.test(url)) continue;
    if (/^https?:\/\//.test(url)) {
      if (!url.startsWith('https://dhruvdinasi.com')) external.add(url);
      continue;
    }
    if (url.startsWith('#')) {
      const id = url.slice(1);
      if (id && !html.includes(`id="${id}"`)) errors.push(`${rel}: missing in-page anchor ${url}`);
      continue;
    }
    const target = routeFile(url);
    if (!target) {
      errors.push(`${rel}: broken internal link ${url}`);
      continue;
    }
    const hash = url.split('#')[1];
    if (hash && target.endsWith('.html')) {
      const t = readFileSync(target, 'utf8');
      if (!t.includes(`id="${hash}"`)) errors.push(`${rel}: ${url} → anchor #${hash} not found`);
    }
  }
}

console.log(`Checked ${pages.length} HTML pages.`);
console.log(`External links to review (${external.size}):`);
for (const u of [...external].sort()) console.log(`  ${u}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('\n✓ No broken internal links, anchors, or missing head tags.');
