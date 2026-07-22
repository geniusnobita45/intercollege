import type { ReactNode } from 'react';

export type StackMode = 'pending' | 'stack' | 'flow' | 'soft-stack';

export type StackTheme =
  | 'morning'
  | 'canopy'
  | 'forest'
  | 'sunpath'
  | 'mentor'
  | 'bloom'
  | 'memory'
  | 'path';

export interface StackMetrics {
  availableHeight: number;
  contentHeight: number;
  navbarHeight: number;
  viewportHeight: number;
}

export interface StackingSectionProps {
  id: string;
  index: number;
  children: ReactNode;
  theme?: StackTheme | string;
  className?: string;
  allowStacking?: boolean;
  forceFlow?: boolean;
  interactive?: boolean;
}
