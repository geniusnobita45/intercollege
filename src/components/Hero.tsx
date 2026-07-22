import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { college } from '../data/college';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  getFrameCachePolicy,
  getInitialPerformanceTier,
  type FrameCachePolicy,
  type PerformanceTier,
} from '../utils/performanceTier';

const FRAME_COUNT = 240;
const MAX_BLOCKING_TIME = 3000;
const NEAR_FUTURE_FRAME_END = 30;
const MAX_FRAME_RETRIES = 2;

type FrameVariant = 'mobile' | 'tablet' | 'desktop';
type FrameLoadPriority = 'high' | 'low' | 'auto';

type FrameResource = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

type ActiveFrameRequest = {
  promise: Promise<FrameResource | null>;
  controller: AbortController;
  priority: FrameLoadPriority;
  runId: number;
};

type FrameQueueTask = {
  index: number;
  priority: FrameLoadPriority;
  controller: AbortController;
  runId: number;
  resolve: (frame: FrameResource | null) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const frameName = (index: number) => `frame_${String(index).padStart(4, '0')}.webp`;
const HERO_FRAME_BASE: Record<FrameVariant, string> = {
  mobile: '/hero/mobile',
  tablet: '/hero/tablet',
  desktop: '/hero/desktop',
};
const framePath = (variant: FrameVariant, index: number) => `${HERO_FRAME_BASE[variant]}/${frameName(index)}`;

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
    eyebrow: 'Devmanpur | Ghatampur',
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

function scheduleIdleTask(callback: () => void): number {
  const requestIdle = window.requestIdleCallback as ((cb: IdleRequestCallback, options?: IdleRequestOptions) => number) | undefined;
  if (requestIdle) return requestIdle(callback, { timeout: 1000 });
  return window.setTimeout(callback, 80);
}

function cancelIdleTask(id: number) {
  const cancelIdle = window.cancelIdleCallback as ((handle: number) => void) | undefined;
  cancelIdle?.(id);
  window.clearTimeout(id);
}

function getFrameVariant(tier: PerformanceTier): FrameVariant {
  const width = window.innerWidth;
  if (tier === 'minimal' || tier === 'low' || width <= 640) return 'mobile';
  if (tier === 'medium' || width <= 1024) return 'tablet';
  return 'desktop';
}

function getPriorityIndexes(currentFrame: number, policy: FrameCachePolicy): number[] {
  const result: number[] = [currentFrame, 0, FRAME_COUNT - 1];
  const radius = Math.max(policy.previousFrames, policy.upcomingFrames);

  for (let distance = 1; distance <= radius; distance += 1) {
    const before = currentFrame - distance;
    const after = currentFrame + distance;
    if (distance <= policy.previousFrames && before >= 0) result.push(before);
    if (distance <= policy.upcomingFrames && after < FRAME_COUNT) result.push(after);
  }

  return [...new Set(result)];
}

function clearImageHandlers(image: HTMLImageElement) {
  image.onload = null;
  image.onerror = null;
}

async function loadDecodedFrame(src: string, priority: FrameLoadPriority, signal: AbortSignal): Promise<FrameResource> {
  if ('createImageBitmap' in window && typeof fetch === 'function') {
    const response = await fetch(src, { signal, cache: 'force-cache' });
    if (!response.ok) throw new Error(`Unable to load hero frame: ${src}`);
    const blob = await response.blob();
    if (signal.aborted) throw new DOMException('Frame request aborted', 'AbortError');
    const bitmap = await createImageBitmap(blob);
    if (signal.aborted) {
      bitmap.close();
      throw new DOMException('Frame request aborted', 'AbortError');
    }
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    };
  }

  const image = new Image();
  image.decoding = 'async';
  (image as HTMLImageElement & { fetchPriority?: FrameLoadPriority }).fetchPriority = priority;

  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearImageHandlers(image);
      image.src = '';
      reject(new DOMException('Frame request aborted', 'AbortError'));
    };

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
    image.onload = () => {
      signal.removeEventListener('abort', abort);
      clearImageHandlers(image);
      resolve();
    };
    image.onerror = () => {
      signal.removeEventListener('abort', abort);
      clearImageHandlers(image);
      reject(new Error(`Unable to load hero frame: ${src}`));
    };
    image.src = src;
  });

  try {
    await image.decode();
  } catch {
    // The load event already proved the image is usable; some browsers reject decode() after cache hits.
  }

  return {
    source: image,
    width: image.naturalWidth,
    height: image.naturalHeight,
    close: () => {
      clearImageHandlers(image);
      image.removeAttribute('src');
    },
  };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef(new Map<number, FrameResource>());
  const loadingRef = useRef(new Map<number, ActiveFrameRequest>());
  const failedRef = useRef(new Map<number, number>());
  const queuedRef = useRef(new Set<number>());
  const queueRef = useRef<FrameQueueTask[]>([]);
  const activeLoadsRef = useRef(0);
  const drainScheduledRef = useRef(0);
  const variantRef = useRef<FrameVariant>('mobile');
  const tierRef = useRef<PerformanceTier>('low');
  const policyRef = useRef<FrameCachePolicy>(getFrameCachePolicy('low'));
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const progressRef = useRef(0);
  const currentDrawnRef = useRef(-1);
  const mountedRef = useRef(true);
  const pageHiddenRef = useRef(typeof document !== 'undefined' ? document.hidden : false);
  const preloadRunRef = useRef(0);
  const hasReleasedPostHeroRef = useRef(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [interfaceReleased, setInterfaceReleased] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const [visibleProgress, setVisibleProgress] = useState(0);
  const [hasFrameError, setHasFrameError] = useState(false);
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>(() => (
    typeof window === 'undefined' ? 'low' : getInitialPerformanceTier()
  ));
  const reducedMotion = useReducedMotion();

  if (typeof window !== 'undefined') {
    tierRef.current = performanceTier;
    policyRef.current = getFrameCachePolicy(performanceTier);
    variantRef.current = getFrameVariant(performanceTier);
  }

  const evictFrame = useCallback((index: number) => {
    const frame = cacheRef.current.get(index);
    if (!frame) return;
    frame.close();
    cacheRef.current.delete(index);
  }, []);

  const isFrameNearActive = useCallback((index: number, anchor = Math.round(targetFrameRef.current)) => {
    const policy = policyRef.current;
    if (index === 0 || index === FRAME_COUNT - 1 || index === currentDrawnRef.current) return true;
    return index >= anchor - policy.previousFrames && index <= anchor + policy.upcomingFrames;
  }, []);

  const cancelStaleRequests = useCallback((anchor = Math.round(targetFrameRef.current)) => {
    queueRef.current = queueRef.current.filter((task) => {
      const keep = task.priority === 'high' || isFrameNearActive(task.index, anchor);
      if (!keep) {
        task.controller.abort();
        queuedRef.current.delete(task.index);
        loadingRef.current.delete(task.index);
        task.resolve(null);
      }
      return keep;
    });

    loadingRef.current.forEach((request, index) => {
      if (request.priority !== 'high' && !isFrameNearActive(index, anchor)) {
        request.controller.abort();
        loadingRef.current.delete(index);
      }
    });
  }, [isFrameNearActive]);

  const evictCache = useCallback((anchor: number, forceWindow = false) => {
    const cache = cacheRef.current;
    const policy = policyRef.current;
    const protectedFrames = new Set([
      0,
      FRAME_COUNT - 1,
      currentDrawnRef.current,
      Math.round(displayFrameRef.current),
      Math.round(targetFrameRef.current),
    ]);

    const removable = [...cache.keys()]
      .filter((index) => !protectedFrames.has(index))
      .filter((index) => forceWindow || !isFrameNearActive(index, anchor) || cache.size > policy.maximumDecodedFrames)
      .sort((a, b) => Math.abs(b - anchor) - Math.abs(a - anchor));

    while (cache.size > policy.maximumDecodedFrames && removable.length) {
      const index = removable.shift();
      if (index !== undefined) evictFrame(index);
    }

    if (forceWindow) {
      removable.forEach((index) => {
        if (!isFrameNearActive(index, anchor)) evictFrame(index);
      });
    }
  }, [evictFrame, isFrameNearActive]);

  const drainQueue = useCallback(() => {
    if (!mountedRef.current || pageHiddenRef.current) return;

    if (drainScheduledRef.current) {
      cancelIdleTask(drainScheduledRef.current);
      drainScheduledRef.current = 0;
    }

    const policy = policyRef.current;
    while (activeLoadsRef.current < policy.concurrencyLimit && queueRef.current.length) {
      const task = queueRef.current.shift();
      if (!task) return;

      queuedRef.current.delete(task.index);
      if (!mountedRef.current || task.controller.signal.aborted || task.runId !== preloadRunRef.current) {
        loadingRef.current.delete(task.index);
        task.resolve(null);
        continue;
      }

      if (task.priority !== 'high' && !isFrameNearActive(task.index)) {
        loadingRef.current.delete(task.index);
        task.resolve(null);
        continue;
      }

      activeLoadsRef.current += 1;
      const variant = variantRef.current;
      loadDecodedFrame(framePath(variant, task.index), task.priority, task.controller.signal)
        .then((frame) => {
          if (!mountedRef.current || task.runId !== preloadRunRef.current || task.controller.signal.aborted) {
            frame.close();
            task.resolve(null);
            return;
          }

          cacheRef.current.set(task.index, frame);
          evictCache(Math.round(targetFrameRef.current));
          task.resolve(frame);
        })
        .catch((error) => {
          if (!(error instanceof DOMException && error.name === 'AbortError')) {
            const retries = (failedRef.current.get(task.index) ?? 0) + 1;
            failedRef.current.set(task.index, retries);
            if (mountedRef.current) setHasFrameError(true);
            if (retries >= MAX_FRAME_RETRIES) {
              window.dispatchEvent(new CustomEvent('hls:memory-pressure', { detail: { source: 'hero-frame-failure' } }));
            }
          }
          task.resolve(null);
        })
        .finally(() => {
          activeLoadsRef.current -= 1;
          loadingRef.current.delete(task.index);
          if (mountedRef.current) {
            setLoadingProgress(Math.min(100, Math.round((cacheRef.current.size / Math.max(1, policyRef.current.maximumDecodedFrames)) * 100)));
            drainQueue();
          }
        });
    }
  }, [evictCache, isFrameNearActive]);

  const scheduleDrainQueue = useCallback(() => {
    if (drainScheduledRef.current || pageHiddenRef.current) return;
    drainScheduledRef.current = scheduleIdleTask(drainQueue);
  }, [drainQueue]);

  const loadFrame = useCallback((index: number, priority: FrameLoadPriority = 'auto') => {
    const safeIndex = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    const cached = cacheRef.current.get(safeIndex);
    if (cached) return Promise.resolve(cached);

    const pending = loadingRef.current.get(safeIndex);
    if (pending) {
      if (priority === 'high' && pending.priority !== 'high') {
        pending.priority = 'high';
        const queuedTask = queueRef.current.find((task) => task.index === safeIndex);
        if (queuedTask) queuedTask.priority = 'high';
        queueRef.current.sort((a, b) => (a.priority === 'high' ? -1 : 1) - (b.priority === 'high' ? -1 : 1));
        drainQueue();
      }
      return pending.promise;
    }

    const retries = failedRef.current.get(safeIndex) ?? 0;
    if (retries >= MAX_FRAME_RETRIES) return Promise.resolve(null);

    const controller = new AbortController();
    const promise = new Promise<FrameResource | null>((resolve) => {
      const task: FrameQueueTask = {
        index: safeIndex,
        priority,
        controller,
        runId: preloadRunRef.current,
        resolve,
      };

      queuedRef.current.add(safeIndex);
      if (priority === 'high') queueRef.current.unshift(task);
      else queueRef.current.push(task);
      drainQueue();
    });

    loadingRef.current.set(safeIndex, { promise, controller, priority, runId: preloadRunRef.current });
    return promise;
  }, [drainQueue]);

  const enqueueFrames = useCallback((indexes: number[], placement: 'front' | 'back' = 'back') => {
    const ordered = indexes
      .map((index) => clamp(Math.round(index), 0, FRAME_COUNT - 1))
      .filter((index) => (
        !cacheRef.current.has(index)
        && !loadingRef.current.has(index)
        && !queuedRef.current.has(index)
        && (failedRef.current.get(index) ?? 0) < MAX_FRAME_RETRIES
      ));

    const priority: FrameLoadPriority = placement === 'front' ? 'high' : 'low';
    ordered.forEach((index) => {
      const controller = new AbortController();
      const promise = new Promise<FrameResource | null>((resolve) => {
        const task: FrameQueueTask = { index, priority, controller, runId: preloadRunRef.current, resolve };
        queuedRef.current.add(index);
        if (placement === 'front') queueRef.current.unshift(task);
        else queueRef.current.push(task);
      });
      loadingRef.current.set(index, { promise, controller, priority, runId: preloadRunRef.current });
    });
    scheduleDrainQueue();
  }, [scheduleDrainQueue]);

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

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const displayWidth = Math.max(1, Math.floor(canvas.clientWidth));
    const displayHeight = Math.max(1, Math.floor(canvas.clientHeight));
    const dpr = Math.min(window.devicePixelRatio || 1, policyRef.current.pixelRatioCap);
    const width = Math.max(1, Math.floor(displayWidth * dpr));
    const height = Math.max(1, Math.floor(displayHeight * dpr));
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      currentDrawnRef.current = -1;
    }
  }, []);

  const drawFrame = useCallback((wanted: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeWanted = clamp(Math.round(wanted), 0, FRAME_COUNT - 1);
    const index = nearestLoadedFrame(safeWanted);
    if (index !== safeWanted) void loadFrame(safeWanted, 'high');
    if (index === null || currentDrawnRef.current === index) return;
    const frame = cacheRef.current.get(index);
    if (!frame) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    const canvasRatio = canvas.width / canvas.height;
    const imageRatio = frame.width / frame.height;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = frame.width;
    let sourceHeight = frame.height;

    if (imageRatio > canvasRatio) {
      sourceWidth = frame.height * canvasRatio;
      sourceX = (frame.width - sourceWidth) / 2;
    } else {
      sourceHeight = frame.width / canvasRatio;
      sourceY = (frame.height - sourceHeight) / 2;
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = performanceTier === 'high' ? 'high' : 'medium';
    context.drawImage(frame.source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    currentDrawnRef.current = index;
    (canvas as HTMLCanvasElement & { __frameIndex?: number }).__frameIndex = index;
    if (!animationReady) setAnimationReady(true);
  }, [animationReady, loadFrame, nearestLoadedFrame, performanceTier]);

  const preloadAround = useCallback((index: number) => {
    const anchor = clamp(Math.round(index), 0, FRAME_COUNT - 1);
    const policy = policyRef.current;
    cancelStaleRequests(anchor);
    enqueueFrames(getPriorityIndexes(anchor, policy).slice(0, policy.backgroundBatchSize + policy.previousFrames + policy.upcomingFrames), 'front');
    evictCache(anchor);
  }, [cancelStaleRequests, enqueueFrames, evictCache]);

  const releasePostHeroMemory = useCallback(() => {
    const anchor = Math.round(targetFrameRef.current);
    cancelStaleRequests(anchor);
    evictCache(anchor, true);
    window.dispatchEvent(new CustomEvent('hls:hero-post-boundary'));
  }, [cancelStaleRequests, evictCache]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (drainScheduledRef.current) cancelIdleTask(drainScheduledRef.current);
      loadingRef.current.forEach((request) => request.controller.abort());
      loadingRef.current.clear();
      queueRef.current.forEach((task) => task.resolve(null));
      queueRef.current = [];
      queuedRef.current.clear();
      cacheRef.current.forEach((_, index) => evictFrame(index));
    };
  }, [evictFrame]);

  useEffect(() => {
    const onTierChange = (event: Event) => {
      const nextTier = (event as CustomEvent<PerformanceTier>).detail;
      if (!nextTier) return;
      setPerformanceTier(nextTier);
      tierRef.current = nextTier;
      policyRef.current = getFrameCachePolicy(nextTier);
      variantRef.current = getFrameVariant(nextTier);
      resizeCanvas();
      cancelStaleRequests(Math.round(targetFrameRef.current));
      evictCache(Math.round(targetFrameRef.current), nextTier === 'low' || nextTier === 'minimal');
      drawFrame(displayFrameRef.current);
    };

    window.addEventListener('hls:performance-tier-change', onTierChange);
    return () => window.removeEventListener('hls:performance-tier-change', onTierChange);
  }, [cancelStaleRequests, drawFrame, evictCache, resizeCanvas]);

  useEffect(() => {
    const onVisibilityChange = () => {
      pageHiddenRef.current = document.hidden;
      if (document.hidden) {
        if (drainScheduledRef.current) cancelIdleTask(drainScheduledRef.current);
        drainScheduledRef.current = 0;
      } else {
        resizeCanvas();
        drawFrame(displayFrameRef.current);
        scheduleDrainQueue();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [drawFrame, resizeCanvas, scheduleDrainQueue]);

  useEffect(() => {
    const runId = ++preloadRunRef.current;
    const isActive = () => mountedRef.current && preloadRunRef.current === runId;
    const policy = policyRef.current;
    const criticalCount = reducedMotion || performanceTier === 'minimal' ? 1 : Math.min(8, policy.maximumDecodedFrames);
    const criticalFrames = Array.from({ length: criticalCount }, (_, index) => index);
    const keyFrames = reducedMotion ? [] : [30, 60, 90, 120, 150, 180, 210, 239];
    let released = false;
    let completed = 0;

    const releaseInterface = () => {
      if (released || !isActive()) return;
      released = true;
      targetFrameRef.current = 0;
      displayFrameRef.current = 0;
      resizeCanvas();
      drawFrame(0);
      setInterfaceReleased(true);
      window.dispatchEvent(new CustomEvent('hls:hero-critical-ready'));

      if (!reducedMotion) {
        const nearFutureEnd = Math.min(NEAR_FUTURE_FRAME_END, policy.upcomingFrames + criticalCount);
        enqueueFrames(Array.from({ length: Math.max(0, nearFutureEnd - criticalCount + 1) }, (_, index) => index + criticalCount), 'front');
        if (performanceTier === 'high' || performanceTier === 'medium') enqueueFrames(keyFrames, 'back');
        if (performanceTier === 'high') enqueueFrames(Array.from({ length: FRAME_COUNT }, (_, index) => index), 'back');
        scheduleDrainQueue();
      }
    };

    const timeout = window.setTimeout(releaseInterface, MAX_BLOCKING_TIME);
    Promise.allSettled(criticalFrames.map(async (frame) => {
      const image = await loadFrame(frame, 'high');
      if (!image) return;
      completed += 1;
      if (isActive()) setLoadingProgress(Math.round((completed / criticalFrames.length) * 100));
      if (frame === 0) {
        resizeCanvas();
        drawFrame(0);
      }
    })).then(() => {
      window.clearTimeout(timeout);
      releaseInterface();
    });

    return () => {
      window.clearTimeout(timeout);
      if (preloadRunRef.current === runId) preloadRunRef.current += 1;
    };
  }, [drawFrame, enqueueFrames, loadFrame, performanceTier, reducedMotion, resizeCanvas, scheduleDrainQueue]);

  useEffect(() => {
    const onResize = () => {
      const nextVariant = getFrameVariant(tierRef.current);
      if (nextVariant !== variantRef.current) {
        variantRef.current = nextVariant;
        failedRef.current.clear();
        cacheRef.current.forEach((_, index) => evictFrame(index));
        loadingRef.current.forEach((request) => request.controller.abort());
        loadingRef.current.clear();
        queueRef.current = [];
        queuedRef.current.clear();
        currentDrawnRef.current = -1;
      }
      resizeCanvas();
      drawFrame(displayFrameRef.current);
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [drawFrame, evictFrame, resizeCanvas]);

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

      const postHero = progress > 0.985 || window.scrollY > start + distance + window.innerHeight * 0.35;
      if (postHero && !hasReleasedPostHeroRef.current) {
        hasReleasedPostHeroRef.current = true;
        releasePostHeroMemory();
      } else if (!postHero && hasReleasedPostHeroRef.current) {
        hasReleasedPostHeroRef.current = false;
      }
    };
    updateTarget();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
    };
  }, [preloadAround, reducedMotion, releasePostHeroMemory]);

  useEffect(() => {
    if (!interfaceReleased) return;
    let animationFrame = 0;
    let lastProgressUpdate = 0;
    let lastTimestamp = 0;
    let lowFpsSeconds = 0;

    const animate = (time: number) => {
      animationFrame = requestAnimationFrame(animate);
      if (pageHiddenRef.current) {
        lastTimestamp = 0;
        return;
      }

      if (lastTimestamp) {
        const fps = 1000 / Math.max(1, time - lastTimestamp);
        if (fps < 24) lowFpsSeconds += (time - lastTimestamp) / 1000;
        else lowFpsSeconds = 0;
        if (lowFpsSeconds > 3) {
          window.dispatchEvent(new CustomEvent('hls:memory-pressure', { detail: { source: 'hero-fps' } }));
          lowFpsSeconds = 0;
        }
      }
      lastTimestamp = time;

      const target = targetFrameRef.current;
      const current = displayFrameRef.current;
      const atBoundary = target <= 0.001 || target >= FRAME_COUNT - 1.001;
      const next = atBoundary || Math.abs(target - current) < 0.08
        ? target
        : current + (target - current) * 0.16;
      displayFrameRef.current = next;
      drawFrame(next);

      if (time - lastProgressUpdate > 100) {
        setVisibleProgress(progressRef.current);
        lastProgressUpdate = time;
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [drawFrame, interfaceReleased]);

  useEffect(() => {
    if (reducedMotion || !interfaceReleased) return;
    scheduleDrainQueue();
  }, [interfaceReleased, reducedMotion, scheduleDrainQueue]);

  const activeScenes = useMemo(() => reducedMotion ? scenes.slice(0, 1) : scenes, [reducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="HLS Inter College campus introduction"
      className={`hero relative bg-[#17231d] ${reducedMotion ? 'h-[100svh]' : 'h-[540svh]'}`}
      data-animation-ready={animationReady ? 'true' : 'false'}
      data-hero-tier={performanceTier}
    >
      <div className="sticky top-[4.5rem] h-[calc(100svh-4.5rem)] overflow-hidden bg-[#17231d]">
        <picture className="hero-poster absolute inset-0 z-0 block h-full w-full" aria-hidden="true">
          <source media="(max-width: 640px)" srcSet="/hero/posters/hero-poster-mobile.avif" type="image/avif" />
          <source media="(max-width: 1024px)" srcSet="/hero/posters/hero-poster-tablet.avif" type="image/avif" />
          <img
            src="/hero/posters/hero-poster-desktop.avif"
            alt=""
            width="1600"
            height="900"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="h-full w-full object-cover"
          />
        </picture>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 h-full w-full"
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(8,15,12,.72)_0%,rgba(8,15,12,.22)_45%,rgba(8,15,12,.22)_60%,rgba(8,15,12,.62)_100%)]" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(10,18,14,.44)_0%,transparent_28%,transparent_68%,rgba(10,18,14,.66)_100%)]" />

        {!interfaceReleased && (
          <div className="pointer-events-none absolute bottom-4 left-4 z-30 rounded-lg bg-black/45 px-3 py-2 text-white backdrop-blur-md" role="status" aria-live="polite">
            <div className="w-44">
              <div className="mb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-white/75">Preparing campus view</div>
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
                <HeadingTag className={`${index === 0 ? '' : 'text-balance'} text-white drop-shadow-lg font-black leading-[1.12]`} style={{ fontSize: 'var(--text-page-title)', letterSpacing: '0.04em' }}>
                  {scene.title}
                </HeadingTag>
                <p className="mt-4 max-w-[560px] font-medium leading-[1.65] text-white/90 drop-shadow sm:mt-5" style={{ fontSize: 'var(--text-base)' }}>
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