varying vec2 vUv;

uniform float uOpacity;
uniform float uTime;
uniform vec3 uColor;

void main() {
  float center = 1.0 - smoothstep(0.0, 0.5, abs(vUv.y - 0.5));
  float taper = smoothstep(0.0, 0.18, vUv.x) * (1.0 - smoothstep(0.68, 1.0, vUv.x));
  float shimmer = 0.82 + 0.18 * sin(uTime * 0.7 + vUv.x * 5.0);
  float alpha = center * taper * uOpacity * shimmer;

  if (alpha < 0.006) {
    discard;
  }

  gl_FragColor = vec4(uColor, alpha);
}
