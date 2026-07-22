import { useLayoutEffect, useState, type RefObject } from 'react';
import { readStackViewport } from './useStackViewport';

export function useSectionTraversal(sentinelRef: RefObject<HTMLElement | null>) {
  const [traversed, setTraversed] = useState(false);

  useLayoutEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      setTraversed(true);
      return;
    }

    const makeObserver = () => {
      const { bottomSafeGap } = readStackViewport();
      return new IntersectionObserver(
        ([entry]) => setTraversed(entry.isIntersecting),
        {
          root: null,
          rootMargin: `0px 0px -${bottomSafeGap}px 0px`,
          threshold: 0.01,
        },
      );
    };

    const observer = makeObserver();
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelRef]);

  return traversed;
}
