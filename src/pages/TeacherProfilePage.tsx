import { ArrowLeft, Award, BookOpen, CheckCircle2, GraduationCap, Mail, Quote } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import InlineCampusVisual from '../components/InlineCampusVisual';
import TeacherAvatar from '../components/TeacherAvatar';
import { college } from '../data/college';
import type { TeacherProfile } from '../data/teachers';

export default function TeacherProfilePage({ teacher }: { teacher: TeacherProfile }) {
  return (
    <main id="main-content" className="inner-page-shell">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <InnerPageHero
        eyebrow="Teacher profile"
        title={teacher.name}
        description={`${teacher.role} · ${teacher.department}`}
        crumbs={[{ label: 'Teachers', href: '/teachers' }, { label: teacher.name }]}
        aside={(
          <>
            <BookOpen className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Subjects</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {teacher.subjects.map((subject) => (
                <span key={subject} className="rounded-full bg-white/12 px-3 py-1.5 text-sm font-medium text-white">{subject}</span>
              ))}
            </div>
          </>
        )}
      />

      <section className="bg-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <a href="/teachers" className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-sm font-semibold text-secondary shadow-sm backdrop-blur-sm transition hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all teachers
          </a>

          <div className="grid gap-10 lg:grid-cols-[340px_1fr]">
            {/* Left sidebar — photo + quick info */}
            <aside>
              <div className="glass-surface overflow-hidden rounded-[1.75rem] border border-white/70">
                <TeacherAvatar teacher={teacher} className="aspect-[3/4] w-full" />
                <div className="p-6">
                  <h2 className="font-display text-2xl font-bold text-text-dark">{teacher.name}</h2>
                  <p className="mt-1 text-sm font-semibold text-primary">{teacher.role}</p>

                  {/* Info list with dividers */}
                  <dl className="mt-5 divide-y divide-gray-100/60 text-sm">
                    <div className="py-3">
                      <dt className="font-semibold text-text-dark">Department</dt>
                      <dd className="mt-0.5 text-text-light">{teacher.department}</dd>
                    </div>
                    <div className="py-3">
                      <dt className="font-semibold text-text-dark">Qualification</dt>
                      <dd className="mt-0.5 text-text-light">{teacher.qualification}</dd>
                    </div>
                    <div className="py-3">
                      <dt className="font-semibold text-text-dark">Experience</dt>
                      <dd className="mt-0.5 text-text-light">{teacher.experience}</dd>
                    </div>
                  </dl>

                  {!teacher.verified && (
                    <p className="mt-4 rounded-xl bg-amber-50/80 p-3.5 text-xs leading-[1.7] text-amber-700">
                      This is a prepared profile template. Replace it with college-verified teacher information before publishing.
                    </p>
                  )}
                </div>
              </div>
            </aside>

            {/* Right content — editorial layout */}
            <div className="space-y-8">
              {/* About */}
              <article className="glass-surface rounded-[1.5rem] border border-white/70 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">About the educator</p>
                <h2 className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'var(--text-xl)' }}>A focused approach to student growth.</h2>
                <p className="mt-4 prose-width leading-[1.75] text-text-light" style={{ fontSize: 'var(--text-lg)' }}>{teacher.summary}</p>
              </article>

              {/* Campus visual */}
              <InlineCampusVisual
                src="/images/hls-event-1.png"
                alt="HLS students presenting academic projects on campus"
                eyebrow="Learning environment"
                title="Guidance that turns lessons into understanding"
                description="This campus visual represents the practical, participative learning culture supported by the college faculty."
              />

              {/* Philosophy + Expertise — side by side */}
              <div className="grid gap-7 md:grid-cols-2">
                {/* Philosophy — styled blockquote */}
                <article className="rounded-[1.5rem] border border-white/60 bg-sky-50/80 p-6 shadow-sm sm:p-7">
                  <Quote className="h-8 w-8 text-blue-400/60" aria-hidden="true" />
                  <h2 className="mt-3 font-display text-lg font-bold text-text-dark">Teaching philosophy</h2>
                  <blockquote className="mt-3 font-display italic leading-[1.6] text-text-dark" style={{ fontSize: 'var(--text-base)' }}>
                    &ldquo;{teacher.philosophy}&rdquo;
                  </blockquote>
                </article>

                {/* Expertise */}
                <article className="rounded-[1.5rem] border border-white/60 bg-orange-50/70 p-6 shadow-sm sm:p-7">
                  <GraduationCap className="h-8 w-8 text-primary/70" />
                  <h2 className="mt-3 font-display text-lg font-bold text-text-dark">Areas of expertise</h2>
                  <ul className="mt-4 grid gap-2.5">
                    {teacher.expertise.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-[1.6] text-text-light">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </div>

              {/* Achievements */}
              <article className="glass-surface rounded-[1.5rem] border border-white/70 p-6 sm:p-8">
                <Award className="h-8 w-8 text-secondary" />
                <h2 className="mt-3 font-display text-lg font-bold text-text-dark">Achievements and contributions</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {teacher.achievements.map((item) => (
                    <li key={item} className="rounded-xl bg-gray-50/70 p-4 text-sm leading-[1.7] text-text-light">{item}</li>
                  ))}
                </ul>
              </article>

              {/* Contact CTA */}
              <article className="rounded-[1.5rem] bg-secondary/95 p-6 text-white shadow-xl backdrop-blur-sm sm:p-8">
                <h2 className="font-display text-lg font-bold">Ask the college about this faculty profile</h2>
                <p className="mt-2 max-w-2xl text-sm leading-[1.7] text-teal-50/90">For verified faculty details, subject guidance or admission enquiries, contact the college directly.</p>
                <a
                  href={`mailto:${college.email}?subject=${encodeURIComponent(`Faculty enquiry: ${teacher.name}`)}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-secondary transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
                >
                  <Mail className="h-4 w-4" /> Send an enquiry
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
