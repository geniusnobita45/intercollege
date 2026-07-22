varying vec2 vUv;

uniform float uProgress;
uniform float uOpacity;

void main() {
  float head = smoothstep(0.55, 0.98, vUv.x);
  float tail = (1.0 - smoothstep(0.0, 1.0, vUv.x)) * smoothstep(0.0, 0.15, vUv.x);
  float vertical = 1.0 - smoothstep(0.0, 0.48, abs(vUv.y - 0.5));
  float lifecycle = smoothstep(0.0, 0.18, uProgress) * (1.0 - smoothstep(0.68, 1.0, uProgress));
  float alpha = (tail * 0.42 + head * 0.9) * vertical * lifecycle * uOpacity;

  if (alpha < 0.01) {
    discard;
  }

  vec3 tailColor = vec3(1.0, 0.68, 0.20);
  vec3 coreColor = vec3(1.0, 0.97, 0.78);
  gl_FragColor = vec4(mix(tailColor, coreColor, head), alpha);
}
