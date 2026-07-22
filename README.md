# HLS Inter College animated website

Vite + React + TypeScript + Tailwind CSS website adapted from the supplied template. The home hero uses all 240 supplied JPEG frames as a scroll-controlled canvas sequence. The project includes online student registration, a searchable faculty directory, individual teacher profiles, and a new visual treatment for every inner page.

## Main routes

- `/` — animated landing page; hero implementation unchanged
- `/registration` — four-step online student registration
- `/teachers` — searchable teacher directory
- `/teachers/<profile-slug>` — individual teacher profile

## Inner-page visual system

The registration, teachers, teacher-profile, and not-found pages now use:

- a locally stored HLS campus photograph as a static page background
- a campus-image inner hero with a contrast-safe teal overlay
- translucent content surfaces so the background remains visible
- locally stored HLS campus and student-activity photographs
- responsive image crops with lazy loading and descriptive alternative text

The source frame animation and landing-page hero were not modified.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/`.

## Production checks

```bash
npm run lint
npm run build
npm run preview
```

## Registration submissions

The registration form is prepared for Netlify Forms. Deploy the production build to Netlify and enable form notifications in the Netlify dashboard. The hidden detection form is included in `index.html`.

For local development, submissions show a confirmation reference without sending data. Read `REGISTRATION-SETUP.md` before public launch.

## Teacher profiles

The public HLS website did not provide a reliable faculty directory. Subject-based profile templates are stored in `src/data/teachers.ts` without invented staff identities. Replace each placeholder with college-verified names, qualifications, experience, achievements, and photographs before launch. Read `TEACHER-PROFILES.md`.

## Animation assets

The frame files remain unchanged in `public/frames/frame_0000.jpg` through `frame_0239.jpg`.
