import { ArrowRight, BookOpen, Building, Users, Sparkles } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import AnimatedCounter from '../components/motion/AnimatedCounter';
import FeatureCard from '../components/motion/FeatureCard';
import EducationalValueCard from '../components/motion/EducationalValueCard';
import ImageReveal from '../components/motion/ImageReveal';
import { college } from '../data/college';
import { ConnectingJourneyLine, OpenBookIllustration, CampusBuildingIllustration } from '../components/schoolverse/SchoolVerseIllustrations';
import { GrowthEcosystemMap } from '../components/natureverse/NatureVerseIllustrations';

export default function AboutPage() {
  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--about">
      {/* Controlled Background Rhythm — subtle notebook-grid texture and soft accent radials */}
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <div className="pointer-events-none absolute right-5 top-40 h-96 w-96 rounded-full bg-orange-300/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-5 top-[40%] h-[30rem] w-[30rem] rounded-full bg-teal-300/10 blur-3xl" aria-hidden="true" />

      {/* Inner-page Header */}
      <InnerPageHero
        eyebrow="About HLS Inter College"
        title="Education, discipline, confidence and community."
        description="A co-educational institution in Devmanpur, Ghatampur committed to academic excellence, value-based character building, and comprehensive student growth."
        crumbs={[{ label: 'About Us' }]}
        aside={
          <>
            <Building className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">7.5-Acre Campus</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Rooted in Devmanpur, providing a spacious and safe environment for learning, sports, and cultural development.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'about-natureverse', theme: 'morning' },
        { id: 'about-statistics', theme: 'sunpath' },
        { id: 'about-campus-story', theme: 'canopy' },
        { id: 'about-growth-path', theme: 'forest' },
        { id: 'about-values', theme: 'mentor' },
        { id: 'about-cta', theme: 'path' },
      ]}>
        <NatureVerseScene variant="about" />

      {/* Statistics Section (Verified Facts & Fact-based Counters) */}
      <section aria-label="College Statistics" className="sv-content-section sv-content-section--sunrise relative z-10 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="schoolverse-card p-6 shadow-xl backdrop-blur-md sm:p-10">
              <div className="mb-8 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Verified Facts</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-text-dark sm:text-3xl">
                  A legacy of learning and participation
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100/80">
                <AnimatedCounter value="7.5" label="Acres Campus" sublabel="Co-educational environment" />
                <AnimatedCounter value="50+" label="Faculty Team" sublabel="Qualified & dedicated" />
                <AnimatedCounter value="13.5K+" label="Learners Guided" sublabel="Academic & practical" />
                <AnimatedCounter value="100%" label="Commitment" sublabel="Discipline & excellence" />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Mission & Campus Story Section */}
      <section className="sv-content-section relative py-12 lg:py-16 overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <FadeUp>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Campus Story</p>
                <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.4rem)', lineHeight: 1.1 }}>
                  Ideas become action in a purposeful environment.
                </h2>
                <p className="mt-5 leading-[1.75] text-text-light" style={{ fontSize: 'clamp(1rem, 1.1vw, 1.125rem)' }}>
                  {college.mission}
                </p>
                <p className="mt-4 leading-[1.75] text-text-light" style={{ fontSize: 'clamp(1rem, 1.1vw, 1.125rem)' }}>
                  {college.about}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/leadership"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
                  >
                    Read Leadership Messages <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/academics"
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-text-dark transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                  >
                    Explore Academics
                  </a>
                </div>
              </div>
            </FadeUp>

            <FadeUp delayMs={150}>
              <div className="relative">
                <ImageReveal
                  src="/images/hls-banner-2.png"
                  alt="HLS Inter College main entrance and campus building"
                  aspectRatio="aspect-[4/3]"
                  className="shadow-2xl"
                />
                <CampusBuildingIllustration className="absolute -bottom-10 -left-10 w-48 h-48 text-primary pointer-events-none" opacity={0.06} />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Connected NatureVerse Feature Cards Section */}
      <section className="relative py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="schoolverse-feature-zone relative overflow-hidden">
              {/* NatureVerse living ecosystem background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-95 pointer-events-none">
                <GrowthEcosystemMap className="w-full" />
              </div>

              <FadeUp>
                <div className="relative z-10 mb-12 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Connected Journey</p>
                  <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-2xl)' }}>
                    The NatureVerse Growth Path
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-text-light" style={{ fontSize: 'var(--text-base)', lineHeight: 1.65 }}>
                    Learning | Character | Confidence | Growth - four connected pillars shaping every student's experience.
                  </p>
                </div>
              </FadeUp>

              {/* Desktop Curved Journey Connecting Line */}
              <div className="hidden lg:block relative z-0 -mb-16 -mt-6">
                <ConnectingJourneyLine />
              </div>

              <div className="relative z-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                <FeatureCard
                  number="01"
                  title="Focused Academics"
                  description="A disciplined learning environment built around prescribed syllabus, regular testing and clarity."
                  icon={BookOpen}
                  iconBg="bg-orange-50 text-primary"
                  accentColor="bg-primary"
                  linkText="Explore Academics"
                  linkHref="#academics"
                  illustrationType="book"
                />
                <FeatureCard
                  number="02"
                  title="Qualified Faculty"
                  description="A dedicated teaching community focused on conceptual clarity, student mentoring, and values."
                  icon={Users}
                  iconBg="bg-teal-50 text-secondary"
                  accentColor="bg-secondary"
                  linkText="Meet Our Teachers"
                  linkHref="#teachers"
                  illustrationType="mentor"
                />
                <FeatureCard
                  number="03"
                  title="Spacious Campus"
                  description="7.5 acres co-educational campus offering safe, spacious grounds for study and sports in Devmanpur."
                  icon={Building}
                  iconBg="bg-blue-50 text-blue-600"
                  accentColor="bg-blue-500"
                  linkText="View Campus Gallery"
                  linkHref="#gallery"
                  illustrationType="campus"
                />
                <FeatureCard
                  number="04"
                  title="Overall Growth"
                  description="Arts, cultural events, music, and sports develop confidence, teamwork, and lifelong self-belief."
                  icon={Sparkles}
                  iconBg="bg-rose-50 text-rose-500"
                  accentColor="bg-rose-500"
                  linkText="Student Activities"
                  linkHref="#events"
                  illustrationType="growth"
                />
              </div>
            </div>
        </div>
      </section>

      {/* Educational Values Section */}
      <section className="sv-content-section sv-content-section--mint relative py-12 lg:py-16">
        <OpenBookIllustration className="absolute top-10 right-10 w-72 h-72 text-teal-800 pointer-events-none" opacity={0.04} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeUp>
            <div className="mb-12 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Educational Values</p>
              <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-2xl)' }}>
                Values that shape future leaders
              </h2>
            </div>
          </FadeUp>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <EducationalValueCard
              title="Positive Learning"
              description="A vibrant and healthy environment where learners are encouraged to think, ask questions, and grow."
              tone="teal"
              delayMs={0}
            />
            <EducationalValueCard
              title="Quality & Excellence"
              description="Commitment to meaningful education, responsible conduct, and competitive examination readiness."
              tone="orange"
              delayMs={90}
            />
            <EducationalValueCard
              title="Strong Values"
              description="Education that develops knowledge, character, respect, discipline, and civic responsibility together."
              tone="blue"
              delayMs={180}
            />
            <EducationalValueCard
              title="Confident Expression"
              description="Regular opportunities for public speaking, artistic creation, sports participation, and peer leadership."
              tone="rose"
              delayMs={270}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="rounded-[2rem] bg-secondary p-8 sm:p-12 text-white shadow-2xl backdrop-blur-md">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-200">Join HLS Inter College</p>
                <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">Ready to begin your educational journey?</h2>
                <p className="mt-4 leading-relaxed text-teal-50/90">
                  Register online for admission consideration or visit our campus in Devmanpur, Ghatampur.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/#registration"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-secondary transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                  >
                    Apply Online <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                  >
                    Contact Admission Desk
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

