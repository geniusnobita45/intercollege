import { ArrowRight, CheckCircle2, Map, Phone, School, Sparkles } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

export default function LearnToPlay() {
  return (
    <section id="about" aria-labelledby="about-title" className="home-sv-section home-sv-about-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-about-shell">
          <div className="home-sv-campus-route" aria-hidden="true">
            <svg viewBox="0 0 560 520">
              <path d="M35 462 C108 402 78 300 188 271 C303 240 248 126 370 103 C448 88 489 45 526 18" />
              <circle cx="36" cy="462" r="8" />
              <circle cx="188" cy="271" r="8" />
              <circle cx="370" cy="103" r="8" />
            </svg>
          </div>

          <div className="home-sv-about-visual">
            <div className="home-sv-image-frame">
              <CollegeImage src={college.gallery[1].src} fallbackSrc={college.gallery[1].fallback} alt="HLS Inter College campus" className="h-full w-full object-cover" />
              <div className="home-sv-image-overlay" />
              <div className="home-sv-campus-badge">
                <span>Campus scale</span>
                <strong>7.5 Acres</strong>
                <small>Space to learn, participate and grow</small>
              </div>
            </div>
            <div className="home-sv-floating-note home-sv-floating-note--top"><School /> Co-educational campus</div>
            <div className="home-sv-floating-note home-sv-floating-note--bottom"><Map /> Devmanpur Â· Ghatampur</div>
          </div>

          <div className="home-sv-about-copy">
            <span className="home-sv-eyebrow">About the college</span>
            <h2 id="about-title">A learning environment designed as a journey, not just a timetable.</h2>
            <p className="home-sv-lead">{college.about}</p>
            <p>{college.approach}</p>

            <div className="home-sv-check-grid">
              {['Co-educational campus', 'Academic discipline', 'Personality development', 'Arts, culture and sports'].map((item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <CheckCircle2 />
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <div className="home-sv-actions">
              <a href="#academics" className="home-sv-button home-sv-button--primary">Explore academics <ArrowRight /></a>
              <a href={`tel:${college.phones[0].replace(/\s/g, '')}`} className="home-sv-button home-sv-button--secondary"><Phone /> Call the college</a>
            </div>

            <div className="home-sv-story-note">
              <Sparkles />
              <div><strong>NatureVerse idea</strong><span>Every space lets knowledge take root, values grow and confidence come into bloom.</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

