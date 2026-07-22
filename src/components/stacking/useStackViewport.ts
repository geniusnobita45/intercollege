import { useCallback, useLayoutEffect, useState } from 'react';
import { STACK_BOTTOM_SAFE_GAP, STACK_STICKY_TOP_GAP } from './stackingMotion';

function getNavbarHeight() {
  if (typeof document === 'undefined') return 80;
  const header = document.querySelector('header');
  return Math.round(header?.getBoundingClientRect().height ?? 80);
}

export function readStackViewport() {
  const viewportHeight =
    typeof window === 'undefined'
      ? 900
      : Math.round(window.visualViewport?.height ?? window.innerHeight);
  const viewportWidth =
    typeof window === 'undefined'
      ? 1440
      : Math.round(window.visualViewport?.width ?? window.innerWidth);
  const navbarHeight = getNavbarHeight();
  const stickyTopGap = viewportWidth < 768 ? 12 : STACK_STICKY_TOP_GAP;
  const bottomSafeGap = viewportWidth < 768 ? 30 : STACK_BOTTOM_SAFE_GAP;
  const availableHeight = Math.max(320, viewportHeight - navbarHeight - stickyTopGap - bottomSafeGap);

  return {
    availableHeight,
    bottomSafeGap,
    navbarHeight,
    stickyTopGap,
    viewportHeight,
    viewportWidth,
  };
}

export function useStackViewport() {
  const [viewport, setViewport] = useState(readStackViewport);

  const update = useCallback(() => {
    setViewport((current) => {
      const next = readStackViewport();
      if (
        current.availableHeight === next.availableHeight &&
        current.bottomSafeGap === next.bottomSafeGap &&
        current.navbarHeight === next.navbarHeight &&
        current.stickyTopGap === next.stickyTopGap &&
        current.viewportHeight === next.viewportHeight &&
        current.viewportWidth === next.viewportWidth
      ) {
        return current;
      }
      return next;
    });
  }, []);

  useLayoutEffect(() => {
    update();
    window.addEventListener('resize', update, { passive: true });
    window.visualViewport?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('resize', update);
      window.visualViewport?.removeEventListener('resize', update);
    };
  }, [update]);

  return viewport;
}
