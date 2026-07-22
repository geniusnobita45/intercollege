import { useEffect, useRef, useState, ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface FadeUpProps {
  children: ReactNode;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  distancePx?: number;
}

export default function FadeUp({
  children,
  delayMs = 0,
  durationMs = 500,
  className = '',
  distancePx = 20,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const fallbackDelay = Math.max(650, delayMs + 450);
    const revealFallback = window.setTimeout(() => setIsVisible(true), fallbackDelay);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          window.clearTimeout(revealFallback);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.clearTimeout(revealFallback);
      observer.disconnect();
    };
  }, [delayMs, reducedMotion]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${distancePx}px)`,
        transitionDuration: `${durationMs}ms`,
        transitionDelay: `${delayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </div>
  );
}
