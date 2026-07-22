import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { NatureVerseEngine } from './NatureVerseEngine';
import type { NatureVerseRoute } from './types';

export default function NatureVerseRoot({
  active,
  routeMode,
}: {
  active: boolean;
  routeMode: NatureVerseRoute;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<NatureVerseEngine | null>(null);
  const [fallback, setFallback] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || engineRef.current) return;
    const engine = new NatureVerseEngine(root, {
      active,
      route: routeMode,
      reducedMotion,
      onFallback: () => setFallback(true),
    });
    engineRef.current = engine;
    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  useEffect(() => {
    engineRef.current?.updateOptions({ active, route: routeMode, reducedMotion });
  }, [active, routeMode, reducedMotion]);

  return (
    <div
      ref={rootRef}
      className={`natureverse-root ${active ? 'natureverse-root--active' : ''} ${fallback ? 'natureverse-root--fallback' : ''}`}
      data-natureverse-root
      data-route-mode={routeMode}
      aria-hidden="true"
    >
      <div className="natureverse-static" />
    </div>
  );
}
