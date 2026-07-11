import { Course, Student, GradeRecord } from '../types';

export const DEFAULT_COURSES: Course[] = [
  // 100 Level, Semester 1
  { code: 'CSC 101', title: 'Introduction to Computer Science', creditUnits: 3, department: 'Computer Science', level: 100, semester: 1, type: 'Core', description: 'Overview of computer hardware, software, history, algorithms, and binary arithmetic.' },
  { code: 'MTH 101', title: 'Calculus I', creditUnits: 4, department: 'Computer Science', level: 100, semester: 1, type: 'Core', description: 'Functions, limits, differentiation, integration, and applications of calculus.' },
  { code: 'PHY 101', title: 'General Mechanics & Properties of Matter', creditUnits: 3, department: 'Computer Science', level: 100, semester: 1, type: 'Core', description: 'Vectors, kinematics, Newton laws of motion, gravitation, fluid mechanics.' },
  { code: 'GST 101', title: 'Communication in English I', creditUnits: 2, department: 'Computer Science', level: 100, semester: 1, type: 'Core', description: 'Essential skills in reading, writing, comprehension, and oral English.' },
  { code: 'CHM 101', title: 'General Chemistry I', creditUnits: 3, department: 'Computer Science', level: 100, semester: 1, type: 'Elective', description: 'Atomic structure, chemical bonding, periodic table, chemical kinetics.' },

  // 100 Level, Semester 2
  { code: 'CSC 102', title: 'Introduction to Programming (Python)', creditUnits: 3, department: 'Computer Science', level: 100, semester: 2, type: 'Core', description: 'Basic syntax, control flow, loops, lists, functions, and debugging.' },
  { code: 'MTH 102', title: 'Linear Algebra I', creditUnits: 3, department: 'Computer Science', level: 100, semester: 2, type: 'Core', description: 'Matrices, determinants, systems of linear equations, and vector spaces.' },
  { code: 'PHY 102', title: 'Electromagnetism & Waves', creditUnits: 3, department: 'Computer Science', level: 100, semester: 2, type: 'Core', description: 'Electric field, Gauss law, electric potential, capacitance, Ohm law, waves.' },
  { code: 'GST 102', title: 'Philosophy and Logic', creditUnits: 2, department: 'Computer Science', level: 100, semester: 2, type: 'Core', description: 'Logic arguments, fallacies, history of science, scientific method.' },
  { code: 'CSC 104', title: 'Computers and Society', creditUnits: 2, department: 'Computer Science', level: 100, semester: 2, type: 'Elective', description: 'Impact of computing on daily life, ethical frameworks, privacy, and security.' },

  // 200 Level, Semester 1
  { code: 'CSC 201', title: 'Data Structures and Algorithms', creditUnits: 4, department: 'Computer Science', level: 200, semester: 1, type: 'Core', description: 'Arrays, linked lists, stacks, queues, trees, searching, sorting, and complexity analysis.' },
  { code: 'CSC 203', title: 'Object Oriented Programming (Java)', creditUnits: 3, department: 'Computer Science', level: 200, semester: 1, type: 'Core', description: 'Classes, objects, inheritance, polymorphism, encapsulation, exception handling.' },
  { code: 'MTH 201', title: 'Mathematical Methods I', creditUnits: 3, department: 'Computer Science', level: 200, semester: 1, type: 'Core', description: 'Ordinary differential equations, Fourier series, partial derivatives.' },
  { code: 'CSC 205', title: 'Discrete Structures', creditUnits: 3, department: 'Computer Science', level: 200, semester: 1, type: 'Core', description: 'Set theory, graphs, combinatorics, Boolean algebra, mathematical induction.' },
  { code: 'GST 201', title: 'Peace Studies and Conflict Resolution', creditUnits: 2, department: 'Computer Science', level: 200, semester: 1, type: 'Elective', description: 'Conflict sources, resolution frameworks, peace building and dialogue.' },

  // 200 Level, Semester 2
  { code: 'CSC 202', title: 'Database Systems I', creditUnits: 3, department: 'Computer Science', level: 200, semester: 2, type: 'Core', description: 'Relational database model, SQL queries, ER diagrams, normal forms.' },
  { code: 'CSC 204', title: 'Computer Architecture & Assembly Language', creditUnits: 3, department: 'Computer Science', level: 200, semester: 2, type: 'Core', description: 'Logic gates, CPU, registers, memory organization, assembly programming.' },
  { code: 'CSC 206', title: 'Operating Systems I', creditUnits: 3, department: 'Computer Science', level: 200, semester: 2, type: 'Core', description: 'Processes, threads, CPU scheduling, synchronization, deadlocks, memory management.' },
  { code: 'STA 202', title: 'Statistics for Physical Sciences', creditUnits: 3, department: 'Computer Science', level: 200, semester: 2, type: 'Core', description: 'Probability theory, normal distribution, hypothesis testing, correlation and regression.' },
  { code: 'CSC 208', title: 'Web Technologies', creditUnits: 3, department: 'Computer Science', level: 200, semester: 2, type: 'Elective', description: 'HTML, CSS, JavaScript, responsive UI, client-side web applications.' },

  // 300 Level, Semester 1
  { code: 'CSC 301', title: 'Systems Programming (C/C++)', creditUnits: 3, department: 'Computer Science', level: 300, semester: 1, type: 'Core', description: 'Pointers, dynamic memory management, file I/O, system calls, multi-processing.' },
  { code: 'CSC 303', title: 'Software Engineering I', creditUnits: 3, department: 'Computer Science', level: 300, semester: 1, type: 'Core', description: 'Software lifecycles, requirement analysis, UML, agile development, testing.' },
  { code: 'CSC 305', title: 'Database Systems II', creditUnits: 3, department: 'Computer Science', level: 300, semester: 1, type: 'Core', description: 'Transaction management, indexing, query optimization, NoSQL databases.' },
  { code: 'CSC 307', title: 'Compiler Construction I', creditUnits: 3, department: 'Computer Science', level: 300, semester: 1, type: 'Core', description: 'Lexical analysis, syntax analysis, parsing techniques, symbol tables.' },
  { code: 'CSC 311', title: 'Formal Languages and Automata Theory', creditUnits: 3, department: 'Computer Science', level: 300, semester: 1, type: 'Core', description: 'Finite automata, regular expressions, context-free grammars, Turing machines.' },
  { code: 'CSC 313', title: 'Entrepreneurship in Tech', creditUnits: 2, department: 'Computer Science', level: 300, semester: 1, type: 'Elective', description: 'Tech startups, business planning, intellectual property, fundraising.' },

  // 300 Level, Semester 2
  { code: 'CSC 302', title: 'Computer Networks I', creditUnits: 3, department: 'Computer Science', level: 300, semester: 2, type: 'Core', description: 'OSI layers, TCP/IP, IP routing, subnetting, network protocols.' },
  { code: 'CSC 304', title: 'Human Computer Interaction', creditUnits: 3, department: 'Computer Science', level: 300, semester: 2, type: 'Core', description: 'Usability principles, user-centered design, prototyping, accessibility standards.' },
  { code: 'CSC 306', title: 'Research Methodology', creditUnits: 2, department: 'Computer Science', level: 300, semester: 2, type: 'Core', description: 'Literature review, research design, data collection, thesis writing standards.' },
  { code: 'CSC 308', title: 'Operating Systems II', creditUnits: 3, department: 'Computer Science', level: 300, semester: 2, type: 'Elective', description: 'Distributed OS, virtualization, storage arrays, file system design.' },
  { code: 'CSC 310', title: 'Cryptography and Information Security', creditUnits: 3, department: 'Computer Science', level: 300, semester: 2, type: 'Elective', description: 'Symmetric/asymmetric encryption, hashing, digital signatures, firewall concepts.' }
];

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 'STU001',
    matricNumber: 'APX/CSC/2023/1042',
    name: 'Emeka Obi',
    email: 'emeka.obi@apex.edu.ng',
    password: '1234',
    department: 'Computer Science',
    level: 300,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    registrationStatus: 'Approved',
    registeredCourses: ['CSC 301', 'CSC 303', 'CSC 305', 'CSC 307', 'CSC 311'],
    currentSemester: '2025/2026 - First Semester'
  },
  {
    id: 'STU002',
    matricNumber: 'APX/CSC/2024/2015',
    name: 'Amina Bello',
    email: 'amina.bello@apex.edu.ng',
    password: '1234',
    department: 'Computer Science',
    level: 200,
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120',
    registrationStatus: 'Not Registered',
    registeredCourses: [],
    currentSemester: '2025/2026 - First Semester'
  },
  {
    id: 'STU003',
    matricNumber: 'APX/CSC/2025/3089',
    name: 'Tunde Bakare',
    email: 'tunde.bakare@apex.edu.ng',
    password: '1234',
    department: 'Computer Science',
    level: 100,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    registrationStatus: 'Approved',
    registeredCourses: ['CSC 101', 'MTH 101', 'PHY 101', 'GST 101'],
    currentSemester: '2025/2026 - First Semester'
  }
];

