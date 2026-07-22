import * as THREE from 'three';
import { BaseParticleLayer } from './BaseParticleLayer';

export class DistantDust extends BaseParticleLayer {
  private readonly speeds: Float32Array;
  private readonly drift: Float32Array;

  constructor(count: number) {
    super({ count, pointScale: 48, opacity: 1 });
    this.speeds = new Float32Array(count);
    this.drift = new Float32Array(count);

    const palette = [new THREE.Color('#fff1b2'), new THREE.Color('#edf3dc'), new THREE.Color('#cfe2a8')];
    for (let i = 0; i < count; i += 1) {
      this.seeds[i] = this.randomRange(i, 0, 1);
      this.speeds[i] = this.randomRange(i + 91, 0.028, 0.052);
      this.drift[i] = this.randomRange(i + 181, -0.12, 0.12);
      this.positions[i * 3] = this.randomRange(i + 11, -10, 10);
      this.positions[i * 3 + 1] = this.randomRange(i + 23, -5.4, 5.4);
      this.positions[i * 3 + 2] = this.randomRange(i + 37, -24, -9);
      this.sizes[i] = this.randomRange(i + 43, 3.4, 7.5);
      this.opacities[i] = this.randomRange(i + 53, 0.15, 0.32);
      this.phases[i] = this.randomRange(i + 67, 0, Math.PI * 2);
      const color = palette[i % palette.length];
      this.colors.set([color.r, color.g, color.b], i * 3);
    }
  }

  update(delta: number, elapsed: number, warmth: number) {
    this.material.uniforms.uWarmth.value = warmth;
    for (let i = 0; i < this.maxCount; i += 1) {
      const offset = i * 3;
      this.positions[offset] += Math.sin(elapsed * 0.12 + this.phases[i]) * this.drift[i] * delta;
      this.positions[offset + 1] -= this.speeds[i] * delta;
      if (this.positions[offset + 1] < -this.bounds.height * 0.58) {
        this.positions[offset + 1] = this.bounds.height * 0.58;
        this.positions[offset] = this.randomRange(i + elapsed * 17, -this.bounds.width * 0.55, this.bounds.width * 0.55);
      }
    }
    this.flagPositionUpdate();
  }
}
