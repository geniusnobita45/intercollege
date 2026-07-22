import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { college } from '../data/college';
import { useReducedMotion } from '../hooks/useReducedMotion';

const FRAME_COUNT = 240;
const CACHE_LIMIT = 52;
const framePath = (index: number) => `/frames/frame_${String(index).padStart(4, '0')}.jpg`;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const scenes = [
  {
    range: [0, 0.22],
    eyebrow: 'Welcome to',
    title: 'HLS Inter College',
    text: college.location,
    align: 'left',
  },
  {
    range: [0.18, 0.43],
    eyebrow: 'A purposeful environment',
    title: 'Ideas become action.',
    text: 'A positive, vibrant and healthy place for learning, values and personal growth.',
    align: 'right',
  },
  {
    range: [0.39, 0.65],
    eyebrow: 'A spacious campus',
    title: '7.5 acres of possibility.',
    text: 'A co-educational campus in Devmanpur, created for focused learning and confident development.',
    align: 'left',
  },
  {
    range: [0.61, 0.84],
    eyebrow: 'Beyond the syllabus',
    title: 'Learning in every direction.',
    text: 'Academics, personality development, arts, culture and sports come together in one college experience.',
    align: 'right',
  },
  {
    range: [0.81, 1],
    eyebrow: 'Devmanpur · Ghatampur',
    title: 'A campus rooted in its community.',
    text: 'Explore the college, its people, its activities and the environment students call their own.',
    align: 'left',
  },
] as const;

