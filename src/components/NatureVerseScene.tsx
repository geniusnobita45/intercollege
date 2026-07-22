import {
  Atom,
  BookOpen,
  Building2,
  Camera,
  Compass,
  Flower2,
  GraduationCap,
  Leaf,
  Mail,
  MapPin,
  Mountain,
  Music2,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  Sprout,
  SunMedium,
  Trees,
  Trophy,
  Users,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import FadeUp from './motion/FadeUp';

type SceneVariant = 'about' | 'academics' | 'teachers' | 'events' | 'gallery' | 'leadership' | 'contact';

type SceneNode = {
  label: string;
  icon: LucideIcon;
  tone: 'sun' | 'leaf' | 'earth' | 'bloom';
};

type SceneConfig = {
  kicker: string;
  title: string;
  description: string;
  centerLabel: string;
  centerIcon: LucideIcon;
  nodes: SceneNode[];
};

const configs: Record<SceneVariant, SceneConfig> = {
  about: {
    kicker: 'Campus Ecosystem',
    title: 'A place where knowledge takes root and confidence grows.',
    description: 'Academic focus, strong values, open campus space and community participation work like one living ecosystem around every learner.',
    centerLabel: 'HLS Campus',
    centerIcon: Trees,
    nodes: [
      { label: 'Roots', icon: ShieldCheck, tone: 'earth' },
      { label: 'Learning', icon: BookOpen, tone: 'sun' },
      { label: 'Community', icon: Users, tone: 'leaf' },
      { label: 'Growth', icon: Sprout, tone: 'bloom' },
    ],
  },
  academics: {
    kicker: 'Learning Canopy',
    title: 'Each learning stage grows from the strength of the one before it.',
    description: 'Strong foundations become board readiness, specialised streams and future pathways through a clear, connected academic journey.',
    centerLabel: 'Learning Tree',
    centerIcon: Sprout,
    nodes: [
      { label: 'Foundation', icon: BookOpen, tone: 'earth' },
      { label: 'Discovery', icon: Atom, tone: 'leaf' },
      { label: 'Mastery', icon: GraduationCap, tone: 'sun' },
      { label: 'Pathways', icon: Compass, tone: 'bloom' },
    ],
  },
  teachers: {
    kicker: 'Mentor Grove',
    title: 'Experienced mentors create the shelter in which learners thrive.',
    description: 'Departments collaborate to explain concepts clearly, guide students personally and build confidence beyond textbooks.',
    centerLabel: 'Mentor Grove',
    centerIcon: Trees,
    nodes: [
      { label: 'Science', icon: Atom, tone: 'leaf' },
      { label: 'Languages', icon: BookOpen, tone: 'sun' },
      { label: 'Humanities', icon: Palette, tone: 'bloom' },
      { label: 'Guidance', icon: Compass, tone: 'earth' },
    ],
  },
  events: {
    kicker: 'Campus Bloom',
    title: 'Participation brings colour, movement and confidence to campus life.',
    description: 'Culture, music, sports and shared celebrations give students meaningful opportunities to express, lead and collaborate.',
    centerLabel: 'Campus Life',
    centerIcon: Flower2,
    nodes: [
      { label: 'Culture', icon: Palette, tone: 'bloom' },
      { label: 'Music', icon: Music2, tone: 'sun' },
      { label: 'Sports', icon: Trophy, tone: 'leaf' },
      { label: 'Community', icon: Users, tone: 'earth' },
    ],
  },
  gallery: {
    kicker: 'Living Memories',
    title: 'A visual trail of moments that grew into shared memories.',
    description: 'Browse the campus, student projects, cultural programmes and people who make the college community feel alive.',
    centerLabel: 'Memory Garden',
    centerIcon: Camera,
    nodes: [
      { label: 'Campus', icon: Building2, tone: 'earth' },
      { label: 'Projects', icon: Sparkles, tone: 'leaf' },
      { label: 'Events', icon: Flower2, tone: 'bloom' },
      { label: 'People', icon: Users, tone: 'sun' },
    ],
  },
  leadership: {
    kicker: 'Guiding Light',
    title: 'Clear vision provides direction while strong values keep the roots firm.',
    description: 'Leadership connects academic quality, discipline, campus development and student opportunity into one responsible direction.',
    centerLabel: 'Vision',
    centerIcon: SunMedium,
    nodes: [
      { label: 'Values', icon: ShieldCheck, tone: 'earth' },
      { label: 'Quality', icon: GraduationCap, tone: 'leaf' },
      { label: 'Direction', icon: Compass, tone: 'sun' },
      { label: 'Progress', icon: Sprout, tone: 'bloom' },
    ],
  },
  contact: {
    kicker: 'Path to Campus',
    title: 'Every enquiry begins a clear path toward the college community.',
    description: 'Connect with the college office, plan a visit, request information or begin the registration process.',
    centerLabel: 'HLS Desk',
    centerIcon: MapPin,
    nodes: [
      { label: 'Visit', icon: Mountain, tone: 'earth' },
      { label: 'Call', icon: Phone, tone: 'leaf' },
      { label: 'Email', icon: Mail, tone: 'sun' },
      { label: 'Apply', icon: GraduationCap, tone: 'bloom' },
    ],
  },
};

const toneClasses = {
  sun: 'nv-node--sun',
  leaf: 'nv-node--leaf',
  earth: 'nv-node--earth',
  bloom: 'nv-node--bloom',
} as const;

export default function NatureVerseScene({ variant }: { variant: SceneVariant }) {
  const config = configs[variant];
  const CenterIcon = config.centerIcon;

  return (
    <section className={`nv-scene-section nv-scene-section--${variant}`} aria-label={config.kicker}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="nv-scene">
            <div className="nv-scene__copy">
              <span className="nv-kicker"><Leaf /> {config.kicker}</span>
              <h2>{config.title}</h2>
              <p>{config.description}</p>
              <div className="nv-scene__legend" aria-hidden="true">
                <span><i className="nv-dot nv-dot--sun" /> Light</span>
                <span><i className="nv-dot nv-dot--leaf" /> Growth</span>
                <span><i className="nv-dot nv-dot--earth" /> Roots</span>
                <span><i className="nv-dot nv-dot--bloom" /> Expression</span>
              </div>
            </div>

            <div className="nv-growth-map" aria-label={`${config.centerLabel} connected to four areas of student growth`}>
              <div className="nv-growth-map__sun" aria-hidden="true"><SunMedium /></div>
              <div className="nv-growth-map__wind" aria-hidden="true"><Wind /></div>
              <svg className="nv-growth-map__branches" viewBox="0 0 520 360" aria-hidden="true">
                <path d="M260 190 C224 144 177 108 78 78" />
                <path d="M260 190 C306 142 354 109 450 80" />
                <path d="M260 190 C216 229 168 266 72 288" />
                <path d="M260 190 C308 232 357 266 454 286" />
                <path className="nv-growth-map__root" d="M260 190 C246 242 248 286 228 338 M260 190 C276 245 277 290 301 338" />
              </svg>

              <div className="nv-growth-map__center">
                <span><CenterIcon /></span>
                <strong>{config.centerLabel}</strong>
                <small>Rooted growth</small>
              </div>

              {config.nodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div key={node.label} className={`nv-growth-node nv-growth-node--${index + 1} ${toneClasses[node.tone]}`}>
                    <span><Icon /></span>
                    <strong>{node.label}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

