import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
  overlayColor?: string;
  durationMs?: number;
}

export default function ImageReveal({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  overlayColor = 'bg-teal-900',
  durationMs = 750,
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    const revealFallback = window.setTimeout(() => setRevealed(true), 700);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
          window.clearTimeout(revealFallback);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.clearTimeout(revealFallback);
      observer.disconnect();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-[1.5rem] ${aspectRatio} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] ${
          revealed ? 'scale-100' : 'scale-105'
        }`}
        style={{ transitionDuration: `${durationMs}ms` }}
      />

      {!reducedMotion && (
        <div
          className={`pointer-events-none absolute inset-0 z-10 ${overlayColor} transition-all ease-[cubic-bezier(0.22,1,0.36,1)]`}
          aria-hidden="true"
          style={{
            opacity: revealed ? 0 : 0.62,
            transform: revealed ? 'translateX(101%)' : 'translateX(0%)',
            transitionDuration: `${durationMs}ms`,
          }}
        />
      )}
    </div>
  );
}
