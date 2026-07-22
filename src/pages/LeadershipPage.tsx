import { useState } from 'react';
import { Quote, ArrowRight, GraduationCap, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import { college } from '../data/college';

export default function LeadershipPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const fullMessages = [
    {
      ...college.leadership[0],
      quote: "Education is not merely acquiring information; it is developing character, discipline, and the confidence to turn ideas into meaningful action.",
      fullMessage: "At HLS Inter College, we believe every student possesses unique potential. Our dedicated team of educators strives daily to foster an environment where discipline meets curiosity. Through structured academics, cultural activities, and sports, we prepare our learners to stand strong in competitive examinations while remaining deeply rooted in strong moral values. We welcome parents and students to be an active part of this growth journey.",
    },
    {
      ...college.leadership[1],
      quote: "Creating a modern, safe, and spacious 7.5-acre campus in Devmanpur ensures our students have every opportunity to learn and excel.",
      fullMessage: "From the foundation of HLS Inter College, our management vision has been clear: to provide rural and regional learners in Ghatampur with facilities, faculty, and opportunities on par with leading educational institutions. We continuously invest in campus infrastructure, computer education, and co-curricular programs so that our students can step confidently into future career pathways.",
    },
  ];

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--leadership">
      <div className="inner-page-bg-accents" aria-hidden="true" />

      <InnerPageHero
        eyebrow="Message Desk"
        title="Guiding vision & college leadership."
        description="Meet the leaders guiding HLS Inter College towards educational quality, disciplined growth, and holistic development."
        crumbs={[{ label: 'About Us', href: '/about' }, { label: 'Leadership' }]}
        aside={
          <>
            <GraduationCap className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Leadership Desk</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Guiding academic standards, campus infrastructure, and student guidance in Devmanpur.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'leadership-natureverse', theme: 'sunpath' },
        { id: 'leadership-messages', theme: 'mentor', interactive: true, forceFlow: true },
        { id: 'leadership-cta', theme: 'path' },      ]}>
        <NatureVerseScene variant="leadership" />

      {/* Leadership Profile Cards Section */}
      <section className="sv-content-section sv-content-section--leadership relative py-14 lg:py-24 overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mb-14 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">College Desk</p>
              <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.4rem)' }}>
                Messages from the Leadership
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-text-light" style={{ fontSize: 'clamp(1rem, 1.1vw, 1.125rem)' }}>
                Guiding principles and vision that shape daily learning and campus culture at HLS Inter College.
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-10 lg:grid-cols-2">
            {fullMessages.map((profile, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <FadeUp key={profile.name} delayMs={index * 120}>
                  <article className="group relative flex flex-col overflow-hidden schoolverse-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
                    {/* Signature Accent Line that expands on hover */}
                    <div className="h-1.5 w-full bg-gray-100/80 overflow-hidden" aria-hidden="true">
                      <div className="h-full w-12 bg-primary transition-all duration-500 group-hover:w-full" />
                    </div>

                    <div className="grid gap-6 p-7 sm:grid-cols-[200px_1fr] sm:p-8">
                      {/* Properly Cropped Photograph */}
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-teal-900/10 shadow-md">
                        <img
                          src={profile.image}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = profile.fallback;
                          }}
                          alt={`Portrait of ${profile.name}`}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="inline-block rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary border border-orange-100">
                              {profile.role}
                            </span>
                            <Quote className="h-7 w-7 text-primary/25" aria-hidden="true" />
                          </div>

                          <h3 className="mt-3 font-display text-2xl font-bold text-text-dark">{profile.name}</h3>
                          <p className="text-xs font-semibold text-secondary uppercase tracking-wider">{profile.qualification}</p>

                          <blockquote className="mt-4 font-display italic leading-relaxed text-text-dark/90 text-sm border-l-2 border-primary/40 pl-3">
                            "{profile.quote}"
                          </blockquote>
                        </div>

                        {/* Read Message Interaction */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setExpandedIndex(isExpanded ? null : index)}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-colors hover:text-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                          >
                            {isExpanded ? (
                              <>Close Message <ChevronUp className="h-4 w-4" /></>
                            ) : (
                              <>Read Full Message <ChevronDown className="h-4 w-4" /></>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Message Drawer */}
                    {isExpanded && (
                      <div className="border-t border-orange-100/80 bg-orange-50/40 p-7 sm:p-8 animate-fadeIn">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">Message Detail</p>
                        <p className="leading-relaxed text-text-light text-sm sm:text-base">
                          {profile.fullMessage}
                        </p>
                      </div>
                    )}
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="schoolverse-card p-8 text-center shadow-md backdrop-blur-md">
              <ShieldCheck className="mx-auto h-9 w-9 text-secondary mb-2" />
              <h2 className="font-display text-xl font-bold text-text-dark">Have questions about HLS Inter College?</h2>
              <p className="mt-2 text-sm text-text-light">Get in touch with our office or explore our teaching community.</p>
              <div className="mt-6 flex justify-center gap-4">
                <a href="/teachers" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-orange-200/50 hover:bg-orange-600">
                  View Faculty Directory <ArrowRight className="h-4 w-4" />
                </a>
                <a href="/contact" className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-xs font-bold uppercase tracking-wider text-text-dark hover:border-primary hover:text-primary">
                  Contact Us
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

