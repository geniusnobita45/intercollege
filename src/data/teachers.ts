export type TeacherProfile = {
  slug: string;
  name: string;
  role: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: string;
  summary: string;
  philosophy: string;
  expertise: string[];
  achievements: string[];
  initials: string;
  accent: 'orange' | 'teal' | 'blue' | 'rose' | 'violet' | 'amber';
  image?: string;
  verified: boolean;
};

/**
 * These subject-based entries are intentionally placeholders because the public
 * HLS website does not expose a reliable faculty directory. Replace the names,
 * qualifications, experience and photos with college-verified details before launch.
 */
export const teachers: TeacherProfile[] = [
  {
    slug: 'mathematics-faculty',
    name: 'Mathematics Faculty',
    role: 'Senior Teacher',
    department: 'Mathematics',
    subjects: ['Mathematics', 'Problem Solving'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for a senior mathematics educator who helps students build clear concepts, accuracy and confidence.',
    philosophy: 'Strong fundamentals, regular practice and patient explanation help every learner improve step by step.',
    expertise: ['Concept building', 'Board examination preparation', 'Doubt resolution', 'Practice planning'],
    achievements: ['Add verified teacher achievements', 'Add student result highlights', 'Add awards or training details'],
    initials: 'MF',
    accent: 'orange',
    verified: false,
  },
  {
    slug: 'science-faculty',
    name: 'Science Faculty',
    role: 'Senior Teacher',
    department: 'Science',
    subjects: ['Physics', 'Chemistry', 'Biology'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for a science educator who connects classroom concepts with observation, experimentation and everyday life.',
    philosophy: 'Science becomes memorable when students understand why a concept works instead of only learning an answer.',
    expertise: ['Scientific reasoning', 'Practical demonstrations', 'Exam preparation', 'Student mentoring'],
    achievements: ['Add verified teacher achievements', 'Add laboratory or project highlights', 'Add awards or training details'],
    initials: 'SF',
    accent: 'teal',
    verified: false,
  },
  {
    slug: 'english-faculty',
    name: 'English Faculty',
    role: 'Senior Teacher',
    department: 'Languages',
    subjects: ['English', 'Communication Skills'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for an English educator focused on comprehension, grammar, expression and confident communication.',
    philosophy: 'Students learn language best when reading, writing, speaking and listening are practised together.',
    expertise: ['Grammar and writing', 'Reading comprehension', 'Spoken communication', 'Creative expression'],
    achievements: ['Add verified teacher achievements', 'Add competition or result highlights', 'Add awards or training details'],
    initials: 'EF',
    accent: 'blue',
    verified: false,
  },
  {
    slug: 'social-science-faculty',
    name: 'Social Science Faculty',
    role: 'Senior Teacher',
    department: 'Social Science',
    subjects: ['History', 'Civics', 'Geography'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for an educator who helps students understand society, history, citizenship and the world around them.',
    philosophy: 'Meaningful discussion and real-world connections make social science relevant, responsible and engaging.',
    expertise: ['Historical understanding', 'Map-based learning', 'Civic awareness', 'Answer writing'],
    achievements: ['Add verified teacher achievements', 'Add project or quiz highlights', 'Add awards or training details'],
    initials: 'SS',
    accent: 'rose',
    verified: false,
  },
  {
    slug: 'commerce-faculty',
    name: 'Commerce Faculty',
    role: 'Senior Teacher',
    department: 'Commerce',
    subjects: ['Commerce', 'Business Studies', 'Accountancy'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for a commerce educator who develops practical understanding of accounts, business and responsible decision-making.',
    philosophy: 'Commerce is easier to understand when every principle is connected with a familiar real-life example.',
    expertise: ['Accountancy foundations', 'Business concepts', 'Case-based learning', 'Exam preparation'],
    achievements: ['Add verified teacher achievements', 'Add student result highlights', 'Add awards or training details'],
    initials: 'CF',
    accent: 'violet',
    verified: false,
  },
  {
    slug: 'computer-faculty',
    name: 'Computer Faculty',
    role: 'Senior Teacher',
    department: 'Computer Education',
    subjects: ['Computer Science', 'Information Technology'],
    qualification: 'College-verified qualification to be added',
    experience: 'Experience details to be added',
    summary: 'A featured profile space for a computer educator who supports digital confidence, logical thinking and responsible technology use.',
    philosophy: 'Students become digitally capable when they learn by doing, experimenting and solving practical problems.',
    expertise: ['Computer fundamentals', 'Digital literacy', 'Logical thinking', 'Project guidance'],
    achievements: ['Add verified teacher achievements', 'Add student project highlights', 'Add awards or training details'],
    initials: 'IT',
    accent: 'amber',
    verified: false,
  },
  {
    slug: 'administration-desk',
    name: 'Administration Office',
    role: 'College Administration',
    department: 'Administration',
    subjects: ['Admissions', 'Student Records', 'Campus Desk'],
    qualification: 'College Administration',
    experience: 'Daily Office Hours: 8 AM - 3 PM',
    summary: 'The administrative team handles admissions, fee records, TC verification, certificate issuance and parent communications.',
    philosophy: 'Efficient, accessible, and supportive administrative services for students, parents, and faculty.',
    expertise: ['Admission verification', 'Student documentation', 'Parent assistance', 'Official correspondence'],
    achievements: ['Streamlined online registration process', 'Helpful parent guidance desk'],
    initials: 'AO',
    accent: 'teal',
    verified: true,
  },
];

export const teacherDepartments = ['All', ...Array.from(new Set(teachers.map((teacher) => teacher.department)))];
