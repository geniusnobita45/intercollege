import { CheckCircle2 } from 'lucide-react';
import FadeUp from './FadeUp';

interface EducationalValueCardProps {
  title: string;
  description: string;
  tone?: 'orange' | 'teal' | 'blue' | 'rose';
  delayMs?: number;
}

export default function EducationalValueCard({
  title,
  description,
  tone = 'teal',
  delayMs = 0,
}: EducationalValueCardProps) {
  const toneStyles = {
    orange: 'bg-orange-50 text-primary border-orange-100/80',
    teal: 'bg-teal-50 text-secondary border-teal-100/80',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/80',
    rose: 'bg-rose-50 text-rose-500 border-rose-100/80',
  };

  return (
    <FadeUp delayMs={delayMs} className="h-full">
      <article className="group flex h-full flex-col justify-between rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-xl">
        <div className="flex gap-4 items-start">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl border ${toneStyles[tone]} shadow-sm transition-transform duration-300 group-hover:scale-105`}
          >
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="mb-2 font-display text-lg font-bold text-text-dark transition-colors duration-300 group-hover:text-primary">
              {title}
            </h3>
            <p className="text-sm leading-[1.7] text-text-light">{description}</p>
          </div>
        </div>
      </article>
    </FadeUp>
  );
}
