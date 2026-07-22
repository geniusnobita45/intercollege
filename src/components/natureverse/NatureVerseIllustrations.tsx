interface IllustrationProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export function GrowthEcosystemMap({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg className="h-auto w-full max-w-3xl opacity-75" viewBox="0 0 760 360" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="natureBranch" x1="120" y1="310" x2="650" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#866d4f" />
            <stop offset="0.45" stopColor="#397e52" />
            <stop offset="1" stopColor="#8fbd65" />
          </linearGradient>
          <radialGradient id="natureSun" cx="0" cy="0" r="1" gradientTransform="translate(116 72) rotate(45) scale(68)">
            <stop stopColor="#ffe5a0" />
            <stop offset="1" stopColor="#ffc963" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="116" cy="72" r="68" fill="url(#natureSun)" />
        <circle cx="116" cy="72" r="22" fill="#f4ad4f" fillOpacity="0.44" />

        <path d="M380 302 C369 248 374 209 380 172 C384 143 380 110 364 79" stroke="url(#natureBranch)" strokeWidth="10" strokeLinecap="round" />
        <path d="M378 181 C323 143 276 116 207 102" stroke="#4f8d58" strokeWidth="5" strokeLinecap="round" />
        <path d="M380 168 C443 128 500 105 577 98" stroke="#4f8d58" strokeWidth="5" strokeLinecap="round" />
        <path d="M376 218 C313 202 259 207 191 236" stroke="#397e52" strokeWidth="4" strokeLinecap="round" />
        <path d="M383 213 C450 194 516 201 588 235" stroke="#397e52" strokeWidth="4" strokeLinecap="round" />

        <path d="M380 301 C351 320 330 333 306 350 M380 301 C403 323 425 336 451 351 M380 301 C376 327 376 340 374 356" stroke="#866d4f" strokeWidth="4" strokeLinecap="round" />

        {[
          [207,102,'#f2a34d'], [577,98,'#69a65a'], [191,236,'#8a7152'], [588,235,'#dc735f'],
          [298,129,'#75ad5b'], [473,122,'#f3b253'], [272,211,'#67a057'], [505,209,'#8fbd65']
        ].map(([cx, cy, fill], index) => (
          <g key={index}>
            <circle cx={Number(cx)} cy={Number(cy)} r="19" fill="white" fillOpacity="0.9" stroke={String(fill)} strokeWidth="2" />
            <circle cx={Number(cx)} cy={Number(cy)} r="7" fill={String(fill)} />
          </g>
        ))}

        <path d="M329 73 C303 31 245 30 230 69 C274 89 310 89 329 73Z" fill="#79ad61" fillOpacity="0.55" />
        <path d="M397 74 C423 32 481 31 496 70 C452 90 416 90 397 74Z" fill="#65a451" fillOpacity="0.55" />
        <path d="M341 106 C305 84 265 95 259 128 C295 139 326 132 341 106Z" fill="#a4ca76" fillOpacity="0.5" />
        <path d="M420 106 C456 84 496 95 502 128 C466 139 435 132 420 106Z" fill="#91bd68" fillOpacity="0.5" />

        <text x="207" y="139" textAnchor="middle" fill="#214f36" fontSize="13" fontWeight="800" letterSpacing="1.5">KNOWLEDGE</text>
        <text x="577" y="135" textAnchor="middle" fill="#214f36" fontSize="13" fontWeight="800" letterSpacing="1.5">CHARACTER</text>
        <text x="191" y="276" textAnchor="middle" fill="#214f36" fontSize="13" fontWeight="800" letterSpacing="1.5">CONFIDENCE</text>
        <text x="588" y="275" textAnchor="middle" fill="#214f36" fontSize="13" fontWeight="800" letterSpacing="1.5">COMMUNITY</text>
        <text x="380" y="156" textAnchor="middle" fill="#153d2c" fontSize="15" fontWeight="900" letterSpacing="1">STUDENT GROWTH</text>
      </svg>
    </div>
  );
}

export function LeafCanopyIllustration({ className = 'w-64 h-64', opacity = 0.06, color = 'currentColor' }: IllustrationProps) {
  return (
    <svg className={className} style={{ opacity }} viewBox="0 0 220 220" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M110 194 C103 151 105 112 111 70" />
      <path d="M109 118 C77 100 51 77 34 45 C71 43 99 64 111 92" />
      <path d="M111 95 C137 67 166 52 193 53 C186 83 157 108 111 126" />
      <path d="M108 145 C82 133 63 118 48 96 C75 94 98 106 109 127" />
      <path d="M111 148 C137 129 157 122 178 126 C166 151 144 163 111 169" />
      <path d="M110 194 C91 207 78 211 63 216 M110 194 C126 207 142 214 159 218" />
      <circle cx="111" cy="66" r="8" fill={color} />
    </svg>
  );
}
