# HLS NatureVerse Implementation

## Theme concept

NatureVerse presents HLS Inter College as a living learning ecosystem:

- **Sunlight** represents clarity, guidance and aspiration.
- **Green ground and roots** represent discipline, values and a strong foundation.
- **Leaves, growth paths and canopies** represent academic and personal development.
- **Soft 3D particles** represent ideas, energy and student potential moving through the campus environment.

The result is premium and atmospheric rather than cartoonish. It uses warm sunlight, forest green, soft meadow tones, glass-like surfaces and restrained depth animation.

## Protected landing hero

The existing landing-page `Hero.tsx` was not edited. Its SHA-256 checksum remains:

`0a32161f1fe996d6db616ee64da62fd167e2b51a0bc6d669f724c7b37859ddba`

The current hero image sequence, sticky behaviour, scrolling logic and timing remain unchanged.

## Implemented changes

- Applied NatureVerse to every landing-page section **below** the existing hero.
- Applied NatureVerse to About, Academics, Teachers, Events, Gallery, Leadership, Contact, Registration and teacher-profile routes.
- Added diagonal sun rays and soft sky haze.
- Added perspective-based rising and falling particles with varied depth, scale, blur and speed.
- Added a layered green ground, distant canopy haze and small grass silhouettes.
- Replaced the beige notebook-grid feeling with a natural sky-to-meadow palette.
- Replaced visible SchoolVerse wording with NatureVerse wording.
- Added page-specific nature ecosystem scenes such as Learning Canopy, Mentor Grove and Campus Bloom.
- Added a growth-tree ecosystem visual to the About page.
- Added `prefers-reduced-motion` support that disables particles and non-essential movement.
- Reduced particle density on smaller scene areas to protect performance.

## Important files

- `src/components/NatureVerseAtmosphere.tsx`
- `src/components/NatureVersePageWrapper.tsx`
- `src/components/NatureVerseScene.tsx`
- `src/components/natureverse/NatureVerseIllustrations.tsx`
- `src/App.tsx`
- `src/index.css`

## Verification

- `npm run lint` / `tsc --noEmit`: passed with zero TypeScript errors.
- CSS parsed successfully with no stylesheet syntax errors.
- The Linux production build could not be completed because the uploaded dependency folder contains Windows-specific Rollup binaries. On Windows, run a fresh `npm install` before building.

## Run on Windows

```powershell
cd "C:\Users\Nobita Sharma\OneDrive\Desktop\Project\HLS Inter College"
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
npm install
npm run dev
```

Then hard-refresh the browser with `Ctrl + Shift + R`.
