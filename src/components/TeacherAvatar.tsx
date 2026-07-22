import { BookOpenCheck, GraduationCap, Sparkles } from 'lucide-react';
import type { TeacherProfile } from '../data/teachers';

const accents: Record<TeacherProfile['accent'], string> = {
  orange: 'from-orange-100 via-orange-50 to-amber-100 text-orange-700 ring-orange-200',
  teal: 'from-teal-100 via-cyan-50 to-emerald-100 text-teal-700 ring-teal-200',
  blue: 'from-blue-100 via-sky-50 to-indigo-100 text-blue-700 ring-blue-200',
  rose: 'from-rose-100 via-pink-50 to-orange-100 text-rose-700 ring-rose-200',
  violet: 'from-violet-100 via-fuchsia-50 to-indigo-100 text-violet-700 ring-violet-200',
  amber: 'from-amber-100 via-yellow-50 to-orange-100 text-amber-700 ring-amber-200',
};

export default function TeacherAvatar({ teacher, className = '' }: { teacher: TeacherProfile; className?: string }) {
  if (teacher.image) {
    return <img src={teacher.image} alt={`${teacher.name}, ${teacher.role}`} className={`object-cover object-top ${className}`} loading="lazy" decoding="async" />;
  }

  return (
    <div
      aria-label={`${teacher.name} animated profile placeholder`}
      role="img"
      className={`teacher-avatar-placeholder bg-gradient-to-br ring-1 ${accents[teacher.accent]} ${className}`}
    >
      <span className="teacher-avatar-orbit teacher-avatar-orbit--one" aria-hidden="true" />
      <span className="teacher-avatar-orbit teacher-avatar-orbit--two" aria-hidden="true" />
      <span className="teacher-avatar-spark teacher-avatar-spark--one" aria-hidden="true"><Sparkles /></span>
      <span className="teacher-avatar-spark teacher-avatar-spark--two" aria-hidden="true"><BookOpenCheck /></span>
      <span className="teacher-avatar-profile" aria-hidden="true">
        <span className="teacher-avatar-head"><GraduationCap /></span>
        <span className="teacher-avatar-shoulders" />
        <span className="teacher-avatar-line teacher-avatar-line--one" />
        <span className="teacher-avatar-line teacher-avatar-line--two" />
      </span>
      <span className="teacher-avatar-initials">{teacher.initials}</span>
      <span className="teacher-avatar-department">{teacher.department}</span>
    </div>
  );
}
