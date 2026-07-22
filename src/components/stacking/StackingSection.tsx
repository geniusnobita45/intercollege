import { useEffect, useRef, type CSSProperties } from 'react';
import { useSectionTraversal } from './useSectionTraversal';
import { useStackEligibility } from './useStackEligibility';
import type { StackingSectionProps } from './stackingTypes';

export default function StackingSection({
  id,
  index,
  children,
  theme = 'morning',
  className = '',
  allowStacking = true,
  forceFlow = false,
  interactive = false,
}: StackingSectionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const traversed = useSectionTraversal(bottomSentinelRef);
  const { canStack, focused, metrics, mode } = useStackEligibility(sectionRef, contentRef, {
    allowStacking,
    forceFlow,
    interactive,
  });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const section = sectionRef.current;
    if (!wrapper || !section || !canStack || focused) return;

    let animationFrame = 0;
    const updateMotion = () => {
      const rect = wrapper.getBoundingClientRect();
      const distance = Math.max(1, wrapper.offsetHeight - metrics.navbarHeight);
      const raw = Math.min(1, Math.max(0, -rect.top / distance));
      const eased = raw < 0.72 ? 0 : (raw - 0.72) / 0.28;
      section.style.setProperty('--stack-scale', String(1 - eased * 0.03));
      section.style.setProperty('--stack-y', `${Math.round(eased * -18)}px`);
      section.style.setProperty('--stack-opacity', String(1 - eased * 0.08));
      section.style.setProperty('--stack-brightness', String(1 - eased * 0.06));
      section.style.setProperty('--stack-blur', `${(eased * 0.75).toFixed(2)}px`);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateMotion);
    };

    updateMotion();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      section.style.removeProperty('--stack-scale');
      section.style.removeProperty('--stack-y');
      section.style.removeProperty('--stack-opacity');
      section.style.removeProperty('--stack-brightness');
      section.style.removeProperty('--stack-blur');
    };
  }, [canStack, focused, metrics.navbarHeight]);

  const style = {
    '--stack-index': index,
    '--stack-navbar-height': `${metrics.navbarHeight || 80}px`,
    zIndex: 20 + index,
  } as CSSProperties;

  return (
    <div
      id={id}
      ref={wrapperRef}
      className={`stacking-section-wrap ${className}`}
      data-stack-mode={mode}
      data-stack-traversed={traversed ? 'true' : 'false'}
      data-stack-focused={focused ? 'true' : 'false'}
      data-stack-interactive={interactive ? 'true' : 'false'}
      style={style}
    >
      <article
        ref={sectionRef}
        className="stacking-section"
        data-stack-theme={theme}
        aria-label={id.replace(/-/g, ' ')}
      >
        <div className="stacking-section-surface" aria-hidden="true" />
        <div className="stacking-section-decoration" aria-hidden="true" />
        <div ref={contentRef} className="stacking-section-content">
          {children}
        </div>
        <div
          ref={bottomSentinelRef}
          className="stacking-section-sentinel"
          aria-hidden="true"
        />
      </article>
    </div>
  );
}
