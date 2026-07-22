import * as THREE from 'three';
import { getInitialQuality, makeSettings, routeAtmospheres } from './config/natureVerseConfig';
import { ParallaxController } from './controllers/ParallaxController';
import { QualityController } from './controllers/QualityController';
import { SunRays } from './effects/SunRays';
import { ShootingLightStreaks } from './effects/ShootingLightStreaks';
import { DistantDust } from './particles/DistantDust';
import { ForegroundParticles } from './particles/ForegroundParticles';
import { GroundGrowth } from './particles/GroundGrowth';
import { MidDepthPollen } from './particles/MidDepthPollen';
import type { AtmosphereState, EngineRuntimeOptions, NatureVerseRoute, QualitySettings, ViewBounds } from './types';

const clampDelta = (value: number) => Math.min(0.05, Math.max(0, value));

export class NatureVerseEngine {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene: THREE.Scene | null = null;
  private camera: THREE.PerspectiveCamera | null = null;
  private rafId = 0;
  private disposed = false;
  private pageHidden = typeof document !== 'undefined' ? document.hidden : false;
  private running = false;
  private lastTimestamp = 0;
  private elapsed = 0;
  private settings: QualitySettings;
  private quality: QualityController;
  private parallax: ParallaxController | null = null;
  private distantDust: DistantDust | null = null;
  private midPollen: MidDepthPollen | null = null;
  private foreground: ForegroundParticles | null = null;
  private groundGrowth: GroundGrowth | null = null;
  private sunRays: SunRays | null = null;
  private streaks: ShootingLightStreaks | null = null;
  private currentAtmosphere: AtmosphereState;
  private targetAtmosphere: AtmosphereState;
  private bounds: ViewBounds = { width: 18, height: 10 };
  private active: boolean;
  private route: NatureVerseRoute;
  private reducedMotion: boolean;
  private contextLossCount = 0;

  private readonly onResize = () => this.resize();
  private readonly onFallback: () => void;

  private readonly onVisibilityChange = () => {
    this.pageHidden = document.hidden;
    this.lastTimestamp = 0;
    if (this.pageHidden) this.stopLoop();
    else this.startLoop();
  };

  private readonly onContextLost = (event: Event) => {
    event.preventDefault();
    this.contextLossCount += 1;
    this.stopLoop();
    this.quality.forceTier('minimal');
    this.onFallback();
  };

  private readonly onContextRestored = () => {
    if (this.disposed || this.contextLossCount > 1) return;
    this.settings = makeSettings('low', this.reducedMotion);
    this.applyQuality(this.settings);
    this.lastTimestamp = 0;
    this.startLoop();
  };

  constructor(private readonly container: HTMLElement, options: EngineRuntimeOptions) {
    this.active = options.active;
    this.route = options.route;
    this.reducedMotion = options.reducedMotion;
    this.onFallback = options.onFallback;
    this.settings = getInitialQuality(options.reducedMotion, options.performanceTier);
    this.currentAtmosphere = { ...routeAtmospheres[options.route] };
    this.targetAtmosphere = { ...routeAtmospheres[options.route] };
    this.quality = new QualityController(this.settings, (settings) => {
      this.settings = settings;
      this.applyQuality(settings);
      if (settings.tier === 'minimal') this.onFallback();
    });

    if (this.settings.tier === 'minimal') {
      this.onFallback();
      return;
    }

    try {
      this.initialize();
    } catch (error) {
      console.warn('NatureVerse WebGL fallback activated.', error);
      this.dispose();
      this.onFallback();
    }
  }

