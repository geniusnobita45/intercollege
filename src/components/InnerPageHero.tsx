import { ArrowRight, BookOpen, Home, Sparkles, Users } from 'lucide-react';
import type { ReactNode } from 'react';

type Crumb = { label: string; href?: string };

export default function InnerPageHero({
  eyebrow,
  title,
  description,
  crumbs,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs: Crumb[];
  aside?: ReactNode;
}) {
  return (
    <section className="natureverse-inner-hero schoolverse-inner-hero relative isolate overflow-hidden text-white">
      <img
        src="/images/hls-campus-gate.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-40 h-full w-full object-cover"
        style={{ objectPosition: 'center 35%' }}
        decoding="async"
      />
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(108deg,rgba(10,43,41,0.98)_0%,rgba(15,65,61,0.95)_48%,rgba(16,55,53,0.82)_100%)]" aria-hidden="true" />
      <div className="sv-hero-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="sv-hero-orbit sv-hero-orbit--one" aria-hidden="true" />
      <div className="sv-hero-orbit sv-hero-orbit--two" aria-hidden="true" />
      <div className="sv-hero-glow sv-hero-glow--orange" aria-hidden="true" />
      <div className="sv-hero-glow sv-hero-glow--teal" aria-hidden="true" />

      <div
        className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8"
        style={{ paddingTop: 'clamp(5.75rem, 9vw, 8rem)', paddingBottom: 'clamp(4rem, 7vw, 6.25rem)' }}
      >
        <div className="relative z-10">
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm font-medium text-teal-100/80">
            <a href="/" className="inline-flex items-center gap-1.5 rounded-md transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20">
              <Home className="h-3.5 w-3.5" /> Home
            </a>
            {crumbs.map((crumb) => (
              <span key={crumb.label} className="inline-flex items-center gap-2">
                <ArrowRight className="h-3 w-3 opacity-50" />
                {crumb.href ? (
                  <a href={crumb.href} className="rounded-md transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20">{crumb.label}</a>
                ) : (
                  <span aria-current="page" className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>

          <div className="sv-hero-eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>

          <h1
            className="mt-5 max-w-4xl font-display font-bold leading-[1.01] text-white drop-shadow-sm"
            style={{ fontSize: 'var(--text-page-title)', letterSpacing: '-0.035em' }}
          >
            {title}
          </h1>
          <p className="mt-5 max-w-2xl leading-[1.75] text-teal-50/88" style={{ fontSize: 'var(--text-lg)' }}>
            {description}
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5" aria-label="College values">
            <span className="sv-hero-chip"><BookOpen /> Academic clarity</span>
            <span className="sv-hero-chip"><Users /> Student growth</span>
            <span className="sv-hero-chip"><Sparkles /> Confident expression</span>
          </div>
        </div>

        {aside && (
          <div className="sv-hero-aside relative z-10">
            <div className="sv-hero-aside__number" aria-hidden="true">HLS</div>
            <div className="relative z-10">{aside}</div>
            <div className="sv-hero-aside__path" aria-hidden="true">
              <span />
              <i />
              <span />
              <i />
              <span />
            </div>
          </div>
        )}
      </div>

      <div className="sv-hero-bottom-line" aria-hidden="true">
        <span />
        <strong>ROOT Â· LEARN Â· BLOOM</strong>
        <span />
      </div>
    </section>
  );
}

