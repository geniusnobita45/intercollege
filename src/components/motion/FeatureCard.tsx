import { ArrowRight, LucideIcon } from 'lucide-react';
import { OpenBookIllustration, MentorPeopleIllustration, CampusBuildingIllustration, GraduationCapIllustration } from '../schoolverse/SchoolVerseIllustrations';

interface FeatureCardProps {
  number: string; // e.g. "01"
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  accentColor?: string;
  linkText?: string;
  linkHref?: string;
  illustrationType?: 'book' | 'mentor' | 'campus' | 'growth';
}

export default function FeatureCard({
  number,
  title,
  description,
  icon: Icon,
  iconBg = 'bg-orange-50/80',
  iconColor = 'text-primary',
  accentColor = 'bg-primary',
  linkText,
  linkHref,
  illustrationType = 'book',
}: FeatureCardProps) {
  const renderIllustration = () => {
    switch (illustrationType) {
      case 'book':
        return <OpenBookIllustration className="absolute -bottom-6 -right-6 w-44 h-44 text-primary pointer-events-none" opacity={0.11} />;
      case 'mentor':
        return <MentorPeopleIllustration className="absolute -bottom-6 -right-6 w-44 h-44 text-secondary pointer-events-none" opacity={0.11} />;
      case 'campus':
        return <CampusBuildingIllustration className="absolute -bottom-6 -right-6 w-44 h-44 text-blue-600 pointer-events-none" opacity={0.11} />;
      case 'growth':
        return <GraduationCapIllustration className="absolute -bottom-6 -right-6 w-44 h-44 text-rose-500 pointer-events-none" opacity={0.11} />;
      default:
        return null;
    }
  };

  return (
    <article className="schoolverse-card group relative flex flex-col justify-between overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
      {/* Oversized pale background SVG illustration (4-6% opacity) */}
      {renderIllustration()}

      {/* Faint number in top right */}
      <span
        aria-hidden="true"
        className="absolute right-6 top-4 select-none font-display text-4xl font-black text-[#173e3a]/10 transition-colors duration-300 group-hover:text-primary/20 sm:text-5xl"
      >
        {number}
      </span>

      <div className="relative z-10">
        {/* Soft Icon Container */}
        <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-sm transition-transform duration-300 group-hover:scale-105`}>
          <Icon className={`h-7 w-7 ${iconColor}`} />
        </div>

        <h3 className="mb-2 font-display text-xl font-bold text-text-dark">{title}</h3>
        <p className="text-sm leading-relaxed text-text-light">{description}</p>
      </div>

      <div className="relative z-10 mt-6 pt-4">
        {/* Thin accent line that expands on hover */}
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-gray-100/80 mb-4" aria-hidden="true">
          <div className={`h-full w-10 ${accentColor} transition-all duration-300 group-hover:w-full`} />
        </div>

        {linkText && linkHref && (
          <a
            href={linkHref}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            {linkText} <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </article>
  );
}
