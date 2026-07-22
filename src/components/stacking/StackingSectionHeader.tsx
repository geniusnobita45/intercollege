import type { ReactNode } from 'react';

export default function StackingSectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="stacking-section-header">
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
      {children}
    </header>
  );
}
