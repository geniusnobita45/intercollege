export type PerformanceTier = 'high' | 'medium' | 'low' | 'minimal';

export interface FrameCachePolicy {
  previousFrames: number;
  upcomingFrames: number;
  maximumDecodedFrames: number;
  concurrencyLimit: number;
  pixelRatioCap: number;
  backgroundBatchSize: number;
}

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
  downlink?: number;
};

type NavigatorWithSignals = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
};

const tierRank: Record<PerformanceTier, number> = {
  minimal: 0,
  low: 1,
  medium: 2,
  high: 3,
};

const orderedTiers: PerformanceTier[] = ['minimal', 'low', 'medium', 'high'];

function hasTouchCapability() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

function getConnection() {
  return (navigator as NavigatorWithSignals).connection;
}

export function detectWebGLCapability(): 'strong' | 'weak' | 'none' {
  if (typeof document === 'undefined') return 'weak';

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return 'none';

  const maxTextureSize = typeof gl.getParameter === 'function' ? Number(gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0) : 0;
  const maxRenderbufferSize = typeof gl.getParameter === 'function' ? Number(gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0) : 0;
  if (maxTextureSize < 4096 || maxRenderbufferSize < 4096) return 'weak';
  return 'strong';
}

export function getInitialPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'low';

  const nav = navigator as NavigatorWithSignals;
  const memory = nav.deviceMemory;
  const cores = nav.hardwareConcurrency || 2;
  const connection = getConnection();
  const effectiveType = connection?.effectiveType ?? '';
  const saveData = Boolean(connection?.saveData);
  const dpr = window.devicePixelRatio || 1;
  const touch = hasTouchCapability();
  const smallestScreenEdge = Math.min(screen.width || window.innerWidth, screen.height || window.innerHeight);
  const largestViewportEdge = Math.max(window.innerWidth, window.innerHeight);
  const webgl = detectWebGLCapability();
  const slowConnection = saveData || /(^|-)2g$/.test(effectiveType) || effectiveType === '3g';

  if (webgl === 'none') return 'minimal';
  if (saveData && touch) return 'minimal';
  if ((memory !== undefined && memory <= 2) || (cores <= 2 && touch) || (slowConnection && cores <= 2)) return 'minimal';
  if (webgl === 'weak' && (touch || cores <= 4)) return 'low';
  if ((memory !== undefined && memory <= 4) || cores <= 4 || slowConnection || (touch && dpr >= 2) || smallestScreenEdge < 390) return 'low';
  if (memory === undefined && touch) return 'low';
  if ((memory !== undefined && memory >= 8) && cores >= 8 && !touch && dpr <= 2 && largestViewportEdge >= 1100) return 'high';
  return 'medium';
}

export function getFrameCachePolicy(tier: PerformanceTier): FrameCachePolicy {
  const policies: Record<PerformanceTier, FrameCachePolicy> = {
    high: { previousFrames: 24, upcomingFrames: 40, maximumDecodedFrames: 72, concurrencyLimit: 6, pixelRatioCap: 1.5, backgroundBatchSize: 6 },
    medium: { previousFrames: 12, upcomingFrames: 24, maximumDecodedFrames: 40, concurrencyLimit: 4, pixelRatioCap: 1.25, backgroundBatchSize: 4 },
    low: { previousFrames: 6, upcomingFrames: 10, maximumDecodedFrames: 18, concurrencyLimit: 2, pixelRatioCap: 1, backgroundBatchSize: 2 },
    minimal: { previousFrames: 3, upcomingFrames: 6, maximumDecodedFrames: 10, concurrencyLimit: 1, pixelRatioCap: 1, backgroundBatchSize: 1 },
  };
  return policies[tier];
}

export function comparePerformanceTier(a: PerformanceTier, b: PerformanceTier) {
  return tierRank[a] - tierRank[b];
}

