import * as THREE from 'three';
import { BaseParticleLayer } from './BaseParticleLayer';

export class ForegroundParticles extends BaseParticleLayer {
  private readonly speedX: Float32Array;
  private readonly speedY: Float32Array;

  constructor(count: number) {
    super({ count, additive: true, pointScale: 72, opacity: 0.92 });
    this.speedX = new Float32Array(count);
    this.speedY = new Float32Array(count);
    const palette = [new THREE.Color('#ffe5a2'), new THREE.Color('#cfe8a1'), new THREE.Color('#fff8dc')];

    for (let i = 0; i < count; i += 1) {
      const sideBias = i % 2 === 0 ? -1 : 1;
      this.seeds[i] = this.randomRange(i, 0, 1);
      this.speedX[i] = this.randomRange(i + 15, 0.035, 0.095) * -sideBias;
      this.speedY[i] = this.randomRange(i + 22, -0.045, 0.055);
      this.positions[i * 3] = sideBias * this.randomRange(i + 33, 5.6, 11.2);
      this.positions[i * 3 + 1] = this.randomRange(i + 47, -4.8, 4.8);
      this.positions[i * 3 + 2] = this.randomRange(i + 61, 1.5, 5.6);
      this.sizes[i] = this.randomRange(i + 71, 18, 42);
      this.opacities[i] = this.randomRange(i + 89, 0.22, 0.48);
      this.phases[i] = this.randomRange(i + 99, 0, Math.PI * 2);
      const color = palette[i % palette.length];
      this.colors.set([color.r, color.g, color.b], i * 3);
    }
  }

  update(delta: number, elapsed: number, warmth: number) {
    this.material.uniforms.uWarmth.value = warmth;
    for (let i = 0; i < this.maxCount; i += 1) {
      const offset = i * 3;
      this.positions[offset] += this.speedX[i] * delta;
      this.positions[offset + 1] += (this.speedY[i] + Math.sin(elapsed * 0.18 + this.phases[i]) * 0.045) * delta;
      if (this.positions[offset] > this.bounds.width * 0.68) this.positions[offset] = -this.bounds.width * 0.68;
      if (this.positions[offset] < -this.bounds.width * 0.68) this.positions[offset] = this.bounds.width * 0.68;
      if (this.positions[offset + 1] > this.bounds.height * 0.54) this.positions[offset + 1] = -this.bounds.height * 0.54;
      if (this.positions[offset + 1] < -this.bounds.height * 0.54) this.positions[offset + 1] = this.bounds.height * 0.54;
    }
    this.flagPositionUpdate();
  }
}
