import { ArrowUpRight } from 'lucide-react';

type VisualStory = {
  src: string;
  alt: string;
  label: string;
  title: string;
};

export default function VisualStoryStrip({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: VisualStory[];
}) {
  return (
    <section aria-labelledby="visual-story-title" className="relative py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
            <h2 id="visual-story-title" className="mt-2 max-w-3xl font-display font-bold leading-tight text-text-dark" style={{ fontSize: 'var(--text-2xl)' }}>{title}</h2>
          </div>
          <p className="max-w-xl text-sm leading-[1.7] text-text-light">{description}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <figure key={item.src} className={`group relative isolate min-h-72 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-900 shadow-xl ${index === 0 ? 'md:col-span-2' : ''}`}>
              <img src={item.src} alt={item.alt} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" decoding="async" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/18 to-transparent" aria-hidden="true" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-200">{item.label}</p>
                <div className="mt-2 flex items-end justify-between gap-4">
                  <h3 className="text-xl font-black leading-tight sm:text-2xl">{item.title}</h3>
                  <ArrowUpRight className="h-6 w-6 shrink-0 opacity-80 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
