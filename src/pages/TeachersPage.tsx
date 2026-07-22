import { ArrowRight, BookOpenCheck, Search, ShieldCheck, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import TeacherAvatar from '../components/TeacherAvatar';
import VisualStoryStrip from '../components/VisualStoryStrip';
import FadeUp from '../components/motion/FadeUp';
import { teacherDepartments, teachers } from '../data/teachers';
import { MentorPeopleIllustration } from '../components/schoolverse/SchoolVerseIllustrations';

export default function TeachersPage() {
  const [department, setDepartment] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return teachers.filter((teacher) => {
      const departmentMatch = department === 'All' || teacher.department === department;
      const queryMatch = !normalized || [teacher.name, teacher.role, teacher.department, ...teacher.subjects]
        .join(' ')
        .toLowerCase()
        .includes(normalized);
      return departmentMatch && queryMatch;
    });
  }, [department, query]);

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--teachers">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <MentorPeopleIllustration className="absolute top-40 right-10 w-72 h-72 text-secondary pointer-events-none" opacity={0.04} />

      <InnerPageHero
        eyebrow="Mentor Network"
        title="Teachers who guide, explain and inspire."
        description="Explore featured teacher profiles by subject area. Each profile displays qualifications, experience, expertise, achievements and a personal teaching philosophy."
        crumbs={[{ label: 'Teachers' }]}
        aside={(
          <>
            <Users className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">Faculty Information</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">The design is prepared for verified teacher names and photographs.</p>
          </>
        )}
      />

      <StackingPage sections={[
        { id: 'teachers-natureverse', theme: 'mentor' },
        { id: 'teachers-culture', theme: 'canopy' },
        { id: 'teachers-directory', theme: 'forest', interactive: true, forceFlow: true },
        { id: 'teachers-cta', theme: 'path' },      ]}>
        <NatureVerseScene variant="teachers" />

      <VisualStoryStrip
        eyebrow="Teaching Culture"
        title="Learning comes alive through explanation, practice and participation."
        description="The visual layer uses real HLS campus and student-activity photographs."
        items={[
          { src: '/images/hls-event-1.png', alt: 'HLS students displaying academic models and projects', label: 'Practical learning', title: 'Ideas become projects students can explain' },
          { src: '/images/hls-event-2.png', alt: 'HLS students performing together during a college programme', label: 'Confidence building', title: 'Students learn to communicate and perform' },
        ]}
      />

      {/* Directory Section with Watermark */}
      <section aria-labelledby="teacher-directory-title" className="sv-content-section sv-content-section--mentor relative bg-transparent py-10 lg:py-20 overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search & Filter Bar */}
          <FadeUp>
            <div className="teacher-filter-panel schoolverse-card grid gap-5 p-5 md:grid-cols-[1fr_auto] md:items-end sm:p-6 shadow-md backdrop-blur-md">
              <label className="grid gap-1.5 text-xs font-bold uppercase tracking-wider text-text-dark">
                Search faculty directory
                <span className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    type="search"
                    placeholder="Search subject, department or profile name..."
                    className="form-control w-full pl-10 transition-all focus:ring-4 focus:ring-primary/20 focus:border-primary"
                  />
                </span>
              </label>

              {/* Desktop Filter Chips */}
              <div className="hidden flex-wrap gap-2 md:flex">
                {teacherDepartments.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setDepartment(dept)}
                    className={`rounded-full px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                      department === dept
                        ? 'bg-primary text-white shadow-md shadow-orange-200/50'
                        : 'bg-white/80 text-text-dark hover:bg-orange-50 hover:text-primary'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Mobile Select */}
              <label className="grid min-w-48 gap-1.5 text-xs font-bold uppercase tracking-wider text-text-dark md:hidden">
                Department
                <select value={department} onChange={(event) => setDepartment(event.target.value)} className="form-control">
                  {teacherDepartments.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
            </div>
          </FadeUp>

          {/* Section heading */}
          <div className="mb-8 mt-12 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Faculty Network</p>
              <h2 id="teacher-directory-title" className="mt-2 font-display font-bold text-text-dark" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>Our Teaching Team</h2>
            </div>
            <p className="text-sm font-semibold text-text-light" aria-live="polite">{filtered.length} profile{filtered.length === 1 ? '' : 's'}</p>
          </div>

          {/* Teacher cards */}
          {filtered.length ? (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((teacher, idx) => {
                const accentColors: Record<string, string> = {
                  orange: 'bg-orange-400', teal: 'bg-teal-500', blue: 'bg-blue-500',
                  rose: 'bg-rose-400', violet: 'bg-violet-500', amber: 'bg-amber-400',
                };
                return (
                  <FadeUp key={teacher.slug} delayMs={(idx % 6) * 80}>
                    <article className="group teacher-directory-card overflow-hidden schoolverse-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl h-full flex flex-col justify-between">
                      {/* Accent bar */}
                      <div className={`h-1.5 w-full ${accentColors[teacher.accent] || 'bg-primary'}`} aria-hidden="true" />
                      
                      <div className="overflow-hidden bg-teal-900/10">
                        <TeacherAvatar teacher={teacher} className="h-52 w-full sm:h-56 transition-transform duration-500 group-hover:scale-[1.03]" />
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                              <BookOpenCheck className="h-3.5 w-3.5" /> {teacher.department}
                            </p>
                            {!teacher.verified && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                                Template
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 font-display text-xl font-bold text-text-dark">{teacher.name}</h3>
                          <p className="mt-1 text-xs font-bold uppercase text-secondary tracking-wider">{teacher.role}</p>
                          <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-text-light">{teacher.summary}</p>
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {teacher.subjects.map((subject) => (
                              <span key={subject} className="rounded-full bg-orange-50/80 border border-orange-100 px-3 py-1 text-xs font-medium text-text-dark">{subject}</span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <a
                            href={`/teachers/${teacher.slug}`}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                          >
                            Open full profile <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        </div>
                      </div>
                    </article>
                  </FadeUp>
                );
              })}
            </div>
          ) : (
            <div className="schoolverse-card p-12 text-center border-dashed">
              <Search className="mx-auto h-8 w-8 text-text-light" />
              <h3 className="mt-4 font-display text-xl font-bold text-text-dark">No matching profile found</h3>
              <p className="mt-2 text-sm text-text-light">Try another subject, name or department filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA section */}
      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="schoolverse-card p-7">
            <ShieldCheck className="h-8 w-8 text-secondary" />
            <h2 className="mt-3 text-base font-bold text-text-dark">Verified Information Desk</h2>
            <p className="mt-2 text-sm leading-[1.7] text-text-light">Teacher names, qualifications and achievements are reviewed by the college office.</p>
          </div>
          <div className="rounded-[1.75rem] bg-secondary p-7 text-white shadow-xl backdrop-blur-md">
            <h2 className="text-base font-bold">Interested in admission?</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/90">Complete online registration for the upcoming academic session.</p>
            <a href="/#registration" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-secondary transition hover:bg-orange-50">
              Register Online <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

