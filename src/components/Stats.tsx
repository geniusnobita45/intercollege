import { Award, BookOpenCheck, GraduationCap, Orbit, Users } from 'lucide-react';
import { college } from '../data/college';

const icons = [GraduationCap, Award, Users, BookOpenCheck];

export default function Stats() {
  return (
    <section aria-labelledby="stats-title" className="home-sv-stats-section">
      <img
        className="home-sv-stats-photo"
        src="/images/hls-campus-gate.jpg"
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <div className="home-sv-stats-photo-overlay" aria-hidden="true" />
      <div className="home-sv-stats-grid" aria-hidden="true" />
      <div className="home-sv-stats-orbit" aria-hidden="true"><Orbit /></div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-stats-heading">
          <span className="home-sv-eyebrow home-sv-eyebrow--light">College at a glance</span>
          <h2 id="stats-title">A growing learning community, connected by purpose.</h2>
          <p>Numbers provide scale. The real story is the shared progress behind them.</p>
        </div>
        <div className="home-sv-stats-list">
          {college.stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <article key={stat.label} className="home-sv-stat-card">
                <span className="home-sv-stat-number">{String(index + 1).padStart(2, '0')}</span>
                <Icon />
                <strong>{stat.value}</strong>
                <p>{stat.label}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
