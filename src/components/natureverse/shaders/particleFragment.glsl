varying float vOpacity;
varying vec3 vColor;
varying float vPhase;

uniform float uWarmth;
uniform float uGlobalOpacity;

void main() {
  vec2 centered = gl_PointCoord - vec2(0.5);
  float distanceToCenter = length(centered);

  float softCircle = smoothstep(0.5, 0.08, distanceToCenter);
  float innerGlow = smoothstep(0.28, 0.0, distanceToCenter);
  float organicEdge = 0.9 + 0.1 * sin((centered.x + centered.y) * 12.0 + vPhase);

  float alpha = (softCircle * vOpacity + innerGlow * vOpacity * 0.35) * organicEdge * uGlobalOpacity;

  if (alpha < 0.01) {
    discard;
  }

  vec3 warmed = mix(vColor, vec3(1.0, 0.82, 0.38), clamp(uWarmth - 1.0, 0.0, 0.45));
  gl_FragColor = vec4(warmed, alpha);
}
