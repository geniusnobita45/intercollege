import { Children, isValidElement, type ReactNode } from 'react';
import StackingSection from './StackingSection';
import type { StackTheme } from './stackingTypes';
import './stacking.css';

interface StackingPageSectionConfig {
  id: string;
  theme?: StackTheme | string;
  allowStacking?: boolean;
  forceFlow?: boolean;
  interactive?: boolean;
  className?: string;
}

interface StackingPageProps {
  children: ReactNode;
  className?: string;
  sections?: StackingPageSectionConfig[];
}

export default function StackingPage({ children, className = '', sections }: StackingPageProps) {
  const content = sections
    ? Children.toArray(children).filter(isValidElement).map((child, index) => {
        const config = sections[index] ?? { id: `stacking-section-${index + 1}` };
        return (
          <StackingSection
            key={config.id}
            id={config.id}
            index={index}
            theme={config.theme}
            allowStacking={config.allowStacking}
            forceFlow={config.forceFlow}
            interactive={config.interactive}
            className={config.className}
          >
            {child}
          </StackingSection>
        );
      })
    : children;

  return (
    <div className={`stacking-page ${className}`} data-stacking-page>
      {content}
      <div className="stacking-page-end-spacer" aria-hidden="true" />
    </div>
  );
}

