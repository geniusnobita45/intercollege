import type { ReactNode } from 'react';

interface NatureVersePageWrapperProps {
  children: ReactNode;
  routeName?: string;
}

export default function NatureVersePageWrapper({ children, routeName = 'inner' }: NatureVersePageWrapperProps) {
  return (
    <div className={`natureverse-page natureverse-page--${routeName}`} data-natureverse-route={routeName}>
      {children}
    </div>
  );
}

