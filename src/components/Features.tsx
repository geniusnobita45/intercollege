import { ArrowUpRight, BookOpen, Building2, Sparkles, Users } from 'lucide-react';

const features = [
  {
    number: '01',
    title: 'Focused Academics',
    description: 'A disciplined learning environment built around the prescribed syllabus and student progress.',
    icon: BookOpen,
    tone: 'orange',
    href: '#academics',
    link: 'Explore academics',
  },
  {
    number: '02',
    title: 'Qualified Teachers',
    description: 'A teaching community focused on clarity, confidence, values and consistent improvement.',
    icon: Users,
    tone: 'teal',
    href: '#teachers',
    link: 'Meet our teachers',
  },
  {
    number: '03',
    title: 'Spacious Campus',
    description: 'A 7.5-acre co-educational campus serving learners in Devmanpur and the Ghatampur region.',
    icon: Building2,
    tone: 'blue',
    href: '#about',
    link: 'View campus story',
  },
  {
    number: '04',
    title: 'Overall Development',
    description: 'Arts, culture, sports and campus activities support learning beyond textbooks.',
    icon: Sparkles,
    tone: 'rose',
    href: '#events',
    link: 'Discover campus life',
  },
] as const;

export default function Features() {
  return (
    <section aria-labelledby="highlights-title" className="home-sv-section home-sv-feature-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="home-sv-section-header home-sv-section-header--center">
          <span className="home-sv-eyebrow">The HLS NatureVerse</span>
          <h2 id="highlights-title">Four connected pillars. One complete student journey.</h2>
          <p>Academics, mentoring, campus space and expression work together to build knowledge, character and confidence.</p>
        </header>

        <div className="home-sv-feature-zone">
          <div className="home-sv-feature-orbit" aria-hidden="true">
            <svg viewBox="0 0 1160 300" preserveAspectRatio="none">
              <path d="M40 155 C170 55 275 255 405 155 S640 55 760 155 S980 255 1120 155" />
            </svg>
            <span className="home-sv-path-node home-sv-path-node--1" />
            <span className="home-sv-path-node home-sv-path-node--2" />
            <span className="home-sv-path-node home-sv-path-node--3" />
            <span className="home-sv-path-node home-sv-path-node--4" />
          </div>

          <div className="home-sv-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className={`home-sv-feature-card home-sv-feature-card--${feature.tone}`}>
                  <span className="home-sv-feature-number" aria-hidden="true">{feature.number}</span>
                  <Icon className="home-sv-feature-ghost" aria-hidden="true" />
                  <div className="home-sv-feature-icon"><Icon /></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <a href={feature.href}>{feature.link}<ArrowUpRight /></a>
                  <span className="home-sv-feature-accent" aria-hidden="true" />
                </article>
              );
            })}
          </div>

          <div className="home-sv-core-map" aria-label="Student growth connected to knowledge, character, confidence and community">
            <span>Knowledge</span>
            <span>Character</span>
            <strong>Student<br />Growth</strong>
            <span>Confidence</span>
            <span>Community</span>
          </div>
        </div>
      </div>
    </section>
  );
}

