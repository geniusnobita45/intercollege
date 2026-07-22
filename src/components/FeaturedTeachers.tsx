import { ArrowRight, BookOpenCheck, Network, Sparkles } from 'lucide-react';
import { teachers } from '../data/teachers';
import TeacherAvatar from './TeacherAvatar';

export default function FeaturedTeachers() {
  return (
    <section id="teachers" aria-labelledby="featured-teachers-title" className="home-sv-section home-sv-teachers-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="home-sv-teachers-shell">
          <div className="home-sv-teacher-network" aria-hidden="true"><Network /><span /><span /><span /><span /></div>
          <header className="home-sv-section-header home-sv-section-header--split">
            <div>
              <span className="home-sv-eyebrow">Featured faculty</span>
              <h2 id="featured-teachers-title">Meet the mentors behind student progress.</h2>
              <p>Departments connect through shared guidance, clear explanations and consistent encouragement.</p>
            </div>
            <a href="/teachers" className="home-sv-button home-sv-button--primary">View all teachers <ArrowRight /></a>
          </header>

          <div className="home-sv-teacher-grid">
            {teachers.slice(0, 4).map((teacher, index) => (
              <article key={teacher.slug} className="home-sv-teacher-card">
                <span className="home-sv-teacher-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="home-sv-teacher-image">
                  <TeacherAvatar teacher={teacher} className="h-full w-full" />
                  <div className="home-sv-teacher-image-overlay" />
                </div>
                <div className="home-sv-teacher-copy">
                  <p><BookOpenCheck /> {teacher.department}</p>
                  <h3>{teacher.name}</h3>
                  <strong>{teacher.role}</strong>
                  <a href={`/teachers/${teacher.slug}`}>View profile <ArrowRight /></a>
                </div>
                <Sparkles className="home-sv-teacher-spark" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

