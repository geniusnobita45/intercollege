export type NatureVerseRoute =
  | 'home'
  | 'about'
  | 'academics'
  | 'teachers'
  | 'teacher-profile'
  | 'leadership'
  | 'events'
  | 'gallery'
  | 'contact'
  | 'registration'
  | '404'
  | 'inner';

export type QualityTier = 'high' | 'medium' | 'low' | 'static';

export type ParticleLayerName = 'distant' | 'mid' | 'foreground' | 'ground';

export interface QualitySettings {
  tier: QualityTier;
  distantDust: number;
  midPollen: number;
  foreground: number;
  groundGrowth: number;
  sunRays: number;
  streakInterval: [number, number];
  pixelRatio: number;
  parallax: boolean;
  reducedMotion: boolean;
}

export interface AtmosphereState {
  fogColor: number;
  fogDensity: number;
  rayIntensity: number;
  pollenWarmth: number;
  groundGlow: number;
  streakFrequency: number;
}

export interface ViewBounds {
  width: number;
  height: number;
}

export interface EngineRuntimeOptions {
  route: NatureVerseRoute;
  active: boolean;
  reducedMotion: boolean;
  onFallback: () => void;
}
