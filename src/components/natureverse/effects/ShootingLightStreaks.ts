import * as THREE from 'three';
import streakVertexShader from '../shaders/streakVertex.glsl?raw';
import streakFragmentShader from '../shaders/streakFragment.glsl?raw';
import type { ViewBounds } from '../types';

type Streak = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  velocity: THREE.Vector2;
  age: number;
  duration: number;
};

export class ShootingLightStreaks {
  readonly streakGroup = new THREE.Group();
  private readonly active: Streak[] = [];
  private bounds: ViewBounds = { width: 18, height: 10 };
  private nextSpawn = 1.2;

  constructor(private interval: [number, number], private readonly reducedMotion: boolean) {}

  resize(bounds: ViewBounds) {
    this.bounds = bounds;
  }

  setInterval(interval: [number, number]) {
    this.interval = interval;
  }

  update(delta: number, elapsed: number, frequency: number) {
    if (this.reducedMotion) return;

    this.nextSpawn -= delta * frequency;
    if (this.nextSpawn <= 0 && this.active.length < 3) {
      this.spawn(elapsed);
      this.nextSpawn = THREE.MathUtils.lerp(this.interval[0], this.interval[1], this.random(elapsed + this.active.length));
    }

    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const streak = this.active[i];
      streak.age += delta;
      const progress = streak.age / streak.duration;
      streak.mesh.position.x += streak.velocity.x * delta;
      streak.mesh.position.y += streak.velocity.y * delta;
      streak.mesh.material.uniforms.uProgress.value = progress;
      if (progress >= 1) {
        this.disposeStreak(streak);
        this.active.splice(i, 1);
      }
    }
  }

  dispose() {
    this.active.forEach((streak) => this.disposeStreak(streak));
    this.active.length = 0;
    this.streakGroup.clear();
  }

  private spawn(seed: number) {
    const side = Math.floor(this.random(seed) * 4);
    const fromLeft = side === 0;
    const fromRight = side === 1;
    const x = fromLeft ? -this.bounds.width * 0.62 : fromRight ? this.bounds.width * 0.62 : THREE.MathUtils.lerp(-this.bounds.width * 0.45, this.bounds.width * 0.45, this.random(seed + 1));
    const y = side >= 2 ? this.bounds.height * 0.55 : THREE.MathUtils.lerp(this.bounds.height * 0.05, this.bounds.height * 0.52, this.random(seed + 2));
    const angle = THREE.MathUtils.degToRad(fromRight ? -158 + this.random(seed + 3) * 22 : -30 - this.random(seed + 4) * 25);
    const length = THREE.MathUtils.lerp(2.6, 4.8, this.random(seed + 5));
    const width = THREE.MathUtils.lerp(0.08, 0.16, this.random(seed + 6));
    const speed = THREE.MathUtils.lerp(9.5, 14.5, this.random(seed + 7));
    const duration = THREE.MathUtils.lerp(0.45, 0.9, this.random(seed + 8));

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: streakVertexShader,
      fragmentShader: streakFragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uOpacity: { value: THREE.MathUtils.lerp(0.78, 1, this.random(seed + 9)) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, 0.8);
    mesh.scale.set(length, width, 1);
    mesh.rotation.z = angle;
    this.streakGroup.add(mesh);
    this.active.push({
      mesh,
      velocity: new THREE.Vector2(Math.cos(angle) * speed, Math.sin(angle) * speed),
      age: 0,
      duration,
    });
  }

  private disposeStreak(streak: Streak) {
    this.streakGroup.remove(streak.mesh);
    streak.mesh.geometry.dispose();
    streak.mesh.material.dispose();
  }

  private random(seed: number) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }
}
