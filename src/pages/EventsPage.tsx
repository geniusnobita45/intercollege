import { useState } from 'react';
import { Calendar, MapPin, ArrowRight, Sparkles, Trophy, Music, Users, Camera } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import { college } from '../data/college';

type EventTab = 'all' | 'featured' | 'campus';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTab>('all');

  const formattedEvents = [
    {
      id: 'event-1',
      number: '01',
      title: college.events[0].title,
      category: 'Campus Culture',
      date: 'Annual Event',
      location: 'Main Campus Assembly Ground',
      description: college.events[0].description,
      image: college.events[0].image,
      fallback: college.events[0].fallback,
      featured: true,
      icon: Users,
    },
    {
      id: 'event-2',
      number: '02',
      title: college.events[1].title,
      category: 'Student Festival',
      date: 'Annual Celebration',
      location: 'HLS College Grounds',
      description: college.events[1].description,
      image: college.events[1].image,
      fallback: college.events[1].fallback,
      featured: true,
      icon: Sparkles,
    },
    {
      id: 'event-3',
      number: '03',
      title: college.events[2].title,
      category: 'Arts & Music',
      date: 'Co-Curricular Program',
      location: 'Auditorium Hall',
      description: college.events[2].description,
      image: college.events[2].image,
      fallback: college.events[2].fallback,
      featured: false,
      icon: Music,
    },
    {
      id: 'event-4',
      number: '04',
      title: college.events[3].title,
      category: 'Academic & Sports',
      date: 'Inter-College Activity',
      location: 'Regional Center',
      description: college.events[3].description,
      image: college.events[3].image,
      fallback: college.events[3].fallback,
      featured: false,
      icon: Trophy,
    },
  ];

  const featuredEvent = formattedEvents[0];
  const listEvents = activeTab === 'all'
    ? formattedEvents
    : activeTab === 'featured'
    ? formattedEvents.filter(e => e.featured)
    : formattedEvents;

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--events">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      
      {/* Background Organic Color Blurs */}
      <div className="pointer-events-none absolute right-10 top-36 h-96 w-96 rounded-full bg-rose-300/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-10 top-[60%] h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" aria-hidden="true" />

      <InnerPageHero
        eyebrow="Campus Experiences"
        title="Active, vibrant & engaging college events."
        description="Explore celebrations, competitions, cultural programs, and sports events that form an integral part of student life at HLS Inter College."
        crumbs={[{ label: 'Events' }]}
        aside={
          <>
            <Camera className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Participation First</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Developing public speaking, teamwork, and creative expression beyond classroom syllabi.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'events-natureverse', theme: 'bloom' },
        { id: 'events-featured', theme: 'sunpath' },
        { id: 'events-grid', theme: 'memory', interactive: true, forceFlow: true },      ]}>
        <NatureVerseScene variant="events" />

      {/* Featured Event Section */}
      <section className="sv-content-section sv-content-section--sunrise py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mb-8">
              <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Featured Spotlight
              </span>
            </div>

            <div className="schoolverse-card grid gap-8 overflow-hidden p-6 sm:p-10 shadow-xl backdrop-blur-md lg:grid-cols-2 lg:items-center">
              {/* Image with subtle zoom 1.03 */}
              <div className="relative overflow-hidden rounded-[1.75rem] aspect-[4/3] bg-teal-900/10">
                <img
                  src={featuredEvent.image}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = featuredEvent.fallback; }}
                  alt={featuredEvent.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
                <span className="absolute top-4 right-4 font-display text-4xl font-black text-white/40 drop-shadow">
                  {featuredEvent.number}
                </span>
              </div>

              {/* Reveal Order: Category -> Date Badge -> Title -> Description -> CTA */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-teal-50 border border-teal-100 px-3 py-1 text-xs font-bold text-secondary">
                    {featuredEvent.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-text-light">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {featuredEvent.date}
                  </span>
                </div>

                <h2 className="mt-4 font-display text-3xl font-bold text-text-dark sm:text-4xl">
                  {featuredEvent.title}
                </h2>

                <p className="mt-4 leading-relaxed text-text-light" style={{ fontSize: 'clamp(1rem, 1.1vw, 1.125rem)' }}>
                  {featuredEvent.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-text-light">
                  <MapPin className="h-4 w-4 text-primary" /> {featuredEvent.location}
                </div>

                <div className="mt-8">
                  <a
                    href="#all-events"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-200/50 transition hover:bg-orange-600"
                  >
                    View All Activities <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Events Grid Section with Faint Watermark Typography */}
      <section id="all-events" className="sv-content-section sv-content-section--events relative py-12 lg:py-20 overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">CAMPUS LIFE</p>
                <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'clamp(2rem, 3.5vw, 3.4rem)' }}>
                  Moments that shape student experience
                </h2>
                <p className="mt-2 text-sm text-text-light max-w-xl">
                  From assemblies to cultural festivals, sports days and inter-school visits.
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 rounded-xl bg-white/90 p-1.5 border border-white/80 shadow-sm backdrop-blur-md">
                {[
                  { id: 'all', label: 'All Activities' },
                  { id: 'featured', label: 'Featured Events' },
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as EventTab)}
                    className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                      activeTab === t.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-text-dark hover:bg-orange-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Cards Grid with Staggered Heights and Event Numbers */}
          <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {listEvents.map((evt, idx) => {
              const EventIcon = evt.icon;
              const isAlternate = idx % 2 === 1;
              return (
                <FadeUp key={evt.id} delayMs={idx * 90}>
                  <article className={`group flex flex-col overflow-hidden schoolverse-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full flex flex-col justify-between ${isAlternate ? 'lg:translate-y-3' : ''}`}>
                    {/* Image with Mask & Subtle Zoom 1.03 */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-teal-900/10">
                      <img
                        src={evt.image}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = evt.fallback; }}
                        alt={evt.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-text-dark backdrop-blur-md shadow-sm">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> {evt.date}
                      </div>
                      <span className="absolute top-3 right-4 font-display text-3xl font-black text-white/50 drop-shadow">
                        {evt.number}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
                          <EventIcon className="h-3.5 w-3.5" /> {evt.category}
                        </span>

                        <h3 className="mt-2 font-display text-xl font-bold text-text-dark transition-colors group-hover:text-primary">
                          {evt.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-light">
                          {evt.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-text-light">
                          <MapPin className="h-3.5 w-3.5 text-primary" /> {evt.location}
                        </span>
                        <a
                          href="/gallery"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary transition-transform group-hover:translate-x-1"
                        >
                          Photos <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

