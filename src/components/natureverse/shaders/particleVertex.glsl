attribute float aSize;
attribute float aOpacity;
attribute float aPhase;

varying float vOpacity;
varying vec3 vColor;
varying float vPhase;

uniform float uPixelRatio;
uniform float uPointScale;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  float depthScale = uPointScale / max(1.0, -viewPosition.z);
  gl_PointSize = aSize * uPixelRatio * depthScale;

  vOpacity = aOpacity;
  vColor = color;
  vPhase = aPhase;
}
