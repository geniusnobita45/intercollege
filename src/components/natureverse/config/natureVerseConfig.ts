import type { AtmosphereState, NatureVerseRoute, QualitySettings, QualityTier } from '../types';

export const natureVersePalette = {
  deepForest: 0x0b2b1d,
  forest: 0x17452d,
  moss: 0x4f7c46,
  youngLeaf: 0x80a95f,
  warmSun: 0xf7cf73,
  golden: 0xffd986,
  mist: 0xedf3dc,
  ivoryGreen: 0xf5f7e9,
};

export const routeAtmospheres: Record<NatureVerseRoute, AtmosphereState> = {
  home: { fogColor: 0x244b2e, fogDensity: 0.023, rayIntensity: 1.1, pollenWarmth: 1.05, groundGlow: 1.05, streakFrequency: 1 },
  about: { fogColor: 0x1f442d, fogDensity: 0.026, rayIntensity: 0.95, pollenWarmth: 0.92, groundGlow: 1.08, streakFrequency: 0.9 },
  academics: { fogColor: 0x2f5131, fogDensity: 0.021, rayIntensity: 1.28, pollenWarmth: 1.18, groundGlow: 1.02, streakFrequency: 1.1 },
  teachers: { fogColor: 0x173b2a, fogDensity: 0.029, rayIntensity: 0.88, pollenWarmth: 0.9, groundGlow: 1.16, streakFrequency: 0.78 },
  'teacher-profile': { fogColor: 0x173b2a, fogDensity: 0.029, rayIntensity: 0.88, pollenWarmth: 0.9, groundGlow: 1.16, streakFrequency: 0.78 },
  leadership: { fogColor: 0x143629, fogDensity: 0.028, rayIntensity: 1.05, pollenWarmth: 0.98, groundGlow: 1.12, streakFrequency: 0.8 },
  events: { fogColor: 0x334a2a, fogDensity: 0.022, rayIntensity: 1.2, pollenWarmth: 1.28, groundGlow: 1.08, streakFrequency: 1.28 },
  gallery: { fogColor: 0x2f4730, fogDensity: 0.024, rayIntensity: 1.14, pollenWarmth: 1.2, groundGlow: 0.96, streakFrequency: 1.12 },
  contact: { fogColor: 0x1c432d, fogDensity: 0.025, rayIntensity: 0.96, pollenWarmth: 0.98, groundGlow: 1.18, streakFrequency: 0.86 },
  registration: { fogColor: 0x244a2f, fogDensity: 0.024, rayIntensity: 1.1, pollenWarmth: 1.06, groundGlow: 1.14, streakFrequency: 0.94 },
  '404': { fogColor: 0x203f2d, fogDensity: 0.027, rayIntensity: 0.92, pollenWarmth: 0.92, groundGlow: 1.02, streakFrequency: 0.7 },
  inner: { fogColor: 0x203f2d, fogDensity: 0.025, rayIntensity: 1, pollenWarmth: 1, groundGlow: 1, streakFrequency: 0.9 },
};

export function getInitialQuality(reducedMotion: boolean): QualitySettings {
  if (typeof window === 'undefined') {
    return makeSettings('static', reducedMotion);
  }

  const width = window.innerWidth;
  const dpr = window.devicePixelRatio || 1;
  const touch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const cores = navigator.hardwareConcurrency || 4;
  const canvas = document.createElement('canvas');
  const hasWebGL = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));

  if (!hasWebGL) return makeSettings('static', reducedMotion);
  if (reducedMotion) return makeSettings('low', true);
  if (width < 640 || touch || cores <= 4 || dpr > 2.25) return makeSettings('low', false);
  if (width < 1100 || cores <= 6 || dpr > 1.75) return makeSettings('medium', false);
  return makeSettings('high', false);
}

export function makeSettings(tier: QualityTier, reducedMotion: boolean): QualitySettings {
  const base = {
    high: {
      distantDust: 620,
      midPollen: 260,
      foreground: 64,
      groundGrowth: 128,
      sunRays: 7,
      streakInterval: [2.5, 5.5] as [number, number],
      pixelRatio: 1.5,
      parallax: true,
    },
    medium: {
      distantDust: 380,
      midPollen: 170,
      foreground: 44,
      groundGrowth: 86,
      sunRays: 5,
      streakInterval: [3.2, 6] as [number, number],
      pixelRatio: 1.35,
      parallax: true,
    },
    low: {
      distantDust: 210,
      midPollen: 105,
      foreground: 26,
      groundGrowth: 58,
      sunRays: 3,
      streakInterval: [4.4, 7.8] as [number, number],
      pixelRatio: 1.2,
      parallax: false,
    },
    static: {
      distantDust: 0,
      midPollen: 0,
      foreground: 0,
      groundGrowth: 0,
      sunRays: 0,
      streakInterval: [999, 999] as [number, number],
      pixelRatio: 1,
      parallax: false,
    },
  } satisfies Record<QualityTier, Omit<QualitySettings, 'tier' | 'reducedMotion'>>;

  const selected = base[tier];
  return {
    ...selected,
    tier,
    reducedMotion,
    pixelRatio: Math.min(window.devicePixelRatio || 1, selected.pixelRatio),
    parallax: selected.parallax && !reducedMotion,
    streakInterval: reducedMotion ? [999, 999] : selected.streakInterval,
  };
}
