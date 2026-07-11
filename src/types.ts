export interface Student {
  id: string;
  matricNumber: string;
  name: string;
  email: string;
  password?: string;
  department: string;
  level: number; // 100, 200, 300, 400
  avatar?: string;
  registrationStatus: 'Not Registered' | 'Pending Approval' | 'Approved';
  registeredCourses: string[]; // Course codes for current semester
  currentSemester: string; // e.g. "2025/2026 - First Semester"
}

export interface Course {
  code: string;
  title: string;
  creditUnits: number;
  department: string;
  level: number; // 100, 200, 300, 400
  semester: 1 | 2; // 1st or 2nd semester
  type: 'Core' | 'Elective';
  description?: string;
}

export interface GradeRecord {
  studentId: string;
  courseCode: string;
  semesterId: string; // e.g., "2025/2026-1"
  caScore: number; // Continuous Assessment, max 40
  examScore: number; // Exam, max 60
  totalScore: number; // caScore + examScore
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'N/A';
  gradePoint: number; // A=5, B=4, C=3, D=2, E=1, F=0
  approved: boolean;
}

export interface SemesterInfo {
  id: string;
  name: string;
  isActive: boolean;
}

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  message: string;
  submittedAt: string;
  status: 'Open' | 'Resolved';
  reply?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Urgent' | 'General' | 'Academic';
}
