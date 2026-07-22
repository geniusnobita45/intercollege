import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const frameCount = 240;
const variants = {
  desktop: 'public/hero/desktop',
  tablet: 'public/hero/tablet',
  mobile: 'public/hero/mobile',
};
const posters = [
  'public/hero/posters/hero-poster-mobile.avif',
  'public/hero/posters/hero-poster-tablet.avif',
  'public/hero/posters/hero-poster-desktop.avif',
];

const errors = [];

function assertFile(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push(`Missing file: ${relativePath}`);
    return;
  }
  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) errors.push(`Not a file: ${relativePath}`);
  if (stat.size <= 0) errors.push(`Empty file: ${relativePath}`);
}

for (const poster of posters) assertFile(poster);

for (const [variant, dir] of Object.entries(variants)) {
  const absoluteDir = path.join(root, dir);
  if (!fs.existsSync(absoluteDir)) {
    errors.push(`Missing directory: ${dir}`);
    continue;
  }

  const actual = new Set(fs.readdirSync(absoluteDir).filter((name) => name.endsWith('.webp')));
  for (let index = 0; index < frameCount; index += 1) {
    const expected = `frame_${String(index).padStart(4, '0')}.webp`;
    if (!actual.has(expected)) errors.push(`Missing ${variant} frame: ${expected}`);
    assertFile(path.join(dir, expected));
  }

  for (const name of actual) {
    if (!/^frame_\d{4}\.webp$/.test(name)) errors.push(`Unexpected ${variant} frame name: ${name}`);
    const number = Number(name.slice(6, 10));
    if (number < 0 || number >= frameCount) errors.push(`Unexpected ${variant} frame index: ${name}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Hero assets validated: 240 frames for desktop/tablet/mobile plus 3 posters.');

