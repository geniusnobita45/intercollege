import { CheckCircle2, HeartHandshake, Lightbulb, MessageCircleMore, ShieldCheck } from 'lucide-react';
import { college } from '../data/college';
import CollegeImage from './CollegeImage';

const values = [
  { title: 'Positive Learning', text: 'A vibrant and healthy environment where learners are encouraged to think, participate and improve.', tone: 'yellow', icon: Lightbulb },
  { title: 'Quality & Excellence', text: 'A commitment to meaningful education, responsible conduct and competitive readiness.', tone: 'blue', icon: ShieldCheck },
  { title: 'Strong Values', text: 'Education that develops knowledge, character, respect and responsibility together.', tone: 'teal', icon: HeartHandshake },
  { title: 'Confident Expression', text: 'Activities that give students opportunities to communicate, create, perform and lead.', tone: 'pink', icon: MessageCircleMore },
] as const;

export default function EducationalValues() {
  return (
    <section aria-labelledby="values-title" className="home-sv-section home-sv-values-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="home-sv-section-header home-sv-section-header--center">
          <span className="home-sv-eyebrow">Our educational values</span>
          <h2 id="values-title">Learning that develops the whole student.</h2>
          <p>Knowledge becomes meaningful when it grows together with character, responsibility, expression and confidence.</p>
        </header>

        <div className="home-sv-values-shell">
          <div className="home-sv-values-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="home-sv-values-column">
            {values.slice(0, 2).map((value, index) => <Value key={value.title} {...value} number={index + 1} />)}
          </div>
          <div className="home-sv-values-portrait">
            <div className="home-sv-values-portrait-ring" aria-hidden="true" />
            <div className="home-sv-values-image">
              <CollegeImage src={college.gallery[2].src} fallbackSrc={college.gallery[2].fallback} alt="HLS Inter College student activity" className="h-full w-full object-cover" />
              <div className="home-sv-image-overlay" />
            </div>
            <div className="home-sv-values-core"><strong>Knowledge</strong><span>Character</span><span>Confidence</span></div>
          </div>
          <div className="home-sv-values-column">
            {values.slice(2).map((value, index) => <Value key={value.title} {...value} number={index + 3} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Value({ title, text, tone, icon: Icon, number }: { title: string; text: string; tone: 'yellow' | 'blue' | 'teal' | 'pink'; icon: typeof Lightbulb; number: number }) {
  return (
    <article className={`home-sv-value-card home-sv-value-card--${tone}`}>
      <span className="home-sv-value-number">{String(number).padStart(2, '0')}</span>
      <div className="home-sv-value-icon"><Icon /><CheckCircle2 className="home-sv-value-check" /></div>
      <div><h3>{title}</h3><p>{text}</p></div>
    </article>
  );
}

