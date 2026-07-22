interface IllustrationProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export function OpenBookIllustration({ className = 'w-64 h-64', opacity = 0.05, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M100 50 C80 30, 40 30, 20 40 L20 150 C40 140, 80 140, 100 160 C120 140, 160 140, 180 150 L180 40 C160 30, 120 30, 100 50 Z" />
      <path d="M100 50 L100 160" />
      <path d="M35 65 C55 58, 80 60, 90 68" />
      <path d="M35 90 C55 83, 80 85, 90 93" />
      <path d="M35 115 C55 108, 80 110, 90 118" />
      <path d="M165 65 C145 58, 120 60, 110 68" />
      <path d="M165 90 C145 83, 120 85, 110 93" />
      <path d="M165 115 C145 108, 120 110, 110 118" />
    </svg>
  );
}

export function AtomIllustration({ className = 'w-64 h-64', opacity = 0.05, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
      <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(0 100 100)" />
      <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(60 100 100)" />
      <ellipse cx="100" cy="100" rx="80" ry="30" transform="rotate(120 100 100)" />
      <circle cx="100" cy="100" r="10" fill={color} />
      <circle cx="170" cy="100" r="4" fill={color} />
      <circle cx="65" cy="40" r="4" fill={color} />
      <circle cx="65" cy="160" r="4" fill={color} />
    </svg>
  );
}

export function CampusBuildingIllustration({ className = 'w-64 h-64', opacity = 0.05, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Clocktower / Main Building */}
      <rect x="70" y="60" width="60" height="110" rx="2" />
      <path d="M70 60 L100 25 L130 60" />
      <circle cx="100" cy="80" r="12" />
      <path d="M100 74 L100 80 L104 80" />
      {/* Side wings */}
      <rect x="20" y="90" width="50" height="80" rx="2" />
      <rect x="130" y="90" width="50" height="80" rx="2" />
      {/* Windows */}
      <rect x="32" y="105" width="10" height="14" rx="1" />
      <rect x="50" y="105" width="10" height="14" rx="1" />
      <rect x="32" y="130" width="10" height="14" rx="1" />
      <rect x="50" y="130" width="10" height="14" rx="1" />
      <rect x="140" y="105" width="10" height="14" rx="1" />
      <rect x="158" y="105" width="10" height="14" rx="1" />
      <rect x="140" y="130" width="10" height="14" rx="1" />
      <rect x="158" y="130" width="10" height="14" rx="1" />
      {/* Entrance Door */}
      <path d="M90 170 V135 A10 10 0 0 1 110 135 V170 Z" />
    </svg>
  );
}

export function GraduationCapIllustration({ className = 'w-64 h-64', opacity = 0.05, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M100 40 L180 80 L100 120 L20 80 Z" />
      <path d="M50 96 V135 C50 155, 150 155, 150 135 V96" />
      <path d="M165 90 V145 C165 155, 160 160, 165 165" />
      <circle cx="165" cy="165" r="4" fill={color} />
      <polygon points="100,10 105,25 120,25 108,34 112,48 100,39 88,48 92,34 80,25 95,25" transform="scale(0.5) translate(100, -30)" fill={color} />
    </svg>
  );
}

export function MentorPeopleIllustration({ className = 'w-64 h-64', opacity = 0.05, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* Mentor */}
      <circle cx="100" cy="60" r="22" />
      <path d="M60 145 C60 115, 80 100, 100 100 C120 100, 140 115, 140 145" />
      {/* Students */}
      <circle cx="50" cy="85" r="15" />
      <path d="M22 150 C22 128, 38 118, 50 118 C58 118, 66 122, 72 130" />
      <circle cx="150" cy="85" r="15" />
      <path d="M128 130 C134 122, 142 118, 150 118 C162 118, 178 128, 178 150" />
      <path d="M100 20 L100 30" />
      <path d="M130 30 L123 37" />
    </svg>
  );
}

export function ConnectingJourneyLine({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-full overflow-visible pointer-events-none ${className}`} viewBox="0 0 1000 100" fill="none" aria-hidden="true">
      <path
        d="M 50 50 Q 250 10, 500 50 T 950 50"
        stroke="#2f7774"
        strokeWidth="2.5"
        strokeDasharray="8 8"
        strokeOpacity="0.25"
      />
      {/* Decorative Stop Nodes */}
      <g transform="translate(100, 42)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#f5841f" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#f5841f" />
      </g>
      <g transform="translate(370, 38)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#2f7774" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#2f7774" />
      </g>
      <g transform="translate(630, 52)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#2374ff" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#2374ff" />
      </g>
      <g transform="translate(900, 50)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#ff3f78" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#ff3f78" />
      </g>
    </svg>
  );
}

export function SchoolVerseOrbitMap({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg className="w-full max-w-2xl h-auto opacity-15" viewBox="0 0 600 300" fill="none" stroke="#102f2d" strokeWidth="1.5" aria-hidden="true">
        {/* Outer Orbit Rings */}
        <ellipse cx="300" cy="150" rx="260" ry="110" strokeDasharray="6 6" />
        <ellipse cx="300" cy="150" rx="180" ry="75" strokeDasharray="4 4" />

        {/* Central Hub Lines */}
        <line x1="300" y1="40" x2="300" y2="260" strokeDasharray="4 4" />
        <line x1="40" y1="150" x2="560" y2="150" strokeDasharray="4 4" />

        {/* Constellation Nodes */}
        <circle cx="300" cy="150" r="8" fill="#f5841f" />
        <circle cx="300" cy="40" r="6" fill="#2f7774" />
        <circle cx="560" cy="150" r="6" fill="#2374ff" />
        <circle cx="300" cy="260" r="6" fill="#ff3f78" />
        <circle cx="40" cy="150" r="6" fill="#f5841f" />

        {/* Labels on Map */}
        <text x="300" y="25" textAnchor="middle" fill="#102f2d" fontSize="12" fontWeight="700" letterSpacing="2">ACADEMICS</text>
        <text x="560" y="175" textAnchor="middle" fill="#102f2d" fontSize="12" fontWeight="700" letterSpacing="2">CREATIVITY</text>
        <text x="300" y="280" textAnchor="middle" fill="#102f2d" fontSize="12" fontWeight="700" letterSpacing="2">COMMUNITY</text>
        <text x="40" y="175" textAnchor="middle" fill="#102f2d" fontSize="12" fontWeight="700" letterSpacing="2">CHARACTER</text>
      </svg>
    </div>
  );
}