// Seed Historical Results to calculate robust GPA
export const DEFAULT_GRADES: GradeRecord[] = [
  // Emeka Obi (STU001) - 100 Level Semester 1 (All Approved & Graded)
  { studentId: 'STU001', courseCode: 'CSC 101', semesterId: '100-1', caScore: 28, examScore: 54, totalScore: 82, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'MTH 101', semesterId: '100-1', caScore: 24, examScore: 48, totalScore: 72, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'PHY 101', semesterId: '100-1', caScore: 22, examScore: 43, totalScore: 65, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'GST 101', semesterId: '100-1', caScore: 27, examScore: 51, totalScore: 78, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CHM 101', semesterId: '100-1', caScore: 18, examScore: 36, totalScore: 54, grade: 'C', gradePoint: 3, approved: true },

  // Emeka Obi (STU001) - 100 Level Semester 2
  { studentId: 'STU001', courseCode: 'CSC 102', semesterId: '100-2', caScore: 29, examScore: 56, totalScore: 85, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'MTH 102', semesterId: '100-2', caScore: 20, examScore: 38, totalScore: 58, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU001', courseCode: 'PHY 102', semesterId: '100-2', caScore: 25, examScore: 41, totalScore: 66, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'GST 102', semesterId: '100-2', caScore: 26, examScore: 48, totalScore: 74, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 104', semesterId: '100-2', caScore: 22, examScore: 40, totalScore: 62, grade: 'B', gradePoint: 4, approved: true },

  // Emeka Obi (STU001) - 200 Level Semester 1
  { studentId: 'STU001', courseCode: 'CSC 201', semesterId: '200-1', caScore: 27, examScore: 55, totalScore: 82, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 203', semesterId: '200-1', caScore: 24, examScore: 44, totalScore: 68, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'MTH 201', semesterId: '200-1', caScore: 21, examScore: 35, totalScore: 56, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 205', semesterId: '200-1', caScore: 28, examScore: 48, totalScore: 76, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'GST 201', semesterId: '200-1', caScore: 25, examScore: 45, totalScore: 70, grade: 'A', gradePoint: 5, approved: true },

  // Emeka Obi (STU001) - 200 Level Semester 2
  { studentId: 'STU001', courseCode: 'CSC 202', semesterId: '200-2', caScore: 26, examScore: 47, totalScore: 73, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 204', semesterId: '200-2', caScore: 25, examScore: 43, totalScore: 68, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 206', semesterId: '200-2', caScore: 24, examScore: 40, totalScore: 64, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'STA 202', semesterId: '200-2', caScore: 19, examScore: 33, totalScore: 52, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 208', semesterId: '200-2', caScore: 28, examScore: 49, totalScore: 77, grade: 'A', gradePoint: 5, approved: true },

  // Emeka Obi (STU001) - 300 Level Semester 1 (Current, some graded, some unapproved to show user can confirm)
  { studentId: 'STU001', courseCode: 'CSC 301', semesterId: '300-1', caScore: 26, examScore: 48, totalScore: 74, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 303', semesterId: '300-1', caScore: 25, examScore: 45, totalScore: 70, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 305', semesterId: '300-1', caScore: 22, examScore: 40, totalScore: 62, grade: 'B', gradePoint: 4, approved: false }, // Unapproved!
  { studentId: 'STU001', courseCode: 'CSC 307', semesterId: '300-1', caScore: 24, examScore: 38, totalScore: 62, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU001', courseCode: 'CSC 311', semesterId: '300-1', caScore: 19, examScore: 32, totalScore: 51, grade: 'C', gradePoint: 3, approved: true },

  // Amina Bello (STU002) - 100 Level Semester 1 Completed
  { studentId: 'STU002', courseCode: 'CSC 101', semesterId: '100-1', caScore: 24, examScore: 42, totalScore: 66, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU002', courseCode: 'MTH 101', semesterId: '100-1', caScore: 18, examScore: 34, totalScore: 52, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU002', courseCode: 'PHY 101', semesterId: '100-1', caScore: 20, examScore: 38, totalScore: 58, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU002', courseCode: 'GST 101', semesterId: '100-1', caScore: 25, examScore: 48, totalScore: 73, grade: 'A', gradePoint: 5, approved: true },

  // Amina Bello (STU002) - 100 Level Semester 2 Completed
  { studentId: 'STU002', courseCode: 'CSC 102', semesterId: '100-2', caScore: 27, examScore: 45, totalScore: 72, grade: 'A', gradePoint: 5, approved: true },
  { studentId: 'STU002', courseCode: 'MTH 102', semesterId: '100-2', caScore: 21, examScore: 40, totalScore: 61, grade: 'B', gradePoint: 4, approved: true },
  { studentId: 'STU002', courseCode: 'PHY 102', semesterId: '100-2', caScore: 22, examScore: 33, totalScore: 55, grade: 'C', gradePoint: 3, approved: true },
  { studentId: 'STU002', courseCode: 'GST 102', semesterId: '100-2', caScore: 24, examScore: 44, totalScore: 68, grade: 'B', gradePoint: 4, approved: true },

  // David Vance (STU003) - 100 Level Semester 1 - registered, but exams just written.
  // Admin can fill this in, showing real-time feedback
  { studentId: 'STU003', courseCode: 'CSC 101', semesterId: '100-1', caScore: 25, examScore: 0, totalScore: 25, grade: 'N/A', gradePoint: 0, approved: false },
  { studentId: 'STU003', courseCode: 'MTH 101', semesterId: '100-1', caScore: 22, examScore: 0, totalScore: 22, grade: 'N/A', gradePoint: 0, approved: false },
  { studentId: 'STU003', courseCode: 'PHY 101', semesterId: '100-1', caScore: 20, examScore: 0, totalScore: 20, grade: 'N/A', gradePoint: 0, approved: false },
  { studentId: 'STU003', courseCode: 'GST 101', semesterId: '100-1', caScore: 26, examScore: 0, totalScore: 26, grade: 'N/A', gradePoint: 0, approved: false }
];

export const calculateGrade = (total: number): { grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F', gp: number } => {
  if (total >= 70) return { grade: 'A', gp: 5 };
  if (total >= 60) return { grade: 'B', gp: 4 };
  if (total >= 50) return { grade: 'C', gp: 3 };
  if (total >= 45) return { grade: 'D', gp: 2 };
  if (total >= 40) return { grade: 'E', gp: 1 };
  return { grade: 'F', gp: 0 };
};

export const DEFAULT_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'First Semester Course Registration Extension',
    content: 'The Senate has approved the extension of course registration for the Fall Semester of the 2025/2026 academic year. All students are advised to complete their registration and submit their slips before the new deadline.',
    date: '2026-07-10',
    category: 'Urgent' as const
  },
  {
    id: 'ann-2',
    title: 'Release of 2024/2025 Session Audit Records',
    content: 'In line with our commitment to academic transparency, the grade ledgers for all departments have been audited and signed. Students can view their audited results in the Result Confirmation tab of the portal.',
    date: '2026-07-05',
    category: 'Academic' as const
  },
  {
    id: 'ann-3',
    title: 'Upgrade of E-Portal Security Architecture',
    content: 'We have updated the portal backend to implement client-verifiable grade integrity checks. Student result statements are now cryptographically verified via local hashes to prevent manual manipulation.',
    date: '2026-06-28',
    category: 'General' as const
  }
];

export const DEFAULT_TICKETS = [
  {
    id: 'tkt-1',
    name: 'Korede Benson',
    email: 'korede.benson@student.apex.edu',
    category: 'Result Discrepancy',
    message: 'Good day, I noticed my grade for MTH 201 is displaying as a C, but my exam score and CA should accumulate to a B. Please assist in auditing this grade record.',
    submittedAt: '2026-07-10 14:32',
    status: 'Open' as const
  },
  {
    id: 'tkt-2',
    name: 'Sarah Connor',
    email: 's.connor@gmail.com',
    category: 'Inquiry',
    message: 'Hello, I am a prospective student applying for Computer Science. I would like to know the credit unit requirements for the first year. Thanks!',
    submittedAt: '2026-07-09 09:15',
    status: 'Resolved' as const,
    reply: 'Hello Sarah! First-year computer science students are required to register a minimum of 15 credits and a maximum of 24 credits per semester. You can check the course catalog tab for detailed modules.'
  }
];
