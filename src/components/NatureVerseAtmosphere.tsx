import type { CSSProperties } from 'react';

type AtmosphereMode = 'home' | 'internal' | 'hero' | 'scene';

type ParticleStyle = CSSProperties & {
  '--nv-x': string;
  '--nv-y': string;
  '--nv-size': string;
  '--nv-duration': string;
  '--nv-delay': string;
  '--nv-drift': string;
  '--nv-depth': string;
  '--nv-scale-start': string;
  '--nv-scale-end': string;
  '--nv-z': string;
  '--nv-z-end': string;
  '--nv-z-fall': string;
  '--nv-z-fall-end': string;
  '--nv-opacity': string;
  '--nv-opacity-mid': string;
};

const risingParticles = Array.from({ length: 36 }, (_, index) => {
  const left = (index * 29 + 7) % 100;
  const bottom = (index * 37 + 5) % 96;
  const size = 3 + ((index * 7) % 8);
  const duration = 8 + ((index * 13) % 10);
  const delay = -((index * 1.37) % duration);
  const drift = -46 + ((index * 23) % 92);
  const depth = 0.55 + ((index * 11) % 45) / 50;
  const opacity = 0.22 + ((index * 9) % 38) / 100;

  return {
    '--nv-x': `${left}%`,
    '--nv-y': `${bottom}%`,
    '--nv-size': `${size}px`,
    '--nv-duration': `${duration}s`,
    '--nv-delay': `${delay}s`,
    '--nv-drift': `${drift}px`,
    '--nv-depth': depth.toFixed(2),
    '--nv-scale-start': (depth * 0.65).toFixed(2),
    '--nv-scale-end': (depth * 1.3).toFixed(2),
    '--nv-z': `${Math.round(depth * 95)}px`,
    '--nv-z-end': `${Math.round(depth * 150)}px`,
    '--nv-z-fall': `${Math.round(depth * 110)}px`,
    '--nv-z-fall-end': `${Math.round(depth * 35)}px`,
    '--nv-opacity': opacity.toFixed(2),
    '--nv-opacity-mid': (opacity * 0.78).toFixed(2),
  } as ParticleStyle;
});

const fallingParticles = Array.from({ length: 18 }, (_, index) => {
  const left = (index * 41 + 13) % 100;
  const size = 2 + ((index * 5) % 6);
  const duration = 9 + ((index * 7) % 9);
  const delay = -((index * 1.91) % duration);
  const drift = -28 + ((index * 19) % 56);
  const depth = 0.5 + ((index * 7) % 48) / 50;
  const opacity = 0.18 + ((index * 13) % 34) / 100;

  return {
    '--nv-x': `${left}%`,
    '--nv-y': `${(index * 43 + 4) % 96}%`,
    '--nv-size': `${size}px`,
    '--nv-duration': `${duration}s`,
    '--nv-delay': `${delay}s`,
    '--nv-drift': `${drift}px`,
    '--nv-depth': depth.toFixed(2),
    '--nv-scale-start': (depth * 0.65).toFixed(2),
    '--nv-scale-end': (depth * 1.3).toFixed(2),
    '--nv-z': `${Math.round(depth * 95)}px`,
    '--nv-z-end': `${Math.round(depth * 150)}px`,
    '--nv-z-fall': `${Math.round(depth * 110)}px`,
    '--nv-z-fall-end': `${Math.round(depth * 35)}px`,
    '--nv-opacity': opacity.toFixed(2),
    '--nv-opacity-mid': (opacity * 0.78).toFixed(2),
  } as ParticleStyle;
});

const grassBlades = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 17 + 4) % 100}%`,
  height: `${18 + ((index * 13) % 34)}px`,
  transform: `rotate(${-11 + ((index * 7) % 22)}deg)`,
  opacity: 0.24 + ((index * 9) % 28) / 100,
}));

export default function NatureVerseAtmosphere({ mode = 'internal' }: { mode?: AtmosphereMode }) {
  const counts: Record<AtmosphereMode, [number, number]> = {
    home: [32, 12],
    internal: [26, 10],
    hero: [12, 5],
    scene: [10, 4],
  };
  const [riseCount, fallCount] = counts[mode];

  return (
    <div className={`natureverse-atmosphere natureverse-atmosphere--${mode}`} aria-hidden="true">
      <div className="nv-sun" />
      <div className="nv-sun-rays">
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="nv-sky-haze" />
      <div className="nv-distant-canopy nv-distant-canopy--one" />
      <div className="nv-distant-canopy nv-distant-canopy--two" />

      <div className="nv-particle-field nv-particle-field--rise">
        {risingParticles.slice(0, riseCount).map((style, index) => (
          <span key={`rise-${index}`} className={`nv-particle nv-particle--${(index % 3) + 1}`} style={style} />
        ))}
      </div>

      <div className="nv-particle-field nv-particle-field--fall">
        {fallingParticles.slice(0, fallCount).map((style, index) => (
          <span key={`fall-${index}`} className={`nv-particle nv-particle--${(index % 3) + 1}`} style={style} />
        ))}
      </div>

      <div className="nv-ground">
        <div className="nv-ground-light" />
        <div className="nv-grass-line">
          {grassBlades.map((style, index) => <i key={index} style={style} />)}
        </div>
      </div>
    </div>
  );
}
