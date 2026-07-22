import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedCounterProps {
  value: string; // e.g. "7.5", "13.5K+", "50+", "100%"
  label: string;
  sublabel?: string;
  durationMs?: number;
}

export default function AnimatedCounter({
  value,
  label,
  sublabel,
  durationMs = 1600,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [displayValue, setDisplayValue] = useState('0');
  const reducedMotion = useReducedMotion();

  // Extract numeric prefix, suffix, and decimals from value
  const match = value.match(/^([\D]*)([\d.]+)([\D]*)$/);
  const prefix = match ? match[1] : '';
  const numericRaw = match ? parseFloat(match[2]) : NaN;
  const suffix = match ? match[3] : '';
  const isFloat = match ? match[2].includes('.') : false;
  const decimals = isFloat && match ? (match[2].split('.')[1] || '').length : 0;

  useEffect(() => {
    if (reducedMotion) {
      setInView(true);
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [reducedMotion, value]);

  useEffect(() => {
    if (!inView || reducedMotion || isNaN(numericRaw)) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = numericRaw * eased;
      
      const formattedNum = isFloat ? current.toFixed(decimals) : Math.floor(current).toString();
      setDisplayValue(`${prefix}${formattedNum}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, numericRaw, durationMs, isFloat, decimals, prefix, suffix, value, reducedMotion]);

  return (
    <div ref={ref} className="group relative flex flex-col items-center text-center p-6 sm:p-8">
      {/* Animated divider line */}
      <div
        className="mb-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: inView ? '60%' : '0%' }}
        aria-hidden="true"
      />
      <div className="font-display text-4xl font-bold tracking-tight text-text-dark sm:text-5xl lg:text-6xl">
        {isNaN(numericRaw) ? value : displayValue}
      </div>
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-primary">
        {label}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs font-medium text-text-light">{sublabel}</p>
      )}
    </div>
  );
}
