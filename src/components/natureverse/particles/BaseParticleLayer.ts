import * as THREE from 'three';
import particleVertexShader from '../shaders/particleVertex.glsl?raw';
import particleFragmentShader from '../shaders/particleFragment.glsl?raw';
import type { ViewBounds } from '../types';

type LayerOptions = {
  count: number;
  additive?: boolean;
  pointScale?: number;
  warmth?: number;
  opacity?: number;
};

export abstract class BaseParticleLayer {
  readonly group = new THREE.Group();
  protected readonly geometry = new THREE.BufferGeometry();
  protected readonly positions: Float32Array;
  protected readonly colors: Float32Array;
  protected readonly sizes: Float32Array;
  protected readonly opacities: Float32Array;
  protected readonly phases: Float32Array;
  protected readonly seeds: Float32Array;
  protected readonly material: THREE.ShaderMaterial;
  protected bounds: ViewBounds = { width: 18, height: 10 };
  protected maxCount: number;

  constructor(options: LayerOptions) {
    this.maxCount = options.count;
    this.positions = new Float32Array(options.count * 3);
    this.colors = new Float32Array(options.count * 3);
    this.sizes = new Float32Array(options.count);
    this.opacities = new Float32Array(options.count);
    this.phases = new Float32Array(options.count);
    this.seeds = new Float32Array(options.count);

    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
        uPointScale: { value: options.pointScale ?? 54 },
        uWarmth: { value: options.warmth ?? 1 },
        uGlobalOpacity: { value: options.opacity ?? 1 },
      },
      transparent: true,
      depthWrite: false,
      vertexColors: true,
      blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute('aOpacity', new THREE.BufferAttribute(this.opacities, 1));
    this.geometry.setAttribute('aPhase', new THREE.BufferAttribute(this.phases, 1));
    this.geometry.setDrawRange(0, options.count);

    const points = new THREE.Points(this.geometry, this.material);
    this.group.add(points);
  }

  abstract update(delta: number, elapsed: number, warmth: number): void;

  resize(bounds: ViewBounds, pixelRatio: number) {
    this.bounds = bounds;
    this.material.uniforms.uPixelRatio.value = pixelRatio;
  }

  setDrawCount(count: number) {
    this.geometry.setDrawRange(0, Math.max(0, Math.min(this.maxCount, count)));
  }

  setVisible(visible: boolean) {
    this.group.visible = visible;
  }

  setParallax(x: number, y: number, pixelDepth: number) {
    const worldX = (pixelDepth / Math.max(1, window.innerWidth)) * this.bounds.width;
    const worldY = (pixelDepth / Math.max(1, window.innerHeight)) * this.bounds.height;
    this.group.position.set(x * worldX, y * worldY, 0);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }

  protected flagPositionUpdate() {
    const attribute = this.geometry.getAttribute('position');
    if (attribute) attribute.needsUpdate = true;
  }

  protected flagOpacityUpdate() {
    const attribute = this.geometry.getAttribute('aOpacity');
    if (attribute) attribute.needsUpdate = true;
  }

  protected randomRange(index: number, min: number, max: number) {
    const seed = Math.sin((index + 1) * 12.9898) * 43758.5453;
    return min + (seed - Math.floor(seed)) * (max - min);
  }
}
