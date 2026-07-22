import { ArrowUpRight, Mail, Quote } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

export default function Instructors() {
  return (
    <section id="leadership" aria-labelledby="leadership-title" className="home-sv-section home-sv-leadership-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="home-sv-section-header home-sv-section-header--center">
          <span className="home-sv-eyebrow">Message desk</span>
          <h2 id="leadership-title">Leadership that gives the college a clear direction.</h2>
          <p>Guidance, discipline and a shared commitment to the progress of the college community.</p>
        </header>

        <div className="home-sv-leadership-shell">
          <div className="home-sv-leadership-line" aria-hidden="true" />
          {college.leadership.map((person, index) => (
            <article key={person.name} className="home-sv-leader-card">
              <div className="home-sv-leader-image">
                <CollegeImage src={person.image} fallbackSrc={person.fallback} alt={`${person.name}, ${person.role}`} className="h-full w-full object-cover object-top" />
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="home-sv-leader-copy">
                <Quote aria-hidden="true" />
                <p className="home-sv-leader-label">College leadership</p>
                <h3>{person.name}</h3>
                <strong>{person.role}</strong>
                <span>{person.qualification}</span>
                <p>Committed to academic quality, responsible conduct and opportunities that help every learner move forward with confidence.</p>
                <a href={`mailto:${college.email}?subject=Message for ${encodeURIComponent(person.role)}`}><Mail /> Send an enquiry <ArrowUpRight /></a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

