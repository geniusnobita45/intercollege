import * as THREE from 'three';

export class ParallaxController {
  private target = new THREE.Vector2();
  private current = new THREE.Vector2();
  private readonly enabled: boolean;
  private readonly onPointerMove = (event: PointerEvent) => {
    const x = event.clientX / Math.max(1, window.innerWidth) - 0.5;
    const y = event.clientY / Math.max(1, window.innerHeight) - 0.5;
    this.target.set(x, -y);
  };

  constructor(enabled: boolean) {
    const touch = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0);
    this.enabled = enabled && !touch;
    if (this.enabled) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    }
  }

  update(time: number) {
    if (!this.enabled) {
      this.target.set(0, 0);
    }
    this.current.x += (this.target.x - this.current.x) * 0.035;
    this.current.y += (this.target.y - this.current.y) * 0.035;
    return this.current;
  }

  dispose() {
    window.removeEventListener('pointermove', this.onPointerMove);
  }
}
