import * as THREE from 'three';
import sunRayVertexShader from '../shaders/sunRayVertex.glsl?raw';
import sunRayFragmentShader from '../shaders/sunRayFragment.glsl?raw';
import type { ViewBounds } from '../types';

type Ray = {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  baseX: number;
  baseY: number;
  speed: number;
  phase: number;
  opacity: number;
};

export class SunRays {
  readonly group = new THREE.Group();
  private readonly rays: Ray[] = [];
  private bounds: ViewBounds = { width: 18, height: 10 };
  private activeCount: number;

  constructor(count: number) {
    this.activeCount = count;
    for (let i = 0; i < count; i += 1) {
      const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      const material = new THREE.ShaderMaterial({
        vertexShader: sunRayVertexShader,
        fragmentShader: sunRayFragmentShader,
        uniforms: {
          uOpacity: { value: 0.12 },
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#ffe7a3') },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const width = 3.8 + i * 0.82;
      const height = 0.62 + (i % 3) * 0.22;
      mesh.scale.set(width, height, 1);
      mesh.rotation.z = THREE.MathUtils.degToRad(-25 + i * 2.8);
      mesh.position.z = -8 - i * 0.5;
      this.group.add(mesh);
      this.rays.push({
        mesh,
        baseX: -6 + i * 2.35,
        baseY: 4.2 - i * 0.44,
        speed: 0.12 + i * 0.015,
        phase: i * 1.7,
        opacity: 0.08 + (i % 4) * 0.035,
      });
    }
  }

  resize(bounds: ViewBounds) {
    this.bounds = bounds;
  }

  setActiveCount(count: number) {
    this.activeCount = count;
    this.rays.forEach((ray, index) => {
      ray.mesh.visible = index < count;
    });
  }

  setParallax(x: number, y: number) {
    this.group.position.set(x * 0.14, y * 0.08, 0);
  }

  update(elapsed: number, intensity: number) {
    this.rays.forEach((ray, index) => {
      ray.mesh.visible = index < this.activeCount;
      const material = ray.mesh.material;
      material.uniforms.uTime.value = elapsed + ray.phase;
      material.uniforms.uOpacity.value = ray.opacity * intensity * (0.78 + Math.sin(elapsed * 0.35 + ray.phase) * 0.22);
      ray.mesh.position.x = ray.baseX + Math.sin(elapsed * ray.speed + ray.phase) * 0.42;
      ray.mesh.position.y = Math.min(this.bounds.height * 0.52, ray.baseY + Math.cos(elapsed * ray.speed * 0.7 + ray.phase) * 0.16);
    });
  }

  dispose() {
    this.rays.forEach((ray) => {
      ray.mesh.geometry.dispose();
      ray.mesh.material.dispose();
    });
    this.group.clear();
  }
}
