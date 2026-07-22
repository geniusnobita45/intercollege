import { ArrowUpRight, CalendarDays, Music2, Palette, Sparkles, Users } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

const eventIcons = [Users, Sparkles, Music2, Palette];

export default function Pricing() {
  return (
    <section id="events" aria-labelledby="events-title" className="home-sv-section home-sv-events-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-events-shell">
          <header className="home-sv-section-header home-sv-section-header--split">
            <div>
              <span className="home-sv-eyebrow">Campus life</span>
              <h2 id="events-title">Experiences that turn participation into confidence.</h2>
              <p>Assemblies, celebrations, competitions and shared learning create memorable opportunities to express, collaborate and lead.</p>
            </div>
            <div className="home-sv-event-legend" aria-label="Campus life categories">
              <span><CalendarDays /> Events</span><span><Music2 /> Expression</span><span><Users /> Community</span>
            </div>
          </header>

          <div className="home-sv-event-path" aria-hidden="true"><span /><span /><span /><span /></div>
          <div className="home-sv-event-grid">
            {college.events.map((event, index) => {
              const Icon = eventIcons[index];
              return (
                <article key={event.title} className={`home-sv-event-card home-sv-event-card--${index + 1}`}>
                  <div className="home-sv-event-image">
                    <CollegeImage src={event.image} fallbackSrc={event.fallback} alt={event.title} className="h-full w-full object-cover" />
                    <span className="home-sv-event-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="home-sv-event-category"><Icon /> Campus experience</span>
                  </div>
                  <div className="home-sv-event-copy">
                    <div><h3>{event.title}</h3><ArrowUpRight /></div>
                    <p>{event.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

