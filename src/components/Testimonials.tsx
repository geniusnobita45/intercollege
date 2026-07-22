import { Compass, Quote, Sparkles } from 'lucide-react';
import { college } from '../data/college';

export default function Testimonials() {
  return (
    <section aria-labelledby="mission-title" className="home-sv-section home-sv-mission-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-mission-card">
          <div className="home-sv-mission-grid" aria-hidden="true" />
          <div className="home-sv-mission-orbit" aria-hidden="true"><Compass /><Sparkles /></div>
          <Quote className="home-sv-mission-quote" aria-hidden="true" />
          <span className="home-sv-eyebrow">Our mission</span>
          <h2 id="mission-title">&ldquo;{college.mission}&rdquo;</h2>
          <div className="home-sv-mission-signature">
            <span />
            <p>HLS Inter College</p>
            <small>Devmanpur · Ghatampur</small>
          </div>
        </div>
      </div>
    </section>
  );
}
