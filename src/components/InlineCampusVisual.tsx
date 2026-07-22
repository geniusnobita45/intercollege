export default function InlineCampusVisual({
  src,
  alt,
  eyebrow,
  title,
  description,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <figure className="group relative isolate min-h-72 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-900 shadow-xl sm:min-h-80">
      <img src={src} alt={alt} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/15 to-transparent" aria-hidden="true" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200">{eyebrow}</p>
        <h2 className="mt-2 font-display font-bold text-white" style={{ fontSize: 'var(--text-xl)' }}>{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-[1.7] text-white/80">{description}</p>
      </figcaption>
    </figure>
  );
}
