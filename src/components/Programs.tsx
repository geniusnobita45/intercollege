import { ArrowUpRight, BookOpen, BriefcaseBusiness, MonitorCog, Palette, Trophy } from 'lucide-react';

const focusAreas = [
  { number: '01', title: 'Academic Learning', subtitle: 'Strong Foundations', description: 'Structured classroom learning supported by discipline, regular practice and clear academic goals.', icon: BookOpen, tone: 'orange', href: '#academics' },
  { number: '02', title: 'Commerce & Management', subtitle: 'Practical Understanding', description: 'Opportunities to build understanding in commerce, business administration and responsible decision-making.', icon: BriefcaseBusiness, tone: 'teal', href: '#academics' },
  { number: '03', title: 'Computer Education', subtitle: 'Digital Readiness', description: 'Exposure to computer science and information technology for a changing academic and professional world.', icon: MonitorCog, tone: 'blue', href: '#academics' },
  { number: '04', title: 'Activities & Sports', subtitle: 'Balanced Development', description: 'Arts, culture, music and sport help students develop confidence, teamwork and expression.', icon: Trophy, tone: 'rose', href: '#events' },
] as const;

export default function Programs() {
  return (
    <section id="academics" aria-labelledby="academics-title" className="home-sv-section home-sv-programs-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-programs-shell">
          <header className="home-sv-section-header">
            <span className="home-sv-eyebrow">Academic & campus focus</span>
            <h2 id="academics-title">Education with room to discover.</h2>
            <p>Each focus area is a connected path in a broader learning universeâ€”strong foundations, practical understanding, digital readiness and balanced growth.</p>
          </header>

          <div className="home-sv-subject-constellation" aria-hidden="true">
            <span><BookOpen /></span><span><Palette /></span><span><MonitorCog /></span><span><Trophy /></span>
          </div>

          <div className="home-sv-program-grid">
            {focusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <article key={area.title} className={`home-sv-program-card home-sv-program-card--${area.tone}`}>
                  <span className="home-sv-program-number">{area.number}</span>
                  <div className="home-sv-program-icon"><Icon /></div>
                  <p className="home-sv-program-kicker">{area.subtitle}</p>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                  <a href={area.href}>Explore pathway <ArrowUpRight /></a>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

