import { useState } from 'react';
import { BookOpen, Atom, Calculator, Globe, BriefcaseBusiness, Palette, Sparkles, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import InnerPageHero from '../components/InnerPageHero';
import NatureVerseScene from '../components/NatureVerseScene';
import StackingPage from '../components/stacking/StackingPage';
import FadeUp from '../components/motion/FadeUp';
import { college } from '../data/college';
import { AtomIllustration } from '../components/schoolverse/SchoolVerseIllustrations';

type StageKey = 'all' | 'foundation' | 'secondary' | 'senior' | 'pathways';

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<StageKey>('all');

  const stages = [
    {
      id: 'foundation' as StageKey,
      stageNumber: '01',
      title: 'Foundation Stage',
      subtitle: 'Classes 6 to 8 (Middle School)',
      badge: 'Middle School',
      description: 'Building strong foundational skills in reading, mathematical reasoning, general science, and discipline.',
      outcomes: [
        'Conceptual clarity in mathematics and basic science',
        'Strong reading comprehension & language practice in Hindi & English',
        'Introduction to environmental awareness and social science',
        'Physical education and creative participation'
      ],
      subjects: [
        { name: 'Mathematics', icon: Calculator },
        { name: 'General Science', icon: Atom },
        { name: 'Languages (Hindi & English)', icon: BookOpen },
        { name: 'Social Studies', icon: Globe },
      ]
    },
    {
      id: 'secondary' as StageKey,
      stageNumber: '02',
      title: 'Secondary Stage',
      subtitle: 'Classes 9 & 10 (Board Preparation)',
      badge: 'High School',
      description: 'Focusing on UP Board examination preparation, structured problem-solving, and laboratory practical exposure.',
      outcomes: [
        'Board examination syllabus coverage & practice testing',
        'Practical laboratory understanding in Physics, Chemistry & Biology',
        'Computer literacy & digital fundamentals',
        'Structured study discipline & time management'
      ],
      subjects: [
        { name: 'High School Mathematics', icon: Calculator },
        { name: 'Physics, Chemistry & Biology', icon: Atom },
        { name: 'Social Sciences & Civics', icon: Globe },
        { name: 'Computer Applications', icon: Sparkles },
      ]
    },
    {
      id: 'senior' as StageKey,
      stageNumber: '03',
      title: 'Senior Secondary Stage',
      subtitle: 'Classes 11 & 12 (Specialised Streams)',
      badge: 'Intermediate',
      description: 'Choice of streams in Science, Commerce, and Humanities preparing students for higher education entrance exams.',
      outcomes: [
        'Stream specialization (PCM, PCB, Commerce, Arts)',
        'Competitive exam orientation (JEE, NEET, CUET foundations)',
        'Advanced problem solving and analytical thinking',
        'Career guidance & entrance counseling'
      ],
      subjects: [
        { name: 'Physics, Chemistry, Maths / Biology', icon: Atom },
        { name: 'Accountancy & Business Studies', icon: BriefcaseBusiness },
        { name: 'Humanities & Fine Arts', icon: Palette },
        { name: 'Computer Science & IT', icon: Sparkles },
      ]
    },
    {
      id: 'pathways' as StageKey,
      stageNumber: '04',
      title: 'Future Pathways',
      subtitle: 'Higher Education & Career Readiness',
      badge: 'Beyond Syllabus',
      description: 'Personality development, entrance guidance, communication practice, and co-curricular leadership.',
      outcomes: [
        'Personality development & public speaking exposure',
        'Career awareness workshops & counselor sessions',
        'Inter-school competition participation',
        'Alumni guidance network'
      ],
      subjects: [
        { name: 'Competitive Preparation', icon: Compass },
        { name: 'Communication & Leadership', icon: Sparkles },
        { name: 'Sports & Athletic Discipline', icon: Globe },
        { name: 'Arts & Cultural Expressions', icon: Palette },
      ]
    }
  ];

  const filteredStages = activeTab === 'all'
    ? stages
    : stages.filter(s => s.id === activeTab);

  return (
    <main id="main-content" className="inner-page-shell sv-page sv-page--academics">
      <div className="inner-page-bg-accents" aria-hidden="true" />
      <AtomIllustration className="absolute top-48 right-12 w-80 h-80 text-teal-800 pointer-events-none" opacity={0.04} />

      <InnerPageHero
        eyebrow="Academic Programs"
        title="A structured learning journey from foundation to future."
        description="Explore the academic pathways at HLS Inter College, designed for conceptual clarity, board excellence, and holistic personality growth."
        crumbs={[{ label: 'Academics' }]}
        aside={
          <>
            <BookOpen className="h-8 w-8 text-orange-200/80" />
            <h2 className="mt-3 text-lg font-bold">UP Board Curriculum</h2>
            <p className="mt-2 text-sm leading-[1.7] text-teal-50/85">
              Classes 6 to 12 with Science, Commerce and Arts stream specializations in Devmanpur.
            </p>
          </>
        }
      />

      <StackingPage sections={[
        { id: 'academics-natureverse', theme: 'canopy' },
        { id: 'academics-stage-filter', theme: 'sunpath', interactive: true, forceFlow: true },
        { id: 'academics-learning-journey', theme: 'forest', interactive: true, forceFlow: true },
        { id: 'academics-cta', theme: 'path' },      ]}>
        <NatureVerseScene variant="academics" />

      {/* Category Tabs with Active Underline */}
      <section className="sv-filter-section py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="schoolverse-card p-3 shadow-md backdrop-blur-md">
              <div className="flex overflow-x-auto gap-2 scrollbar-none py-1 px-1">
                {[
                  { id: 'all', label: 'All Learning Stages' },
                  { id: 'foundation', label: '01. Middle School (6-8)' },
                  { id: 'secondary', label: '02. High School (9-10)' },
                  { id: 'senior', label: '03. Intermediate (11-12)' },
                  { id: 'pathways', label: '04. Future Pathways' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as StageKey)}
                    className={`relative shrink-0 rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md shadow-orange-200/50'
                        : 'text-text-dark hover:bg-orange-50 hover:text-primary'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stage-Based Learning Journey Timeline */}
      <section className="sv-content-section sv-content-section--learning relative py-10 lg:py-16 overflow-hidden">

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Connecting Timeline Progress Line */}
            <div className="hidden lg:block absolute left-[27px] top-8 bottom-8 w-1 bg-gradient-to-b from-primary via-teal-500 to-blue-500 rounded-full opacity-30" aria-hidden="true" />

            <div className="space-y-12">
              {filteredStages.map((stage, idx) => (
                <FadeUp key={stage.id} delayMs={idx * 100}>
                  <div className="schoolverse-card relative overflow-hidden p-7 sm:p-10 shadow-lg backdrop-blur-md transition-all hover:shadow-xl">
                    <div className="grid gap-8 lg:grid-cols-[1fr_340px] items-center">
                      <div>
                        {/* Header Badge */}
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary font-display text-lg font-bold text-white shadow-md">
                            {stage.stageNumber}
                          </span>
                          <span className="rounded-full bg-teal-50 border border-teal-100/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                            {stage.badge}
                          </span>
                        </div>

                        <h3 className="mt-4 font-display text-2xl font-bold text-text-dark sm:text-3xl">
                          {stage.title}
                        </h3>
                        <p className="mt-1 font-semibold text-primary">{stage.subtitle}</p>
                        <p className="mt-3 leading-relaxed text-text-light">{stage.description}</p>

                        {/* Learning Outcomes */}
                        <div className="mt-6 pt-5 border-t border-gray-100">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-text-dark mb-3">
                            Key Learning Outcomes:
                          </h4>
                          <div className="grid gap-2.5 sm:grid-cols-2">
                            {stage.outcomes.map((outcome) => (
                              <div key={outcome} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-light">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <span>{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Subject Cards Box */}
                      <div className="rounded-2xl border border-gray-100 bg-teal-50/40 p-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-4">
                          Core Focus Areas:
                        </h4>
                        <div className="grid gap-3">
                          {stage.subjects.map(subj => {
                            const Icon = subj.icon;
                            return (
                              <div key={subj.name} className="flex items-center gap-3 rounded-xl bg-white p-3.5 shadow-sm border border-gray-100/80 transition-transform duration-300 hover:scale-[1.02]">
                                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-50 text-primary">
                                  <Icon className="h-4.5 w-4.5" />
                                </div>
                                <span className="text-xs font-semibold text-text-dark">{subj.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeUp>
            <div className="rounded-[2rem] bg-secondary p-8 sm:p-12 text-white shadow-2xl backdrop-blur-md">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-200">Admissions Open</p>
                <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">Enroll for the academic session</h2>
                <p className="mt-4 leading-relaxed text-teal-50/90">
                  Classes available: {college.admissionClasses.join(', ')}. Complete online registration for admission guidance.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href="/#registration"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-secondary transition hover:bg-orange-50"
                  >
                    Register Student Online <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Contact Admission Office
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      </StackingPage>
    </main>
  );
}

