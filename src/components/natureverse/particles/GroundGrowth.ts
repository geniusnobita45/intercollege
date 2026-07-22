import * as THREE from 'three';
import { BaseParticleLayer } from './BaseParticleLayer';

export class GroundGrowth extends BaseParticleLayer {
  private readonly lifetime: Float32Array;
  private readonly age: Float32Array;
  private readonly rise: Float32Array;
  private readonly drift: Float32Array;

  constructor(count: number) {
    super({ count, additive: true, pointScale: 62, warmth: 1.08 });
    this.lifetime = new Float32Array(count);
    this.age = new Float32Array(count);
    this.rise = new Float32Array(count);
    this.drift = new Float32Array(count);
    const palette = [new THREE.Color('#dff0a5'), new THREE.Color('#ffd986'), new THREE.Color('#8fbd65')];

    for (let i = 0; i < count; i += 1) {
      this.lifetime[i] = this.randomRange(i + 5, 4.6, 8.8);
      this.age[i] = this.randomRange(i + 9, 0, this.lifetime[i]);
      this.rise[i] = this.randomRange(i + 13, 0.65, 1.15);
      this.drift[i] = this.randomRange(i + 21, -0.34, 0.34);
      this.phases[i] = this.randomRange(i + 31, 0, Math.PI * 2);
      this.sizes[i] = this.randomRange(i + 43, 7, 18);
      const color = palette[i % palette.length];
      this.colors.set([color.r, color.g, color.b], i * 3);
      this.respawn(i, this.age[i]);
    }
  }

  update(delta: number, elapsed: number, warmth: number) {
    this.material.uniforms.uWarmth.value = warmth;
    for (let i = 0; i < this.maxCount; i += 1) {
      this.age[i] += delta;
      if (this.age[i] > this.lifetime[i]) {
        this.respawn(i, 0);
      }
      const progress = this.age[i] / this.lifetime[i];
      const offset = i * 3;
      this.positions[offset] += (this.drift[i] + Math.sin(elapsed * 0.8 + this.phases[i]) * 0.06) * delta;
      this.positions[offset + 1] += this.rise[i] * delta;
      const fadeIn = Math.min(1, progress / 0.18);
      const fadeOut = 1 - Math.max(0, (progress - 0.68) / 0.32);
      const glow = Math.sin(progress * Math.PI);
      this.opacities[i] = (0.35 + glow * 0.37) * fadeIn * fadeOut;
    }
    this.flagPositionUpdate();
    this.flagOpacityUpdate();
  }

  private respawn(index: number, age: number) {
    this.age[index] = age;
    const offset = index * 3;
    this.positions[offset] = this.randomRange(index + performance.now() * 0.01, -this.bounds.width * 0.46, this.bounds.width * 0.46);
    this.positions[offset + 1] = -this.bounds.height * this.randomRange(index + 33, 0.52, 0.36);
    this.positions[offset + 2] = this.randomRange(index + 71, -5.2, 2.2);
    this.opacities[index] = 0;
  }
}