function sceneOpacity(progress: number, start: number, end: number) {
  const fade = Math.min(0.055, (end - start) / 3);
  if (progress < start || progress > end) return 0;
  if (start === 0 && progress <= start + fade) return 1;
  if (end === 1 && progress >= end - fade) return 1;
  if (progress < start + fade) return (progress - start) / fade;
  if (progress > end - fade) return (end - progress) / fade;
  return 1;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef(new Map<number, HTMLImageElement>());
  const loadingRef = useRef(new Map<number, Promise<HTMLImageElement | null>>());
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const progressRef = useRef(0);
  const currentDrawnRef = useRef(-1);
  const mountedRef = useRef(true);
  const preloadRunRef = useRef(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(0);
  const [hasFrameError, setHasFrameError] = useState(false);
  const reducedMotion = useReducedMotion();

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      currentDrawnRef.current = -1;
    }
  }, []);

  const evictCache = useCallback((anchor: number) => {
    const cache = cacheRef.current;
    if (cache.size <= CACHE_LIMIT) return;
    const protectedFrames = new Set([0, FRAME_COUNT - 1, Math.round((FRAME_COUNT - 1) / 2)]);
    const removable = [...cache.keys()]
      .filter((index) => !protectedFrames.has(index))
      .sort((a, b) => Math.abs(b - anchor) - Math.abs(a - anchor));
    while (cache.size > CACHE_LIMIT && removable.length) {
      const index = removable.shift();
      if (index !== undefined) cache.delete(index);
    }
  }, []);

  const loadFrame = useCallback((index: number) => {
    const safeIndex = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    const cached = cacheRef.current.get(safeIndex);
    if (cached) return Promise.resolve(cached);
    const pending = loadingRef.current.get(safeIndex);
    if (pending) return pending;

    const promise = new Promise<HTMLImageElement | null>((resolve) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (!mountedRef.current) return resolve(null);
        cacheRef.current.set(safeIndex, image);
        loadingRef.current.delete(safeIndex);
        evictCache(Math.round(targetFrameRef.current));
        resolve(image);
      };
      image.onerror = () => {
        loadingRef.current.delete(safeIndex);
        setHasFrameError(true);
        resolve(null);
      };
      image.src = framePath(safeIndex);
    });

    loadingRef.current.set(safeIndex, promise);
    return promise;
  }, [evictCache]);

  const nearestLoadedFrame = useCallback((wanted: number) => {
    const cache = cacheRef.current;
    if (cache.has(wanted)) return wanted;
    for (let radius = 1; radius < FRAME_COUNT; radius += 1) {
      const before = wanted - radius;
      const after = wanted + radius;
      if (before >= 0 && cache.has(before)) return before;
      if (after < FRAME_COUNT && cache.has(after)) return after;
    }
    return null;
  }, []);

  const drawFrame = useCallback((wanted: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const index = nearestLoadedFrame(clamp(Math.round(wanted), 0, FRAME_COUNT - 1));
    if (index === null || currentDrawnRef.current === index) return;
    const image = cacheRef.current.get(index);
    if (!image) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = image.naturalWidth / image.naturalHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (imageRatio > canvasRatio) {
      sourceWidth = image.naturalHeight * canvasRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / canvasRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    currentDrawnRef.current = index;
    (canvas as HTMLCanvasElement & { __frameIndex?: number }).__frameIndex = index;
  }, [nearestLoadedFrame]);

  const preloadAround = useCallback((index: number) => {
    const order = [0, 1, -1, 2, -2, 4, -4, 7, -7, 11, -11, 16, -16];
    order.forEach((offset) => void loadFrame(index + offset));
  }, [loadFrame]);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    const runId = ++preloadRunRef.current;
    const isActive = () => mountedRef.current && preloadRunRef.current === runId;
    const criticalFrames = reducedMotion ? [120] : [0, 1, 2, 3, 4, 5];
    const keyFrames = reducedMotion ? [] : [30, 60, 90, 120, 150, 180, 210, 239];
    let completed = 0;

    keyFrames.forEach((frame) => void loadFrame(frame));
    Promise.all(criticalFrames.map(async (frame) => {
      await loadFrame(frame);
      completed += 1;
      if (isActive()) setLoadingProgress(Math.round((completed / criticalFrames.length) * 100));
    })).then(() => {
      if (!isActive()) return;
      const initial = reducedMotion ? 120 : 0;
      targetFrameRef.current = initial;
      displayFrameRef.current = initial;
      resizeCanvas();
      drawFrame(initial);
      setIsReady(true);
    });

    return () => {
      if (preloadRunRef.current === runId) preloadRunRef.current += 1;
    };
  }, [drawFrame, loadFrame, reducedMotion, resizeCanvas]);

  useEffect(() => {
    if (reducedMotion || !isReady) return;
    let cancelled = false;
    let cursor = 0;
    const keyframes = new Set([0, 30, 60, 90, 120, 150, 180, 210, 239]);

    const warmNext = async () => {
      if (cancelled) return;
      while (cursor < FRAME_COUNT && keyframes.has(cursor)) cursor += 1;
      if (cursor >= FRAME_COUNT) return;
      await loadFrame(cursor);
      cursor += 1;
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => void warmNext(), { timeout: 900 });
      } else {
        globalThis.setTimeout(() => void warmNext(), 80);
      }
    };

    void warmNext();
    return () => { cancelled = true; };
  }, [isReady, loadFrame, reducedMotion]);

  useEffect(() => {
    const onResize = () => {
      resizeCanvas();
      drawFrame(displayFrameRef.current);
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame, resizeCanvas]);

  useEffect(() => {
    if (reducedMotion) return;
    const updateTarget = () => {
      const section = sectionRef.current;
      if (!section) return;
      const start = section.offsetTop;
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp((window.scrollY - start) / distance, 0, 1);
      progressRef.current = progress;
      targetFrameRef.current = progress * (FRAME_COUNT - 1);
      preloadAround(Math.round(targetFrameRef.current));
    };
    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
    };
  }, [preloadAround, reducedMotion]);

  useEffect(() => {
    if (!isReady) return;
    let animationFrame = 0;
    let lastProgressUpdate = 0;

    const animate = (time: number) => {
      const target = targetFrameRef.current;
      const current = displayFrameRef.current;
      const atBoundary = target <= 0.001 || target >= FRAME_COUNT - 1.001;
      const next = atBoundary || Math.abs(target - current) < 0.08
        ? target
        : current + (target - current) * 0.16;
      displayFrameRef.current = next;
      drawFrame(next);

      if (time - lastProgressUpdate > 80) {
        setVisibleProgress(progressRef.current);
        lastProgressUpdate = time;
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [drawFrame, isReady]);

  const activeScenes = useMemo(() => reducedMotion ? scenes.slice(0, 1) : scenes, [reducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="HLS Inter College campus introduction"
      className={`relative bg-[#17231d] ${reducedMotion ? 'h-[100svh]' : 'h-[540svh]'}`}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#17231d]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,15,12,.72)_0%,rgba(8,15,12,.22)_45%,rgba(8,15,12,.22)_60%,rgba(8,15,12,.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,18,14,.44)_0%,transparent_28%,transparent_68%,rgba(10,18,14,.66)_100%)]" />

        {!isReady && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#17231d] text-white" role="status" aria-live="polite">
            <div className="w-48 text-center">
              <div className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-white/70">Preparing campus view</div>
              <div className="h-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-white transition-[width] duration-300" style={{ width: `${loadingProgress}%` }} />
              </div>
              <span className="sr-only">Loading animation frames: {loadingProgress}%</span>
            </div>
          </div>
        )}

        <div className="relative z-20 mx-auto h-full max-w-7xl" style={{ paddingInline: 'clamp(1.5rem, 6vw, 5.5rem)' }}>
          {activeScenes.map((scene, index) => {
            const opacity = reducedMotion ? 1 : sceneOpacity(visibleProgress, scene.range[0], scene.range[1]);
            const translate = opacity === 0 ? 24 : (1 - opacity) * 14;
            const HeadingTag = index === 0 ? 'h1' : 'h2';
            return (
              <div
                key={scene.title}
                className={`pointer-events-none absolute inset-x-5 top-[calc(50%+1.25rem)] max-w-[800px] -translate-y-1/2 font-hero sm:inset-x-8 lg:inset-x-12 ${scene.align === 'right' ? 'lg:ml-auto' : ''}`}
                style={{ opacity, transform: `translateY(calc(-50% + ${translate}px))` }}
                aria-hidden={opacity < 0.1}
              >
                <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-white backdrop-blur-md">
                  <MapPin className="h-4 w-4" /> {scene.eyebrow}
                </div>
                <HeadingTag className={`${index === 0 ? '' : 'text-balance'} text-white drop-shadow-lg font-black leading-[1.02]`} style={{ fontSize: 'clamp(2.2rem, 4.4vw, 4.4rem)', letterSpacing: '-0.035em' }}>
                  {scene.title}
                </HeadingTag>
                <p className="mt-4 max-w-[560px] font-semibold leading-[1.6] text-white/90 drop-shadow sm:mt-5" style={{ fontSize: 'clamp(0.95rem, 1.15vw, 1.15rem)' }}>
                  {scene.text}
                </p>
                {index === scenes.length - 1 && (
                  <a
                    href="#about"
                    className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-extrabold text-white shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/70 sm:mt-8"
                  >
                    Explore the college <ArrowRight className="h-5 w-5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {!reducedMotion && (
          <div
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80 transition-opacity duration-300"
            style={{ opacity: clamp((0.96 - visibleProgress) / 0.08, 0, 1) }}
          >
            <span>Scroll to explore</span>
            <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
          </div>
        )}

        {hasFrameError && (
          <div className="absolute bottom-4 right-4 z-30 rounded-lg bg-black/65 px-3 py-2 text-xs text-white" role="status">
            Some frames could not load. The nearest available frame is being shown.
          </div>
        )}
      </div>
    </section>
  );
}
