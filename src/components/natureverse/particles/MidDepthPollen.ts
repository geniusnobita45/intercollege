import * as THREE from 'three';
import { BaseParticleLayer } from './BaseParticleLayer';

export class MidDepthPollen extends BaseParticleLayer {
  private readonly speeds: Float32Array;
  private readonly direction: Float32Array;
  private readonly amplitude: Float32Array;

  constructor(count: number) {
    super({ count, additive: true, pointScale: 58, warmth: 1.05 });
    this.speeds = new Float32Array(count);
    this.direction = new Float32Array(count);
    this.amplitude = new Float32Array(count);
    const palette = [new THREE.Color('#ffd986'), new THREE.Color('#f7cf73'), new THREE.Color('#dcecb7'), new THREE.Color('#fff5c9')];

    for (let i = 0; i < count; i += 1) {
      this.seeds[i] = this.randomRange(i, 0, 1);
      this.direction[i] = i % 3 === 0 ? 1 : -1;
      this.speeds[i] = this.randomRange(i + 11, 0.07, 0.18);
      this.amplitude[i] = this.randomRange(i + 31, 0.18, 0.55);
      this.positions[i * 3] = this.randomRange(i + 41, -9.6, 9.6);
      this.positions[i * 3 + 1] = this.randomRange(i + 59, -5.3, 5.3);
      this.positions[i * 3 + 2] = this.randomRange(i + 79, -12, -1.5);
      this.sizes[i] = this.randomRange(i + 97, 6.5, 16);
      this.opacities[i] = this.randomRange(i + 101, 0.3, 0.62);
      this.phases[i] = this.randomRange(i + 113, 0, Math.PI * 2);
      const color = palette[i % palette.length];
      this.colors.set([color.r, color.g, color.b], i * 3);
    }
  }

  update(delta: number, elapsed: number, warmth: number) {
    this.material.uniforms.uWarmth.value = warmth;
    for (let i = 0; i < this.maxCount; i += 1) {
      const offset = i * 3;
      const rayGlow = Math.max(0, Math.sin(this.positions[offset] * 0.33 + this.positions[offset + 1] * 0.42 + elapsed * 0.45));
      this.positions[offset] += Math.sin(elapsed * (0.45 + this.seeds[i]) + this.phases[i]) * this.amplitude[i] * delta;
      this.positions[offset + 1] += this.direction[i] * this.speeds[i] * delta;
      this.opacities[i] = this.randomRange(i + 101, 0.3, 0.55) + rayGlow * 0.1;
      if (this.positions[offset + 1] > this.bounds.height * 0.57) this.positions[offset + 1] = -this.bounds.height * 0.56;
      if (this.positions[offset + 1] < -this.bounds.height * 0.58) this.positions[offset + 1] = this.bounds.height * 0.56;
      if (this.positions[offset] > this.bounds.width * 0.58) this.positions[offset] = -this.bounds.width * 0.57;
      if (this.positions[offset] < -this.bounds.width * 0.58) this.positions[offset] = this.bounds.width * 0.57;
    }
    this.flagPositionUpdate();
    this.flagOpacityUpdate();
  }
}