export function lowerPerformanceTier(tier: PerformanceTier): PerformanceTier {
  return orderedTiers[Math.max(0, tierRank[tier] - 1)];
}

export function setDocumentPerformanceTier(tier: PerformanceTier) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.performanceTier = tier;
  window.dispatchEvent(new CustomEvent<PerformanceTier>('hls:performance-tier-change', { detail: tier }));
}

export function measureFrameRate(durationMs = 1400): Promise<number> {
  if (typeof window === 'undefined') return Promise.resolve(30);

  return new Promise((resolve) => {
    let frames = 0;
    let start = 0;
    let rafId = 0;

    const tick = (time: number) => {
      if (!start) start = time;
      frames += 1;
      if (time - start >= durationMs) {
        cancelAnimationFrame(rafId);
        resolve((frames * 1000) / Math.max(1, time - start));
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
  });
}

export function refineTierWithFps(tier: PerformanceTier, fps: number): PerformanceTier {
  if (fps < 18) return 'minimal';
  if (fps < 25) return comparePerformanceTier(tier, 'low') > 0 ? 'low' : tier;
  if (fps < 35) return comparePerformanceTier(tier, 'medium') > 0 ? 'medium' : tier;
  if (fps > 50) return tier;
  return comparePerformanceTier(tier, 'high') === 0 ? 'medium' : tier;
}

type MonitorOptions = {
  initialTier: PerformanceTier;
  onTierChange: (tier: PerformanceTier) => void;
};

export function startRuntimeFpsMonitor({ initialTier, onTierChange }: MonitorOptions) {
  if (typeof window === 'undefined') return () => undefined;

  let tier = initialTier;
  let rafId = 0;
  let lastTime = 0;
  let lowFpsSeconds = 0;
  let veryLowFpsSeconds = 0;
  let hidden = document.hidden;
  const samples: number[] = [];

  const applyTier = (next: PerformanceTier) => {
    if (next === tier || comparePerformanceTier(next, tier) > 0) return;
    tier = next;
    setDocumentPerformanceTier(next);
    onTierChange(next);
  };

  const tick = (time: number) => {
    rafId = requestAnimationFrame(tick);
    if (hidden) {
      lastTime = 0;
      return;
    }

    if (!lastTime) {
      lastTime = time;
      return;
    }

    const delta = Math.max(1, time - lastTime);
    lastTime = time;
    const fps = 1000 / delta;
    samples.push(fps);
    if (samples.length > 120) samples.shift();
    if (samples.length < 45) return;

    const average = samples.reduce((sum, value) => sum + value, 0) / samples.length;
    if (average < 25) veryLowFpsSeconds += delta / 1000;
    else veryLowFpsSeconds = 0;

    if (average < 35) lowFpsSeconds += delta / 1000;
    else lowFpsSeconds = 0;

    if (veryLowFpsSeconds >= 3.5) {
      applyTier(average < 18 ? 'minimal' : 'low');
      veryLowFpsSeconds = 0;
      lowFpsSeconds = 0;
      samples.length = 0;
    } else if (lowFpsSeconds >= 5) {
      applyTier(lowerPerformanceTier(tier));
      lowFpsSeconds = 0;
      samples.length = 0;
    }
  };

  const onVisibility = () => {
    hidden = document.hidden;
    lastTime = 0;
  };

  const longTaskObserver = typeof PerformanceObserver !== 'undefined'
    ? new PerformanceObserver((list) => {
      const longTasks = list.getEntries().filter((entry) => entry.duration > 120);
      if (longTasks.length >= 2) applyTier(lowerPerformanceTier(tier));
    })
    : null;

  try {
    longTaskObserver?.observe({ type: 'longtask', buffered: false });
  } catch {
    // Long task monitoring is optional and browser-dependent.
  }

  document.addEventListener('visibilitychange', onVisibility);
  rafId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(rafId);
    document.removeEventListener('visibilitychange', onVisibility);
    longTaskObserver?.disconnect();
  };
}