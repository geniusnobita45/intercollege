import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';
import { shouldUseSoftStack, stackModeThreshold } from './stackingMotion';
import type { StackMetrics, StackMode } from './stackingTypes';
import { readStackViewport } from './useStackViewport';

interface EligibilityOptions {
  allowStacking?: boolean;
  forceFlow?: boolean;
  interactive?: boolean;
}

interface EligibilityState {
  focused: boolean;
  metrics: StackMetrics;
  mode: StackMode;
}

const initialMetrics: StackMetrics = {
  availableHeight: 0,
  contentHeight: 0,
  navbarHeight: 80,
  viewportHeight: 0,
};

function modesEqual(a: EligibilityState, b: EligibilityState) {
  return (
    a.focused === b.focused &&
    a.mode === b.mode &&
    Math.abs(a.metrics.availableHeight - b.metrics.availableHeight) < 2 &&
    Math.abs(a.metrics.contentHeight - b.metrics.contentHeight) < 2 &&
    Math.abs(a.metrics.navbarHeight - b.metrics.navbarHeight) < 2 &&
    Math.abs(a.metrics.viewportHeight - b.metrics.viewportHeight) < 2
  );
}

export function useStackEligibility(
  sectionRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  options: EligibilityOptions,
) {
  const { allowStacking = true, forceFlow = false, interactive = false } = options;
  const [state, setState] = useState<EligibilityState>({
    focused: false,
    metrics: initialMetrics,
    mode: 'pending',
  });

  const calculate = useCallback(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const viewport = readStackViewport();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const focused = !!section?.contains(document.activeElement);
    const contentHeight = Math.ceil(content?.scrollHeight ?? section?.scrollHeight ?? 0);

    let mode: StackMode = 'flow';
    if (!forceFlow && allowStacking && !reducedMotion && contentHeight > 0 && !focused) {
      const threshold = stackModeThreshold(viewport.viewportWidth);
      const compact = contentHeight <= viewport.availableHeight * threshold;
      if (compact) {
        mode = shouldUseSoftStack(viewport.viewportWidth, contentHeight, viewport.availableHeight)
          ? 'soft-stack'
          : viewport.viewportWidth < 768 || interactive
          ? 'flow'
          : 'stack';
      }
    }

    const next: EligibilityState = {
      focused,
      metrics: {
        availableHeight: viewport.availableHeight,
        contentHeight,
        navbarHeight: viewport.navbarHeight,
        viewportHeight: viewport.viewportHeight,
      },
      mode,
    };

    setState((current) => (modesEqual(current, next) ? current : next));
  }, [allowStacking, contentRef, forceFlow, interactive, sectionRef]);

  useLayoutEffect(() => {
    calculate();

    const section = sectionRef.current;
    const content = contentRef.current;
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(calculate) : null;
    if (section) resizeObserver?.observe(section);
    if (content) resizeObserver?.observe(content);

    const mutationObserver = typeof MutationObserver !== 'undefined' && content
      ? new MutationObserver(calculate)
      : null;
    mutationObserver?.observe(content as Node, { attributes: true, childList: true, subtree: true });

    window.addEventListener('resize', calculate, { passive: true });
    window.visualViewport?.addEventListener('resize', calculate);
    section?.addEventListener('focusin', calculate);
    section?.addEventListener('focusout', calculate);
    content?.addEventListener('load', calculate, true);
    document.fonts?.ready.then(calculate).catch(() => undefined);

    return () => {
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', calculate);
      window.visualViewport?.removeEventListener('resize', calculate);
      section?.removeEventListener('focusin', calculate);
      section?.removeEventListener('focusout', calculate);
      content?.removeEventListener('load', calculate, true);
    };
  }, [calculate, contentRef, sectionRef]);

  return {
    canStack: state.mode === 'stack' || state.mode === 'soft-stack',
    focused: state.focused,
    metrics: state.metrics,
    mode: state.mode,
  };
}
