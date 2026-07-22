import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const distDir = 'dist';
const routes = [
  'about',
  'academics',
  'teachers',
  'events',
  'gallery',
  'contact',
  'leadership',
  'registration',
];

const source = join(distDir, 'index.html');

await Promise.all(routes.map(async (route) => {
  const target = join(distDir, route, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
}));

await writeFile(join(distDir, '404.html'), await import('node:fs/promises').then((fs) => fs.readFile(source, 'utf8')));

console.log(`Created SPA fallbacks for ${routes.length} routes.`);