  updateOptions(options: Pick<EngineRuntimeOptions, 'active' | 'route' | 'reducedMotion' | 'performanceTier'>) {
    this.active = options.active;
    this.route = options.route;
    this.reducedMotion = options.reducedMotion;
    this.targetAtmosphere = { ...(routeAtmospheres[options.route] ?? routeAtmospheres.inner) };

    const nextSettings = getInitialQuality(options.reducedMotion, options.performanceTier);
    if (nextSettings.tier === 'minimal') {
      this.quality.forceTier('minimal');
      this.stopLoop();
      this.onFallback();
      return;
    }

    if (!this.renderer) {
      this.settings = nextSettings;
      this.quality = new QualityController(this.settings, (settings) => {
        this.settings = settings;
        this.applyQuality(settings);
        if (settings.tier === 'minimal') this.onFallback();
      });
      try {
        this.initialize();
      } catch (error) {
        console.warn('NatureVerse WebGL fallback activated.', error);
        this.dispose();
        this.onFallback();
      }
      return;
    }

    if (this.settings.tier !== nextSettings.tier || this.settings.reducedMotion !== nextSettings.reducedMotion) {
      this.quality.forceTier(nextSettings.tier);
    }

    this.startLoop();
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.stopLoop();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.renderer?.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer?.domElement.removeEventListener('webglcontextrestored', this.onContextRestored);
    this.parallax?.dispose();
    this.distantDust?.dispose();
    this.midPollen?.dispose();
    this.foreground?.dispose();
    this.groundGrowth?.dispose();
    this.sunRays?.dispose();
    this.streaks?.dispose();
    this.scene?.clear();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement.remove();
    }
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }

  private initialize() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: this.settings.tier === 'high',
      powerPreference: this.settings.tier === 'low' ? 'low-power' : 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.className = 'natureverse-canvas';
    this.renderer.domElement.addEventListener('webglcontextlost', this.onContextLost, false);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.onContextRestored, false);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.currentAtmosphere.fogColor, this.currentAtmosphere.fogDensity);
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 12);

    this.parallax = new ParallaxController(this.settings.parallax);
    this.distantDust = new DistantDust(this.settings.distantDust);
    this.midPollen = new MidDepthPollen(this.settings.midPollen);
    this.foreground = new ForegroundParticles(Math.max(1, this.settings.foreground));
    this.groundGrowth = new GroundGrowth(this.settings.groundGrowth);
    this.sunRays = new SunRays(this.settings.sunRays);
    this.streaks = new ShootingLightStreaks(this.settings.streakInterval, this.settings.reducedMotion);

    this.scene.add(this.sunRays.group);
    this.scene.add(this.distantDust.group);
    this.scene.add(this.midPollen.group);
    this.scene.add(this.foreground.group);
    this.scene.add(this.groundGrowth.group);
    this.scene.add(this.streaks.streakGroup);

    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.startLoop();
  }

  private startLoop() {
    if (this.disposed || this.running || this.pageHidden || !this.active || this.settings.tier === 'minimal') return;
    this.running = true;
    this.lastTimestamp = 0;
    this.rafId = requestAnimationFrame(this.animate);
  }

  private stopLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.running = false;
    this.lastTimestamp = 0;
  }

  private readonly animate = (timestamp: number) => {
    if (this.disposed || this.pageHidden || !this.active || this.settings.tier === 'minimal') {
      this.stopLoop();
      return;
    }

    const delta = this.lastTimestamp ? clampDelta((timestamp - this.lastTimestamp) / 1000) : 0;
    this.lastTimestamp = timestamp;
    const speed = this.reducedMotion ? 0.08 : 1;
    this.elapsed += delta * speed;

    if (!this.renderer || !this.scene || !this.camera) {
      this.stopLoop();
      return;
    }

    this.interpolateAtmosphere(delta);
    const parallax = this.parallax?.update(this.elapsed) ?? new THREE.Vector2();
    this.distantDust?.setParallax(parallax.x, parallax.y, 3);
    this.midPollen?.setParallax(parallax.x, parallax.y, 7);
    this.foreground?.setParallax(parallax.x, parallax.y, 13);
    this.sunRays?.setParallax(parallax.x, parallax.y);

    this.distantDust?.update(delta * speed, this.elapsed, this.currentAtmosphere.pollenWarmth);
    this.midPollen?.update(delta * speed, this.elapsed, this.currentAtmosphere.pollenWarmth);
    if (this.settings.foreground > 0) this.foreground?.update(delta * speed, this.elapsed, this.currentAtmosphere.pollenWarmth);
    this.groundGrowth?.update(delta * speed, this.elapsed, this.currentAtmosphere.pollenWarmth);
    this.sunRays?.update(this.elapsed, this.currentAtmosphere.rayIntensity);
    this.streaks?.update(delta, this.elapsed, this.currentAtmosphere.streakFrequency);

    this.renderer.render(this.scene, this.camera);
    this.quality.record(delta, this.elapsed);
    this.rafId = requestAnimationFrame(this.animate);
  };

  private resize() {
    if (!this.renderer || !this.camera || this.settings.tier === 'minimal') return;
    const width = Math.max(1, window.innerWidth);
    const height = Math.max(1, window.innerHeight);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.settings.pixelRatio, 1.5);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.bounds = this.getViewBounds();
    this.distantDust?.resize(this.bounds, pixelRatio);
    this.midPollen?.resize(this.bounds, pixelRatio);
    this.foreground?.resize(this.bounds, pixelRatio);
    this.groundGrowth?.resize(this.bounds, pixelRatio);
    this.sunRays?.resize(this.bounds);
    this.streaks?.resize(this.bounds);
  }

  private getViewBounds(): ViewBounds {
    if (!this.camera) return this.bounds;
    const distance = Math.abs(this.camera.position.z);
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * distance;
    return { width: height * this.camera.aspect, height };
  }

  private applyQuality(settings: QualitySettings) {
    this.distantDust?.setDrawCount(settings.distantDust);
    this.midPollen?.setDrawCount(settings.midPollen);
    this.foreground?.setDrawCount(settings.foreground);
    this.foreground?.setVisible(settings.foreground > 0);
    this.groundGrowth?.setDrawCount(settings.groundGrowth);
    this.sunRays?.setActiveCount(settings.sunRays);
    this.streaks?.setInterval(settings.streakInterval);
    this.parallax?.dispose();
    this.parallax = new ParallaxController(settings.parallax);
    this.resize();
  }

  private interpolateAtmosphere(delta: number) {
    const ease = Math.min(1, delta * 1.6);
    this.currentAtmosphere.fogDensity = THREE.MathUtils.lerp(this.currentAtmosphere.fogDensity, this.targetAtmosphere.fogDensity, ease);
    this.currentAtmosphere.rayIntensity = THREE.MathUtils.lerp(this.currentAtmosphere.rayIntensity, this.targetAtmosphere.rayIntensity, ease);
    this.currentAtmosphere.pollenWarmth = THREE.MathUtils.lerp(this.currentAtmosphere.pollenWarmth, this.targetAtmosphere.pollenWarmth, ease);
    this.currentAtmosphere.groundGlow = THREE.MathUtils.lerp(this.currentAtmosphere.groundGlow, this.targetAtmosphere.groundGlow, ease);
    this.currentAtmosphere.streakFrequency = THREE.MathUtils.lerp(this.currentAtmosphere.streakFrequency, this.targetAtmosphere.streakFrequency, ease);

    if (this.scene?.fog instanceof THREE.FogExp2) {
      const fogColor = new THREE.Color(this.currentAtmosphere.fogColor);
      fogColor.lerp(new THREE.Color(this.targetAtmosphere.fogColor), ease);
      this.currentAtmosphere.fogColor = fogColor.getHex();
      this.scene.fog.color.copy(fogColor);
      this.scene.fog.density = this.currentAtmosphere.fogDensity;
    }
  }
}