import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const client = resolve('dist/client');
const out = resolve('out');
const html = readFileSync(resolve(client, 'index.html'), 'utf8');
if (!html.includes('Something good')) throw new Error('Dashboard was not exported');
mkdirSync(out, { recursive: true });
// Vinext nests prefixed assets; GitHub Pages already mounts out at /aimreboot-dashboard/.
cpSync(resolve(client, 'aimreboot-dashboard/_next'), resolve(out, '_next'), { recursive: true });
for (const name of ['index.html', 'index.rsc', 'favicon.svg']) {
  cpSync(resolve(client, name), resolve(out, name));
}
writeFileSync(resolve(out, '.nojekyll'), '');
for (const [, url] of html.matchAll(/(?:src|href)="(\/aimreboot-dashboard\/[^"?#]+)"/g)) {
  const file = resolve(out, url.slice('/aimreboot-dashboard/'.length));
  if (!existsSync(file)) throw new Error(`Missing exported asset: ${url}`);
}
console.log('GitHub Pages output ready; dashboard HTML and referenced assets verified.');
