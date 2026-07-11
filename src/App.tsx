import React, { useState, useEffect } from 'react';
import { Student, Course, GradeRecord, SupportTicket, Announcement } from './types';
import { 
  DEFAULT_COURSES, 
  DEFAULT_STUDENTS, 
  DEFAULT_GRADES,
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_TICKETS
} from './data/seed';
import StudentDashboard from './components/StudentDashboard';
import CourseRegistration from './components/CourseRegistration';
import ResultConfirmation from './components/ResultConfirmation';
import AdminPortal from './components/AdminPortal';
import PrintSlip from './components/PrintSlip';
import { 
  GraduationCap, 
  User, 
  ShieldAlert, 
  LogOut, 
  Users, 
  BookOpen, 
  Award, 
  Activity, 
  Grid,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Printer,
  FileText,
  Book,
  DollarSign,
  Calendar,
  MapPin,
  Compass,
  Search,
  Send,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Info,
  ChevronRight,
  Menu,
  X,
  Trash2,
  Heart,
  Shield,
  RefreshCw,
  Sparkles,
  PhoneCall,
  Check,
  Lock,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Load initial database records from localStorage or default to Seeds
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('apex_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('apex_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('apex_grades');
    return saved ? JSON.parse(saved) : DEFAULT_GRADES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('apex_announcements');
    return saved ? JSON.parse(saved) : DEFAULT_ANNOUNCEMENTS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('apex_tickets');
    return saved ? JSON.parse(saved) : DEFAULT_TICKETS;
  });

  const [securityLogs, setSecurityLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('apex_logs');
    if (saved) return JSON.parse(saved);
    return [
      `[${new Date().toLocaleString()}] Core security ledger initialized. Integrity active.`,
      `[${new Date().toLocaleString()}] Loaded ${DEFAULT_STUDENTS.length} student files with dynamic SHA-256 signatures.`,
      `[${new Date().toLocaleString()}] Synchronized course catalog database with active registrar syllabus.`
    ];
  });

  const [invoicePayments, setInvoicePayments] = useState<{[studentId: string]: {status: 'Paid' | 'Pending', refId?: string}}>(() => {
    const saved = localStorage.getItem('apex_payments');
    return saved ? JSON.parse(saved) : {
      'STU001': { status: 'Paid', refId: 'TXN-9021-APEX-88' },
      'STU002': { status: 'Pending' },
      'STU003': { status: 'Paid', refId: 'TXN-4029-APEX-51' },
    };
  });

  // Authentication & navigation states
  const [currentUserType, setCurrentUserType] = useState<'student' | 'admin' | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('STU001');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Credentials-based Authentication states
  const [typedEmail, setTypedEmail] = useState('');
  const [typedPassword, setTypedPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginTab, setLoginTab] = useState<'signin' | 'register' | 'selector'>('signin');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regLevel, setRegLevel] = useState<number>(100);
  const [regDept, setRegDept] = useState('Computer Science');
  const [regGender, setRegGender] = useState<'male' | 'female'>('male');
  const [regSuccess, setRegSuccess] = useState('');

  // Tab systems
  const [publicActiveTab, setPublicActiveTab] = useState<'home' | 'about' | 'calendar' | 'catalog' | 'departments' | 'tuition' | 'faqs' | 'contact' | 'login'>('home');
  const [activeStudentTab, setActiveStudentTab] = useState<string>('dashboard');

  // Persistent Statement/Result digital sign-offs
  const [confirmedResults, setConfirmedResults] = useState<{[key: string]: {confirmedAt: string, signedName: string}}>(() => {
    const saved = localStorage.getItem('apex_confirmed_results');
    return saved ? JSON.parse(saved) : {};
  });

  // Contact page form states
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Toast notifications state
  interface ToastNotification {
    id: string;
    type: 'success' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: string;
  }
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newNotif: ToastNotification = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Auto-remove toast after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 6000);
  };

  // Tuition guide interactive calculator states
  const [calcLevel, setCalcLevel] = useState<number>(100);
  const [calcInternational, setCalcInternational] = useState<boolean>(false);

  // Print Slip Modal states
  const [printModalConfig, setPrintModalConfig] = useState<{
    isOpen: boolean;
    type: 'registration' | 'result';
    semesterId: string;
  } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apex_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('apex_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('apex_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('apex_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('apex_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('apex_logs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  useEffect(() => {
    localStorage.setItem('apex_payments', JSON.stringify(invoicePayments));
  }, [invoicePayments]);

  useEffect(() => {
    localStorage.setItem('apex_confirmed_results', JSON.stringify(confirmedResults));
  }, [confirmedResults]);

  const activeStudent = students.find(s => s.id === selectedStudentId);

  // Add event log helper
  const addSecurityLog = (action: string) => {
    const log = `[${new Date().toLocaleString()}] ${action}`;
    setSecurityLogs(prev => [log, ...prev]);
  };

  // Student: course registration submission
  const handleUpdateRegistration = (selectedCourseCodes: string[]) => {
    if (!activeStudent) return;
    
    const updatedStudents = students.map((s) => {
      if (s.id === activeStudent.id) {
        return {
          ...s,
          registeredCourses: selectedCourseCodes,
          registrationStatus: selectedCourseCodes.length > 0 ? 'Pending Approval' as const : 'Not Registered' as const
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    addSecurityLog(`Student ${activeStudent.name} (${activeStudent.matricNumber}) updated registry form with ${selectedCourseCodes.length} course units.`);

    // Populate pending grades
    const newGradesList = [...grades];
    selectedCourseCodes.forEach(code => {
      const exists = grades.some(g => g.studentId === activeStudent.id && g.courseCode === code);
      if (!exists) {
        newGradesList.push({
          studentId: activeStudent.id,
          courseCode: code,
          semesterId: '300-1',
          caScore: 0,
          examScore: 0,
          totalScore: 0,
          grade: 'N/A',
          gradePoint: 0,
          approved: false
        });
      }
    });

    setGrades(newGradesList);
  };

  // Admin: approve course registration
  const handleApproveRegistration = (studentId: string) => {
    const sName = students.find(s => s.id === studentId)?.name || studentId;
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          registrationStatus: 'Approved' as const
        };
      }
      return s;
    });
    setStudents(updatedStudents);
    addSecurityLog(`Administrator approved curriculum enrollment slip for student ${sName}.`);

    // Trigger toast notification
    showToast(
      'Registration Approved!',
      `Course registration slip has been approved for ${sName} (${studentId}).`,
      'success'
    );
  };

  // Admin: Add course
  const handleAddCourse = (newCourse: Course) => {
    setCourses([...courses, newCourse]);
    addSecurityLog(`New course unit added to directory: ${newCourse.code} - ${newCourse.title} (${newCourse.creditUnits} units).`);
  };

  // Admin: Delete course
  const handleDeleteCourse = (courseCode: string) => {
    setCourses(courses.filter(c => c.code !== courseCode));
    setGrades(grades.filter(g => g.courseCode !== courseCode));
    setStudents(students.map(s => ({
      ...s,
      registeredCourses: s.registeredCourses.filter(code => code !== courseCode)
    })));
    addSecurityLog(`Curriculum unit deleted from master schedule: ${courseCode}.`);
  };

  // Admin: Update grades
  const handleUpdateGrades = (updatedGrades: GradeRecord[]) => {
    // Find if any student's grades are newly approved or updated
    const newlyApproved: { studentName: string, courseCode: string, grade: string }[] = [];
    
    updatedGrades.forEach(newG => {
      const oldG = grades.find(g => g.studentId === newG.studentId && g.courseCode === newG.courseCode);
      if (newG.approved && (!oldG || !oldG.approved || oldG.totalScore !== newG.totalScore)) {
        const studentName = students.find(s => s.id === newG.studentId)?.name || newG.studentId;
        newlyApproved.push({
          studentName,
          courseCode: newG.courseCode,
          grade: newG.grade
        });
      }
    });

    setGrades(updatedGrades);
    addSecurityLog(`Published compiled grade updates and signed digital scores ledger.`);

    if (newlyApproved.length > 0) {
      if (newlyApproved.length === 1) {
        showToast(
          'New Grade Published!',
          `Administrative ledger published grade "${newlyApproved[0].grade}" for ${newlyApproved[0].studentName} in ${newlyApproved[0].courseCode}.`,
          'success'
        );
      } else {
        showToast(
          'Grades Published!',
          `Successfully published and approved ${newlyApproved.length} course grades across student profiles.`,
          'success'
        );
      }
    } else {
      showToast(
        'Grade Ledger Updated',
        'Academic grade updates successfully signed and compiled to database.',
        'info'
      );
    }
  };

  // Admin: Resolve support tickets
  const handleResolveTicket = (ticketId: string, reply: string) => {
    const updated = supportTickets.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'Resolved' as const, reply };
      }
      return t;
    });
    setSupportTickets(updated);
    addSecurityLog(`Resolved support ticket #${ticketId} with administrative reply.`);
  };

  // Admin: Delete ticket
  const handleDeleteTicket = (ticketId: string) => {
    setSupportTickets(supportTickets.filter(t => t.id !== ticketId));
    addSecurityLog(`Deleted support ticket record #${ticketId}.`);
  };

  // Admin: Add announcement
  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements([newAnn, ...announcements]);
    addSecurityLog(`New announcement posted: "${newAnn.title}" [Category: ${newAnn.category}].`);
  };

  // Admin: Delete announcement
  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    addSecurityLog(`Removed bulletin notice ID ${id}.`);
  };

  // Student: Pay invoice
  const handlePayInvoice = (studentId: string) => {
    const reference = 'TXN-' + Math.floor(Math.random() * 8999 + 1000) + '-APEX-' + Math.floor(Math.random() * 89 + 10);
    setInvoicePayments({
      ...invoicePayments,
      [studentId]: { status: 'Paid', refId: reference }
    });
    addSecurityLog(`Tuition fee paid successfully for Student Profile ID ${studentId}. Ref: ${reference}.`);
    alert(`Fee payment processed successfully!\nTransaction Reference ID: ${reference}\nOfficial fee receipt issued in invoice ledger.`);
  };

  // Public Contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: 'tkt-' + Date.now(),
      name: contactName,
      email: contactEmail,
      category: contactCategory,
      message: contactMessage,
      submittedAt: new Date().toLocaleString(),
      status: 'Open'
    };

    setSupportTickets([newTicket, ...supportTickets]);
    setContactSuccess(true);
    addSecurityLog(`Public contact form submitted by ${contactName} [Category: ${contactCategory}].`);

    // Reset inputs
    setContactName('');
    setContactEmail('');
    setContactMessage('');

    // Clear alert after 5 seconds
    setTimeout(() => {
      setContactSuccess(false);
    }, 5000);
  };

  // Reset database fallback
  const handleResetDemo = () => {
    if (window.confirm('Are you sure you want to restore the portal database to default seed data? All custom entries, tickets, and announcements will be reset.')) {
      localStorage.removeItem('apex_students');
      localStorage.removeItem('apex_courses');
      localStorage.removeItem('apex_grades');
      localStorage.removeItem('apex_announcements');
      localStorage.removeItem('apex_tickets');
      localStorage.removeItem('apex_logs');
      localStorage.removeItem('apex_payments');

      setStudents(DEFAULT_STUDENTS);
      setCourses(DEFAULT_COURSES);
      setGrades(DEFAULT_GRADES);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setSupportTickets(DEFAULT_TICKETS);
      setSecurityLogs([
        `[${new Date().toLocaleString()}] Core security ledger reset to original signed seed weights.`,
        `[${new Date().toLocaleString()}] Loaded 3 student files with default SHA-256 signatures.`
      ]);
      setInvoicePayments({
        'STU001': { status: 'Paid', refId: 'TXN-9021-APEX-88' },
        'STU002': { status: 'Pending' },
        'STU003': { status: 'Paid', refId: 'TXN-4029-APEX-51' },
      });
      alert('AcademiaFlow database successfully restored to default seed values.');
    }
  };

  // Student: confirm results
  const handleConfirmResults = (semesterId: string, signedName: string) => {
    if (!activeStudent) return;
    const key = `${activeStudent.id}_${semesterId}`;
    const newConfirmed = {
      ...confirmedResults,
      [key]: {
        confirmedAt: new Date().toLocaleString(),
        signedName: signedName.trim()
      }
    };
    setConfirmedResults(newConfirmed);
    addSecurityLog(`Student ${activeStudent.name} digitally verified and signed off on academic statement for ${semesterId}. Signature: ${signedName}.`);
  };

  // Student: auto-seed sandbox demo grades (helpful when users register fresh profiles)
  const handleSeedDemoGrades = (studentId: string, semesterId: string) => {
    const [levelStr, semStr] = semesterId.split('-');
    const level = parseInt(levelStr) || 100;
    const semesterNum = parseInt(semStr) || 1;

    const matchedCourses = courses.filter(c => c.level === level && c.semester === semesterNum);
    if (matchedCourses.length === 0) {
      showToast('No Courses Found', `Could not find courses mapped to level ${level} semester ${semesterNum}.`, 'warning');
      return;
    }

    const scoreTemplates = [
      { ca: 28, exam: 52, total: 80, grade: 'A' as const, gp: 5.0 },
      { ca: 25, exam: 45, total: 70, grade: 'A' as const, gp: 5.0 },
      { ca: 22, exam: 41, total: 63, grade: 'B' as const, gp: 4.0 },
      { ca: 20, exam: 35, total: 55, grade: 'C' as const, gp: 3.0 },
      { ca: 24, exam: 42, total: 66, grade: 'B' as const, gp: 4.0 },
    ];

    const filteredGrades = grades.filter(g => !(g.studentId === studentId && g.semesterId === semesterId));

    const seededGrades = matchedCourses.map((course, index) => {
      const template = scoreTemplates[index % scoreTemplates.length];
      return {
        studentId,
        courseCode: course.code,
        semesterId,
        caScore: template.ca,
        examScore: template.exam,
        totalScore: template.total,
        grade: template.grade,
        gradePoint: template.gp,
        approved: true
      };
    });

    setGrades([...filteredGrades, ...seededGrades]);

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          registeredCourses: Array.from(new Set([...s.registeredCourses, ...matchedCourses.map(c => c.code)])),
          registrationStatus: 'Approved' as const
        };
      }
      return s;
    }));

    addSecurityLog(`Auto-seeded and approved demo academic results statement for student ${studentId} in term ${semesterId}.`);
    showToast(
      'Demo Results Released!',
      `Successfully generated approved grade ledger for semester "${semesterId}".`,
      'success'
    );
  };

  // Credentials-based Student Login
  const handleCredentialsSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!typedEmail.trim() || !typedPassword.trim()) {
      setLoginError('Please fill in both email and password.');
      return;
    }
    const student = students.find(s => s.email.toLowerCase() === typedEmail.trim().toLowerCase());
    if (!student) {
      setLoginError('No student profile found with this email. You can register a new profile!');
      return;
    }
    if (student.password && student.password !== typedPassword) {
      setLoginError('Invalid password. Default preloaded student password is "1234".');
      return;
    }
    
    // Log in!
    setSelectedStudentId(student.id);
    setCurrentUserType('student');
    setActiveStudentTab('dashboard');
    addSecurityLog(`Logged in as Student via Credentials: ${student.name} (${student.matricNumber}).`);
    setTypedEmail('');
    setTypedPassword('');
  };

  // Credentials-based Student Registration
  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setRegSuccess('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setLoginError('Please fill in all registration fields.');
      return;
    }

    // Check if email already exists
    const emailExists = students.some(s => s.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (emailExists) {
      setLoginError('A student profile already exists with this email address.');
      return;
    }

    // Generate custom matric number: e.g. APX/CSC/2026/XXXX
    const deptPrefix = regDept === 'Computer Science' ? 'CSC' : 
                       regDept === 'Mathematics & Statistics' ? 'MTH' :
                       regDept === 'Physics & Physical Sciences' ? 'PHY' : 'GST';
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const matric = `APX/${deptPrefix}/${new Date().getFullYear()}/${randomDigits}`;
    const newStudentId = 'STU' + String(students.length + 1).padStart(3, '0');

    // Select a high-quality portrait of a Black individual depending on selection/gender
    const blackMenAvatars = [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=120'
    ];
    const blackWomenAvatars = [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=120',
      'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=120'
    ];
    
    const avatarsList = regGender === 'male' ? blackMenAvatars : blackWomenAvatars;
    const selectedAvatar = avatarsList[Math.floor(Math.random() * avatarsList.length)];

    const newStudent: Student = {
      id: newStudentId,
      matricNumber: matric,
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      department: regDept,
      level: regLevel,
      avatar: selectedAvatar,
      registrationStatus: 'Not Registered',
      registeredCourses: [],
      currentSemester: '2025/2026 - First Semester'
    };

    // Save in state
    setStudents(prev => [...prev, newStudent]);
    
    // Seed blank scores for this level 1st semester courses for them so they can register and get results!
    const availableCourses = courses.filter(c => c.level === regLevel && c.semester === 1);
    const newGradesForStudent = availableCourses.map(c => ({
      studentId: newStudentId,
      courseCode: c.code,
      semesterId: `${regLevel}-1`,
      caScore: 0,
      examScore: 0,
      totalScore: 0,
      grade: 'N/A' as const,
      gradePoint: 0,
      approved: false
    }));
    setGrades(prev => [...prev, ...newGradesForStudent]);

    addSecurityLog(`Registered brand new student profile: ${regName} (${matric}) with secure avatar and password.`);
    setRegSuccess(`Registration successful! You can now log in using email: ${regEmail}`);
    
    // Reset inputs
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    
    // Switch to signin tab
    setTimeout(() => {
      setLoginTab('signin');
      setTypedEmail(regEmail);
      setRegSuccess('');
    }, 2500);
  };

  // Admin sign in checking
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === '1234') {
      setCurrentUserType('admin');
      addSecurityLog(`Administrator logged in successfully from session terminal.`);
      setAdminError('');
    } else {
      setAdminError('Invalid administrative access password. Try "admin" or "1234".');
    }
  };

  // GPA Degree class descriptor
  const getDegreeClass = (cgpa: number): string => {
    if (cgpa >= 4.5) return 'First Class Honours';
    if (cgpa >= 3.5) return 'Second Class Honours (Upper Division)';
    if (cgpa >= 2.4) return 'Second Class Honours (Lower Division)';
    if (cgpa >= 1.5) return 'Third Class Honours';
    return 'Pass';
  };

  // GPA computation helper
  const getStudentCgpa = (studentId: string): number => {
    const approvedGrades = grades.filter(g => g.studentId === studentId && g.approved);
    let totalCredits = 0;
    let totalGPPoints = 0;
    approvedGrades.forEach(g => {
      const course = courses.find(c => c.code === g.courseCode);
      if (course) {
        totalCredits += course.creditUnits;
        totalGPPoints += g.gradePoint * course.creditUnits;
      }
    });
    return totalCredits > 0 ? totalGPPoints / totalCredits : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col antialiased font-sans">
      
      {/* If LOGGED IN: show student or admin portal dashboard layout */}
      {currentUserType ? (
        <div className="flex-1 flex flex-col md:flex-row min-h-screen">
          {/* Left Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col shrink-0 no-print">
            <div className="p-6 flex flex-col h-full justify-between gap-8">
              <div className="space-y-6">
                {/* Brand Logo and Title */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-600 text-white flex items-center justify-center rounded-xl font-extrabold shadow-sm">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold tracking-tight text-slate-900 text-sm">AcademiaFlow</h3>
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Student Portal</span>
                  </div>
                </div>

                {/* Sidebar menu depending on user type */}
                {currentUserType === 'student' && activeStudent ? (
                  <nav className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pb-2">Student Hub</div>
                    <button
                      onClick={() => setActiveStudentTab('dashboard')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'dashboard'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Grid className="h-4 w-4" /> Dashboard Overview
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('registration')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'registration'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <BookOpen className="h-4 w-4" /> Course Registration
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('results')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'results'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Award className="h-4 w-4" /> Result Confirmation
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('transcript')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'transcript'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <FileText className="h-4 w-4" /> Academic Transcript
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('invoices')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'invoices'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <DollarSign className="h-4 w-4" /> Fee Payments
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('timetable')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'timetable'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Calendar className="h-4 w-4" /> Lecture Timetable
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('elibrary')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'elibrary'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Book className="h-4 w-4" /> Digital Library
                    </button>
                    <button
                      onClick={() => setActiveStudentTab('campus')}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                        activeStudentTab === 'campus'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <MapPin className="h-4 w-4" /> Campus Venues
                    </button>
                  </nav>
                ) : (
                  <nav className="space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 pb-2">Admin Control</div>
                    <div className="px-3 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-semibold text-xs flex items-center gap-3">
                      <Shield className="h-4 w-4" /> Full System Admin
                    </div>
                  </nav>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    setCurrentUserType(null);
                    setPublicActiveTab('home');
                    addSecurityLog(`User session logged out.`);
                  }}
                  className="w-full py-2.5 bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout Session
                </button>

                <button
                  onClick={handleResetDemo}
                  className="w-full py-2 text-[10px] font-bold bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg transition-all cursor-pointer"
                >
                  Restore System Seed
                </button>
              </div>
            </div>
          </aside>

          {/* Main Dashboard Content wrapper */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header profile view */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-10 flex items-center justify-between no-print shrink-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Institution Node: <strong>APEX-LGA-02</strong></span>
                <span>&bull;</span>
                <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Integrity Verified
                </span>
              </div>

              {currentUserType === 'student' && activeStudent ? (
                <div className="flex items-center gap-4">
                  {/* Notifications Bell Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative cursor-pointer flex items-center justify-center"
                    >
                      <Bell className="h-4.5 w-4.5" />
                      {notifications.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white"></span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isNotifOpen && (
                        <>
                          {/* Backdrop to close */}
                          <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                          
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-4 space-y-3"
                          >
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Alert Center</h4>
                              {notifications.length > 0 && (
                                <button
                                  onClick={() => setNotifications([])}
                                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold"
                                >
                                  Clear All
                                </button>
                              )}
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-slate-50 pr-1">
                              {notifications.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 space-y-2">
                                  <Bell className="h-6 w-6 mx-auto stroke-[1.5] opacity-40 text-slate-350" />
                                  <p className="text-[11px]">No unread alerts in inbox.</p>
                                </div>
                              ) : (
                                notifications.map((notif, i) => (
                                  <div key={notif.id} className={`pt-2.5 first:pt-0 text-[11px] space-y-1 ${i > 0 ? 'border-t border-slate-100' : ''}`}>
                                    <div className="flex items-center justify-between">
                                      <span className="font-extrabold text-slate-800">{notif.title}</span>
                                      <span className="text-[9px] text-slate-400 font-mono">{notif.timestamp}</span>
                                    </div>
                                    <p className="text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right leading-none">
                      <p className="font-bold text-slate-800 text-xs">{activeStudent.name}</p>
                      <span className="text-[10px] font-mono text-slate-400">{activeStudent.matricNumber}</span>
                    </div>
                    {activeStudent.avatar ? (
                      <img
                        src={activeStudent.avatar}
                        alt={activeStudent.name}
                        className="w-9 h-9 object-cover rounded-xl border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {activeStudent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-slate-700 font-mono">ROOT@ADMIN-LEDGER</span>
                </div>
              )}
            </header>

            {/* Content Area */}
            <div className="p-6 md:p-10 flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {currentUserType === 'student' && activeStudent ? (
                  <motion.div
                    key={activeStudentTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeStudentTab === 'dashboard' && (
                      <StudentDashboard
                        student={activeStudent}
                        allCourses={courses}
                        grades={grades}
                        onNavigate={(tab) => setActiveStudentTab(tab)}
                        onOpenSlip={(type, semesterId) => {
                          setPrintModalConfig({ isOpen: true, type, semesterId });
                        }}
                      />
                    )}
                    {activeStudentTab === 'registration' && (
                      <CourseRegistration
                        student={activeStudent}
                        allCourses={courses}
                        onUpdateRegistration={handleUpdateRegistration}
                        onOpenSlip={(type, semesterId) => {
                          setPrintModalConfig({ isOpen: true, type, semesterId });
                        }}
                      />
                    )}
                    {activeStudentTab === 'results' && (
                      <ResultConfirmation
                        student={activeStudent}
                        allCourses={courses}
                        grades={grades}
                        onOpenSlip={(type, semesterId) => {
                          setPrintModalConfig({ isOpen: true, type, semesterId });
                        }}
                        confirmedResults={confirmedResults}
                        onConfirmResults={handleConfirmResults}
                        onSeedDemoGrades={handleSeedDemoGrades}
                      />
                    )}

                    {/* NEW TRANSCRIPT TAB */}
                    {activeStudentTab === 'transcript' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">Unofficial Cumulative Academic Transcript</h2>
                            <p className="text-xs text-slate-500">Statement of cumulative grade points earned across all academic terms.</p>
                          </div>
                          <button
                            onClick={() => window.print()}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
                          >
                            <Printer className="h-4 w-4" />
                            Print Transcript Ledger
                          </button>
                        </div>

                        {/* Student Details Panel */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Student Name</span>
                            <span className="font-bold text-slate-800">{activeStudent.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Matriculation No.</span>
                            <span className="font-mono font-bold text-slate-800">{activeStudent.matricNumber}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Department</span>
                            <span className="font-bold text-slate-800">{activeStudent.department}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Current Level</span>
                            <span className="font-bold text-slate-800">{activeStudent.level} Level</span>
                          </div>
                        </div>

                        {/* Detailed Grades Ledger */}
                        <div className="space-y-6">
                          {['100-1', '100-2', '200-1', '200-2', '300-1'].map((semId) => {
                            const semGrades = grades.filter(g => g.studentId === activeStudent.id && g.semesterId === semId && g.approved);
                            if (semGrades.length === 0) return null;

                            let semUnits = 0;
                            let semGP = 0;
                            semGrades.forEach(g => {
                              const course = courses.find(c => c.code === g.courseCode);
                              if (course) {
                                semUnits += course.creditUnits;
                                semGP += g.gradePoint * course.creditUnits;
                              }
                            });
                            const semGpa = semUnits > 0 ? semGP / semUnits : 0;

                            return (
                              <div key={semId} className="border border-slate-150 rounded-xl overflow-hidden">
                                <div className="bg-slate-50/80 p-3 px-4 border-b border-slate-150 flex items-center justify-between text-xs">
                                  <span className="font-extrabold text-slate-800">
                                    {semId.split('-')[0]} Level - {semId.split('-')[1] === '1' ? 'First Semester' : 'Second Semester'}
                                  </span>
                                  <span className="font-mono bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-md font-bold">
                                    Semester GPA: {semGpa.toFixed(2)}
                                  </span>
                                </div>
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead>
                                    <tr className="bg-slate-100/50 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                                      <th className="p-3 pl-4">Course Code</th>
                                      <th className="p-3">Course Title</th>
                                      <th className="p-3 text-center">Units</th>
                                      <th className="p-3 text-center">Score</th>
                                      <th className="p-3 text-center">Grade</th>
                                      <th className="p-3 text-center">Grade Point</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-mono text-slate-600">
                                    {semGrades.map((g) => {
                                      const course = courses.find(c => c.code === g.courseCode);
                                      return (
                                        <tr key={g.courseCode} className="hover:bg-slate-50/40">
                                          <td className="p-3 pl-4 font-bold text-slate-800">{g.courseCode}</td>
                                          <td className="p-3 font-sans text-slate-700">{course?.title}</td>
                                          <td className="p-3 text-center font-bold text-slate-800">{course?.creditUnits}</td>
                                          <td className="p-3 text-center">{g.totalScore}</td>
                                          <td className="p-3 text-center">
                                            <span className={`px-1.5 py-0.5 rounded font-extrabold ${g.grade === 'A' ? 'text-emerald-600' : 'text-slate-700'}`}>{g.grade}</span>
                                          </td>
                                          <td className="p-3 text-center">{g.gradePoint}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary Block */}
                        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">Audit Integrity Status</span>
                            <span className="text-xs text-indigo-900 font-semibold flex items-center gap-1.5">
                              <ShieldCheck className="h-4 w-4 text-indigo-600" />
                              Verifiable SHA-256 Ledger Approved
                            </span>
                          </div>
                          <div className="text-center md:border-x md:border-indigo-100 py-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cumulative GPA</span>
                            <span className="text-2xl font-black text-indigo-700 font-mono">{getStudentCgpa(activeStudent.id).toFixed(2)}</span>
                          </div>
                          <div className="text-right space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Academic Standing</span>
                            <span className="text-xs font-black text-indigo-900 block">{getDegreeClass(getStudentCgpa(activeStudent.id))}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NEW FEE PAYMENT INVOICE TAB */}
                    {activeStudentTab === 'invoices' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 pb-5">
                          <h2 className="text-xl font-bold text-slate-900">Student Fee Payments & Invoices</h2>
                          <p className="text-xs text-slate-500">Manage, verify, and complete outstanding academic and administrative fee modules.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                          {/* Invoice Statement */}
                          <div className="md:col-span-7 border border-slate-150 rounded-2xl p-6 space-y-6 bg-slate-50/40">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">INVOICE NUMBER</span>
                                <h4 className="font-mono text-xs font-bold text-slate-700">INV-3001-APX-2026</h4>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                invoicePayments[activeStudent.id]?.status === 'Paid' 
                                  ? 'bg-green-50 text-green-600 border-green-100' 
                                  : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                              }`}>
                                Status: {invoicePayments[activeStudent.id]?.status || 'Pending'}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Itemized Fee Charges (300 Level)</h5>
                              <div className="divide-y divide-slate-100 text-xs">
                                <div className="py-2.5 flex justify-between text-slate-600">
                                  <span>General Tuition Charge</span>
                                  <span className="font-mono font-bold text-slate-800">$450.00</span>
                                </div>
                                <div className="py-2.5 flex justify-between text-slate-600">
                                  <span>Digital Library & Research Services</span>
                                  <span className="font-mono font-bold text-slate-800">$50.00</span>
                                </div>
                                <div className="py-2.5 flex justify-between text-slate-600">
                                  <span>ICT Infrastructure & Web Portal Admin</span>
                                  <span className="font-mono font-bold text-slate-800">$30.00</span>
                                </div>
                                <div className="py-2.5 flex justify-between text-slate-600">
                                  <span>Comprehensive Campus Health Cover</span>
                                  <span className="font-mono font-bold text-slate-800">$20.00</span>
                                </div>
                                <div className="py-2.5 flex justify-between text-slate-600">
                                  <span>Student Representative Activities</span>
                                  <span className="font-mono font-bold text-slate-800">$15.00</span>
                                </div>
                                <div className="py-3 flex justify-between text-sm font-bold border-t border-slate-200">
                                  <span className="text-slate-800">Total Academic Fee Due</span>
                                  <span className="font-mono text-indigo-600">$565.00</span>
                                </div>
                              </div>
                            </div>

                            {invoicePayments[activeStudent.id]?.status === 'Paid' ? (
                              <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-2">
                                <p className="text-[10px] font-bold text-green-700 uppercase tracking-wider flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  PAYMENT AUDITED & CONFIRMED
                                </p>
                                <p className="text-xs text-slate-600">
                                  Our registry records confirm payment of this invoice. Your slip course registration is fully activated for approval.
                                </p>
                                <p className="text-[10px] font-mono text-slate-400 select-all pt-1">
                                  TRANSACTION HASH: {invoicePayments[activeStudent.id]?.refId}
                                </p>
                              </div>
                            ) : (
                              <button 
                                onClick={() => handlePayInvoice(activeStudent.id)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-3xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                              >
                                <DollarSign className="h-4 w-4" />
                                Proceed to Mock Secure Payment ($565.00)
                              </button>
                            )}
                          </div>

                          {/* Info panel */}
                          <div className="md:col-span-5 space-y-4">
                            <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50 space-y-3 text-xs">
                              <h5 className="font-bold text-indigo-900">Billing Information Notice</h5>
                              <p className="text-slate-600 leading-relaxed">
                                Students are required to clear at least 50% of tuition billing before semester course registration locks. 
                              </p>
                              <p className="text-slate-600 leading-relaxed font-semibold">
                                Complete your payment simulation on the left to activate instant registry clearances.
                              </p>
                            </div>
                            
                            <div className="border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block">SUPPORT DESK HELP</span>
                              <p className="text-slate-600">Experiencing payment discrepancies? Submit a support ticket under the Contact section instantly.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* NEW LECTURE TIMETABLE TAB */}
                    {activeStudentTab === 'timetable' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 pb-5">
                          <h2 className="text-xl font-bold text-slate-900">Lecture Timetable Scheduler</h2>
                          <p className="text-xs text-slate-500">Weekly course schedule generated directly from your current semester registrations.</p>
                        </div>

                        {activeStudent.registeredCourses.length === 0 ? (
                          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs text-slate-500 font-semibold">No registered courses found</p>
                            <p className="text-[11px] text-slate-400 mt-1">Please complete your course registration form to generate a timetable schedule.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <p className="text-xs text-slate-500">Your registered courses are allocated to standard lecture hours:</p>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                              {[
                                { day: 'Monday', time: '09:00 AM - 12:00 PM', code: activeStudent.registeredCourses[0] || 'Syllabus Review' },
                                { day: 'Tuesday', time: '11:00 AM - 01:00 PM', code: activeStudent.registeredCourses[1] || 'Academic Audit' },
                                { day: 'Wednesday', time: '02:00 PM - 04:00 PM', code: activeStudent.registeredCourses[2] || 'Library Hours' },
                                { day: 'Thursday', time: '10:00 AM - 12:00 PM', code: activeStudent.registeredCourses[3] || 'Academic Consultation' },
                                { day: 'Friday', time: '01:00 PM - 03:00 PM', code: activeStudent.registeredCourses[4] || 'Practical Labs' }
                              ].map((sched) => {
                                const courseDetail = courses.find(c => c.code === sched.code);
                                return (
                                  <div key={sched.day} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2 hover:bg-slate-100/50 transition-colors">
                                    <span className="font-extrabold text-indigo-600 uppercase tracking-wider text-[9px] block">{sched.day}</span>
                                    <div className="font-bold text-slate-800 leading-tight">
                                      {courseDetail ? courseDetail.title : sched.code}
                                    </div>
                                    <div className="font-mono text-slate-400 text-[10px]">{sched.code}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-200/50 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {sched.time}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* NEW E-LIBRARY TAB */}
                    {activeStudentTab === 'elibrary' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 pb-5">
                          <h2 className="text-xl font-bold text-slate-900">Digital E-Library & Reading Repository</h2>
                          <p className="text-xs text-slate-500">Access open-source textbooks and recommended academic resources compiled by university faculty.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {[
                            { title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', code: 'CSC 301', link: '#' },
                            { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', code: 'CSC 201', link: '#' },
                            { title: 'Database System Concepts', author: 'Abraham Silberschatz', code: 'CSC 305', link: '#' },
                            { title: 'Calculus: Early Transcendentals', author: 'James Stewart', code: 'MTH 101', link: '#' },
                            { title: 'Software Engineering A Practitioner Approach', author: 'Roger Pressman', code: 'CSC 303', link: '#' },
                            { title: 'Computer Architecture Quantitative Approach', author: 'John L. Hennessy', code: 'CSC 204', link: '#' },
                            { title: 'Principles of Computer Networks', author: 'James Kurose', code: 'CSC 302', link: '#' },
                            { title: 'Linear Algebra and Its Applications', author: 'David C. Lay', code: 'MTH 102', link: '#' }
                          ].map((book, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500 transition-all shadow-3xs">
                              <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">{book.code} Course Book</span>
                                <h4 className="font-extrabold text-slate-800 text-xs leading-snug line-clamp-2">{book.title}</h4>
                                <p className="text-[10px] text-slate-500">By {book.author}</p>
                              </div>
                              <button 
                                onClick={() => alert(`Opening digital resource catalog reader for "${book.title}"...`)}
                                className="w-full py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 rounded-lg text-[10px] font-semibold transition-all cursor-pointer text-center"
                              >
                                View Open-Access PDF
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* NEW CAMPUS DIRECTORY & VENUES TAB */}
                    {activeStudentTab === 'campus' && (
                      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-xs space-y-6">
                        <div className="border-b border-slate-100 pb-5">
                          <h2 className="text-xl font-bold text-slate-900">Campus Venues Directory</h2>
                          <p className="text-xs text-slate-500">Quick coordinates reference finder for university lecture theatres and administrative complexes.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Faculty Room Allocation Coordinates</h4>
                            <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-slate-50/50 text-xs">
                              {[
                                { name: 'Turing Computer Science Laboratory', location: 'Block C, Room 302', cap: '60 seats' },
                                { name: 'Babbage Mathematics Lecture Theatre', location: 'Science Complex, Annex B', cap: '150 seats' },
                                { name: 'Faculty of Science Dean\'s Office', location: 'Administrative Block, Room 104', cap: 'Staff Access' },
                                { name: 'Central University Library Hall', location: 'Main Plaza Complex', cap: '500 seats' },
                                { name: 'Lovell Physics Experimental Lab', location: 'Physics Annex, Ground Floor', cap: '40 seats' }
                              ].map((ven, i) => (
                                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-white transition-colors">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-slate-800">{ven.name}</p>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                      <MapPin className="h-3 w-3 text-slate-400" />
                                      {ven.location}
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400">{ven.cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-900 rounded-2xl p-5 text-white flex flex-col justify-between border border-slate-800 shadow-xl">
                            <div className="space-y-3">
                              <span className="text-[9px] uppercase tracking-wider bg-indigo-600 text-white font-black px-2.5 py-0.5 rounded-full inline-block">CAMPUS LIFE HELP LINE</span>
                              <h4 className="text-lg font-black tracking-tight">Need Immediate Security or Medical Assistance?</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                The university campus support desk is active 24/7. Use our direct channels to contact academic coordinators or security staff.
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800 text-xs">
                              <div>
                                <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold">CAMPUS CLINIC</span>
                                <span className="font-mono text-indigo-400 font-bold">01-445-CLINIC</span>
                              </div>
                              <div>
                                <span className="text-slate-500 block uppercase tracking-wider text-[9px] font-bold">EMERGENCY LINE</span>
                                <span className="font-mono text-rose-400 font-bold">911-APEX-HELPLINE</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </motion.div>
                ) : (
                  <motion.div
                    key="admin-portal"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AdminPortal
                      students={students}
                      courses={courses}
                      grades={grades}
                      onAddCourse={handleAddCourse}
                      onDeleteCourse={handleDeleteCourse}
                      onApproveRegistration={handleApproveRegistration}
                      onUpdateGrades={handleUpdateGrades}
                      supportTickets={supportTickets}
                      onResolveTicket={handleResolveTicket}
                      onDeleteTicket={handleDeleteTicket}
                      announcements={announcements}
                      onAddAnnouncement={handleAddAnnouncement}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                      securityLogs={securityLogs}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      ) : (
        /* PUBLIC UNIVERSITY WEBSITE PORTAL (HOMEPAGE & NAV LINKS) */
        <div className="flex-1 flex flex-col justify-between bg-slate-50/50">
          {/* Header sticky Navigation bar */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 px-6 md:px-12 no-print shrink-0 shadow-3xs">
            <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPublicActiveTab('home')}>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-black tracking-tight text-lg text-slate-900 block leading-none">AcademiaFlow</span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-400">University Portal</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center gap-3 text-sm font-bold text-slate-600">
                <button 
                  onClick={() => setPublicActiveTab('home')}
                  className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${publicActiveTab === 'home' ? 'text-indigo-600 bg-indigo-50/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => setPublicActiveTab('about')}
                  className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${publicActiveTab === 'about' ? 'text-indigo-600 bg-indigo-50/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                >
                  About Us
                </button>
                <button 
                  onClick={() => setPublicActiveTab('calendar')}
                  className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${publicActiveTab === 'calendar' ? 'text-indigo-600 bg-indigo-50/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                >
                  Academic Calendar
                </button>
                <button 
                  onClick={() => setPublicActiveTab('contact')}
                  className={`px-4 py-2 rounded-xl transition-colors cursor-pointer ${publicActiveTab === 'contact' ? 'text-indigo-600 bg-indigo-50/50' : 'hover:text-slate-900 hover:bg-slate-100/50'}`}
                >
                  Contact Support
                </button>
              </nav>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPublicActiveTab('login')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="h-4 w-4" />
                  Portal Login
                </button>
              </div>
            </div>
          </header>

          {/* Public Tab Content block */}
          <main className="flex-1 max-w-[1536px] w-full mx-auto p-6 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={publicActiveTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                
                {/* 1. PUBLIC SITE HOME PAGE */}
                {publicActiveTab === 'home' && (
                  <div className="space-y-12">
                    {/* Hero section */}
                    <div className="text-center space-y-6 max-w-4xl mx-auto py-10">
                      <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100">
                        OFFICIAL ACADEMIAFLOW UNIVERSITY WEB HUB
                      </span>
                      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
                        An Academic Ecosystem Rooted in Transparency & Trust.
                      </h1>
                      <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
                        Access official registrations, audit end-of-semester results statement transcripts, and verify GPA calculations on a secure verifiable academic ledger.
                      </p>
                      <div className="flex justify-center gap-4 pt-3">
                        <button 
                          onClick={() => setPublicActiveTab('login')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                          Access Student Portal
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => setPublicActiveTab('catalog')}
                          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-3xs cursor-pointer"
                        >
                          Explore Course Directory
                        </button>
                      </div>
                    </div>

                    {/* Stats Counter Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-3xs text-center space-y-2">
                        <span className="text-4xl md:text-5xl font-black text-indigo-600 font-mono">3 Active</span>
                        <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Verified Students</h4>
                        <p className="text-sm text-slate-500">Real-time synchronized database files</p>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-3xs text-center space-y-2">
                        <span className="text-4xl md:text-5xl font-black text-indigo-600 font-mono">30+ Units</span>
                        <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Accredited Modules</h4>
                        <p className="text-sm text-slate-500">Core Computer Science & STEM syllabus</p>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-3xs text-center space-y-2">
                        <span className="text-4xl md:text-5xl font-black text-indigo-600 font-mono">100% Crypt</span>
                        <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Ledger Security</h4>
                        <p className="text-sm text-slate-500">SHA-256 result checksum hashing</p>
                      </div>
                    </div>

                    {/* Academic Directories & Info Hub */}
                    <div className="space-y-6">
                      <div className="border-b border-slate-200 pb-3">
                        <h3 className="font-bold text-slate-900 text-xl md:text-2xl flex items-center gap-2">
                          <Compass className="h-6 w-6 text-indigo-600" />
                          Academic Directories & Info Hub
                        </h3>
                        <p className="text-sm text-slate-500 mt-1.5">
                          Explore our accredited syllabus, department information, tuition calculations, and frequently asked questions.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-3xs flex flex-col justify-between hover:border-indigo-500 transition-all group">
                          <div className="space-y-3">
                            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                              <BookOpen className="h-6 w-6" />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-base">Course Catalog</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              Browse through our comprehensive directory of accredited core modules, electives, and course requirements.
                            </p>
                          </div>
                          <button 
                            onClick={() => setPublicActiveTab('catalog')}
                            className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Browse Courses
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-3xs flex flex-col justify-between hover:border-indigo-500 transition-all group">
                          <div className="space-y-3">
                            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                              <Grid className="h-6 w-6" />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-base">Departments</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              Learn about our diverse academic faculties, specialized learning labs, and career pathways.
                            </p>
                          </div>
                          <button 
                            onClick={() => setPublicActiveTab('departments')}
                            className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            View Departments
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-3xs flex flex-col justify-between hover:border-indigo-500 transition-all group">
                          <div className="space-y-3">
                            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                              <DollarSign className="h-6 w-6" />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-base">Tuition & Cost</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              Calculate precise tuition fees based on academic level, residency status, and semester credit weights.
                            </p>
                          </div>
                          <button 
                            onClick={() => setPublicActiveTab('tuition')}
                            className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Calculate Tuition
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-3xs flex flex-col justify-between hover:border-indigo-500 transition-all group">
                          <div className="space-y-3">
                            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl font-bold">
                              <HelpCircle className="h-6 w-6" />
                            </div>
                            <h4 className="font-extrabold text-slate-800 text-base">Portal FAQs</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              Get quick answers to common issues regarding registry clearances, course registration, and grading hashes.
                            </p>
                          </div>
                          <button 
                            onClick={() => setPublicActiveTab('faqs')}
                            className="w-full mt-5 py-2.5 bg-slate-50 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Read FAQs
                            <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Announcements Notice Board */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                      <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                          <h3 className="font-bold text-slate-900 text-xl md:text-2xl flex items-center gap-2">
                            <Clock className="h-6 w-6 text-indigo-600" />
                            Latest Campus Bulletins
                          </h3>
                        </div>

                        <div className="space-y-4">
                          {announcements.map((ann) => (
                            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-3xs space-y-3">
                              <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wider ${
                                  ann.category === 'Urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                  ann.category === 'Academic' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                  'bg-slate-100 text-slate-600 border border-slate-200'
                                }`}>
                                  {ann.category}
                                </span>
                                <span className="text-xs font-mono text-slate-400">{ann.date}</span>
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-base leading-snug">{ann.title}</h4>
                              <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Links Column */}
                      <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
                        <div className="space-y-2.5">
                          <span className="text-[10px] uppercase tracking-wider bg-indigo-600 font-bold px-3 py-1 rounded-full inline-block">PORTAL SYSTEM STATS</span>
                          <h4 className="font-black text-xl tracking-tight">E-Registry & Grade ledger Node</h4>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            Log into your verified student profile using the login button to register classes, print course slips, and download result sheets.
                          </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-slate-800 text-sm">
                          <button 
                            onClick={() => {
                              setSelectedStudentId('STU001');
                              setCurrentUserType('student');
                              setActiveStudentTab('dashboard');
                            }}
                            className="w-full text-left p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-800 flex items-center justify-between group cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">Emeka Obi (Level 300)</p>
                              <p className="text-xs text-slate-400 font-mono">APX/CSC/2023/1042</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                          
                          <button 
                            onClick={() => {
                              setSelectedStudentId('STU002');
                              setCurrentUserType('student');
                              setActiveStudentTab('dashboard');
                            }}
                            className="w-full text-left p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-800 flex items-center justify-between group cursor-pointer"
                          >
                            <div>
                              <p className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">Amina Bello (Level 200)</p>
                              <p className="text-xs text-slate-400 font-mono">APX/CSC/2024/2015</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PUBLIC SITE ABOUT US PAGE */}
                {publicActiveTab === 'about' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-8">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900 leading-none">About AcademiaFlow University</h2>
                      <p className="text-xs text-slate-500 mt-2">A legacy of excellence, driven by digital transparency and student empowerment.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-xs leading-relaxed text-slate-600">
                      <div className="space-y-4">
                        <h4 className="font-black text-slate-800 text-sm">Institutional History</h4>
                        <p>
                          Founded in 2020, AcademiaFlow was chartered with a core mission: to pioneer a modern, tech-focused student information system that resolves the traditional friction of course registrations and results management.
                        </p>
                        <p>
                          Our flagship Computer Science curriculum bridges advanced system architectures, discrete analysis, algorithms, and cryptographic ledger techniques. This results portal stands as an open testament to this vision.
                        </p>
                      </div>

                      <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="font-black text-slate-800 text-sm">Our Core Pillars</h4>
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                            <p><strong>Uncompromised Integrity:</strong> Result ledger systems are locked with dynamic hashes preventing records modification outside public audits.</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                            <p><strong>Paperless Efficiency:</strong> Real-time approval cues and instant print-ready registration slips bypass mechanical bureaucracy.</p>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                            <p><strong>Self-Auditable Ledger:</strong> Empowering students to self-audit their total grade points, GPA classes, and academic transcripts instantly.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PUBLIC SITE ACADEMIC CALENDAR */}
                {publicActiveTab === 'calendar' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Academic Calendar - First Semester</h2>
                      <p className="text-xs text-slate-500">Official term timeline, examinations milestones, and result publication schedule.</p>
                    </div>

                    <div className="space-y-3">
                      {[
                        { date: 'July 15, 2026', title: 'Admissions & Student Portal Gateway Activated', status: 'Upcoming' },
                        { date: 'July 20, 2026', title: 'Online Course Registration System Active', status: 'Upcoming' },
                        { date: 'August 05, 2026', title: 'Late Registration Penalty Phase Begins', status: 'Upcoming' },
                        { date: 'August 12, 2026', title: 'Syllabus Course Registrations Lock Period', status: 'Upcoming' },
                        { date: 'September 10, 2026', title: 'Mid-Semester Examinations Auditing', status: 'Upcoming' },
                        { date: 'October 15, 2026', title: 'Semester Lecture Period Concludes', status: 'Upcoming' },
                        { date: 'October 20 - 28, 2026', title: 'End-of-Semester Examination Audited Testing', status: 'Upcoming' },
                        { date: 'November 15, 2026', title: 'Publication of Signed Grade Ledgers', status: 'Upcoming' }
                      ].map((evt, idx) => (
                        <div key={idx} className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-xl border border-slate-100 flex items-center justify-between text-xs transition-all">
                          <div className="space-y-0.5">
                            <span className="font-mono text-indigo-600 font-semibold">{evt.date}</span>
                            <h4 className="font-extrabold text-slate-800 font-sans">{evt.title}</h4>
                          </div>
                          <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 py-0.5 rounded-md">
                            {evt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PUBLIC SITE COURSE CATALOG */}
                {publicActiveTab === 'catalog' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Syllabus Course Catalog</h2>
                      <p className="text-xs text-slate-500">Search and filter active credit modules approved by the Faculty of Science.</p>
                    </div>

                    {/* Course filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px] mb-1">Search Syllabus</span>
                        <input 
                          type="text" 
                          placeholder="Search title or code..."
                          onChange={(e) => {
                            // simple mock search filter
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course) => (
                        <div key={course.code} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-2 hover:border-indigo-500 transition-all shadow-3xs">
                          <div className="space-y-1.5 text-xs">
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">{course.code}</span>
                              <span className="font-mono text-slate-400 text-[10px] font-bold">{course.creditUnits} Units</span>
                            </div>
                            <h4 className="font-extrabold text-slate-800">{course.title}</h4>
                            <p className="text-slate-500 leading-relaxed text-[11px] line-clamp-3">{course.description || 'No course syllabus description detailed yet.'}</p>
                          </div>
                          <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                            <span>Level: {course.level}</span>
                            <span>{course.type}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. PUBLIC SITE DEPARTMENTS */}
                {publicActiveTab === 'departments' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Academic Departments</h2>
                      <p className="text-xs text-slate-500">Departments list, lead coordinators, and student capacities.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: 'Computer Science', hod: 'Prof. Alan Turing', email: 'turing@apex.edu.ng', code: 'CSC', desc: 'Syllabus covering object-oriented architectures, data structures, algorithms complexity, database structures, and software engineering foundations.' },
                        { name: 'Mathematics & Statistics', hod: 'Dr. Ada Lovelace', email: 'lovelace@apex.edu.ng', code: 'MTH', desc: 'Focusing on differential calculus, linear algebra, discrete systems, probability matrices, and physical data statistics.' },
                        { name: 'General Studies', hod: 'Dr. Socrates Philo', email: 'socrates@apex.edu.ng', code: 'GST', desc: 'Broad learning structures including English communication frameworks, logic structures, philosophy histories, and peace conflict dialogues.' },
                        { name: 'Physics & Physical Sciences', hod: 'Prof. Isaac Newton', email: 'newton@apex.edu.ng', code: 'PHY', desc: 'General mechanics analysis, fluid dynamics matrices, electromagnetism waveforms, and properties of atomic matter.' }
                      ].map((dept, i) => (
                        <div key={i} className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-5 space-y-3 text-xs leading-relaxed">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-800 text-sm">Department of {dept.name}</h4>
                            <span className="font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-0.5 rounded-md">{dept.code}</span>
                          </div>
                          <p className="text-slate-500">{dept.desc}</p>
                          <div className="pt-2 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                            <span>HOD: {dept.hod}</span>
                            <span className="font-mono text-indigo-500 lowercase">{dept.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. PUBLIC SITE TUITION & COST CALCULATOR */}
                {publicActiveTab === 'tuition' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Tuition, Fees & Cost Guide</h2>
                      <p className="text-xs text-slate-500">Calculate estimated academic and administrative tuition charges using our interactive form planner.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      {/* Calculator */}
                      <div className="md:col-span-5 bg-slate-50/50 rounded-2xl border border-slate-200/60 p-5 space-y-4 text-xs">
                        <h4 className="font-bold text-slate-800 text-sm">Cost Calculator</h4>
                        
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Level</label>
                          <select 
                            value={calcLevel}
                            onChange={(e) => setCalcLevel(Number(e.target.value))}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:border-indigo-600 focus:outline-hidden"
                          >
                            <option value={100}>100 Level</option>
                            <option value={200}>200 Level</option>
                            <option value={300}>300 Level</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Residency Profile</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                              <input 
                                type="radio" 
                                name="res" 
                                checked={!calcInternational}
                                onChange={() => setCalcInternational(false)}
                              />
                              National Student
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                              <input 
                                type="radio" 
                                name="res" 
                                checked={calcInternational}
                                onChange={() => setCalcInternational(true)}
                              />
                              International Student
                            </label>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Fee</span>
                          <p className="text-2xl font-black text-indigo-600 font-mono">
                            ${(565 + (calcLevel === 300 ? 50 : 0) + (calcInternational ? 400 : 0)).toFixed(2)}
                          </p>
                          <span className="text-[10px] text-slate-400">Includes tuition, E-library portal, health and support fees.</span>
                        </div>
                      </div>

                      {/* Guide List */}
                      <div className="md:col-span-7 text-xs text-slate-600 leading-relaxed space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Tuition Cost Structure Details</h4>
                        <p>
                          Tuition rates are calculated based on registered course credits and student residency statuses. Standard national rate begins at $450.00 base charge, plus standard health coverage, digital library portals, and ICT management costs.
                        </p>
                        <p>
                          International students undergo an additional base administration weight of $400.00. Late submissions are subject to a late registration fee.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. PUBLIC SITE FAQS */}
                {publicActiveTab === 'faqs' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
                      <p className="text-xs text-slate-500">Quick guide details on using the student portal, registration limits, and SHA-256 grade checksums.</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { q: 'How do I complete my first course registration?', a: 'Log into your student profile using the Portal Login button, navigate to the Course Registration tab, pick the approved core and elective units matching your level (under 24 units), and click submit to trigger a registry approval.' },
                        { q: 'What is a cryptographic SHA-256 result checksum?', a: 'In AcademiaFlow, grades published by department administrators generate a unique digital signature hash. These signatures guarantee results records cannot be altered or tampered with outside the registrar\'s audit guidelines, providing total academic transcript assurance.' },
                        { q: 'How is the semester GPA and CGPA calculated?', a: 'Semester GPA is computed by multiplying the course unit load by the grade point earned (A=5, B=4, C=3, D=2, E=1, F=0), summing the values, and dividing by total registered units. Cumulative GPA is computed across all semesters in the ledger.' },
                        { q: 'How can I print my official registration or result slip?', a: 'Navigate to either the Course Registration or Result Confirmation tab inside your student panel, and click the Print Slip button. This opens a dedicated, printable clean official slip mockup page.' }
                      ].map((faq, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-150 text-xs space-y-1.5 leading-relaxed">
                          <h4 className="font-extrabold text-slate-800">{faq.q}</h4>
                          <p className="text-slate-500">{faq.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 8. PUBLIC SITE CONTACT SUPPORT */}
                {publicActiveTab === 'contact' && (
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-10 shadow-3xs space-y-6">
                    <div className="border-b border-slate-150 pb-5">
                      <h2 className="text-2xl font-black text-slate-900">Contact & Support Desk</h2>
                      <p className="text-xs text-slate-500">Submit a support ticket regarding result audits, registrations, or login issues. Support staff will respond instantly in the Admin Inbox.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      {/* Ticket Form */}
                      <form onSubmit={handleContactSubmit} className="md:col-span-7 bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 space-y-4 text-xs">
                        <h4 className="font-bold text-slate-800 text-sm">Submit Support Ticket</h4>

                        {contactSuccess && (
                          <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-green-700 font-bold flex items-center gap-1.5 animate-bounce">
                            <CheckCircle2 className="h-4 w-4" />
                            Ticket submitted successfully! Admin will view it in the inbox.
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Full Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. John Doe"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                            <input 
                              type="email" 
                              placeholder="e.g. john@student.apex.edu"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inquiry Category</label>
                          <select 
                            value={contactCategory}
                            onChange={(e) => setContactCategory(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                          >
                            <option value="Inquiry">General Inquiry</option>
                            <option value="Result Discrepancy">Result Discrepancy / Audit</option>
                            <option value="Registration Issue">Syllabus / Registration Issue</option>
                            <option value="Tech Support">Portal Technical Support</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ticket Message Content</label>
                          <textarea 
                            rows={4}
                            placeholder="Type details of your issue..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5"
                            required
                          />
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-3xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Submit Ticket
                        </button>
                      </form>

                      {/* Sidebar Details */}
                      <div className="md:col-span-5 text-xs text-slate-600 leading-relaxed space-y-4">
                        <h4 className="font-bold text-slate-800 text-sm">Support Response Guidelines</h4>
                        <p>
                          Our registrar office monitors support tickets 24/7. When a student files a ticket, it lands directly inside the Admin Control Portal. Our faculty coordinators will reply to any inquiries, discrepancy audits, or registration errors.
                        </p>
                        <p>
                          Responses will appear directly on your support log. Keep your email active for automatic alerts.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. PORTAL SIGN IN GATEWAY PAGE */}
                {publicActiveTab === 'login' && (
                  <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-start py-6">
                    {/* Left Info block */}
                    <div className="md:col-span-5 space-y-6 text-xs text-slate-500">
                      <div className="space-y-3">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 w-max">
                          SECURE GATEWAY
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight font-sans">
                          E-Portal Registrar & Security Check
                        </h2>
                        <p className="leading-relaxed">
                          Secure portal gateway for verified students and academic administrative coordinators. Authenticate to manage course registration and confirm results.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 h-max">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Curriculum Tracker</h4>
                            <p className="text-[11px] mt-0.5">Interactive module registration with credit unit validation checks.</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 h-max">
                            <Award className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Self Auditing</h4>
                            <p className="text-[11px] mt-0.5">End-of-semester statements and real-time CGPA calculations.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Login Cards block */}
                    <div className="md:col-span-7 space-y-6">
                      {/* Student Portal Card with Credentials & Registration Tabs */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-3xs space-y-5">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <h3 className="font-black text-slate-950 text-sm uppercase tracking-wider">Student Portal</h3>
                          <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px]">
                            <button
                              onClick={() => { setLoginTab('signin'); setLoginError(''); }}
                              className={`px-2.5 py-1 rounded-md font-extrabold transition-all cursor-pointer ${loginTab === 'signin' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                              Sign In
                            </button>
                            <button
                              onClick={() => { setLoginTab('register'); setLoginError(''); }}
                              className={`px-2.5 py-1 rounded-md font-extrabold transition-all cursor-pointer ${loginTab === 'register' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                              Register
                            </button>
                            <button
                              onClick={() => { setLoginTab('selector'); setLoginError(''); }}
                              className={`px-2.5 py-1 rounded-md font-extrabold transition-all cursor-pointer ${loginTab === 'selector' ? 'bg-white text-slate-900 shadow-3xs' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                              Demo Profiles
                            </button>
                          </div>
                        </div>

                        {loginError && (
                          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl font-medium flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                            <span>{loginError}</span>
                          </div>
                        )}

                        {regSuccess && (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{regSuccess}</span>
                          </div>
                        )}

                        {/* Sign In View */}
                        {loginTab === 'signin' && (
                          <form onSubmit={handleCredentialsSignIn} className="space-y-4 text-xs">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Email Address</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                  <Mail className="h-3.5 w-3.5" />
                                </span>
                                <input
                                  type="email"
                                  required
                                  placeholder="e.g. emeka.obi@apex.edu.ng"
                                  value={typedEmail}
                                  onChange={(e) => setTypedEmail(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Password</label>
                                <span className="text-[9px] text-slate-400 font-medium">Default: 1234</span>
                              </div>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                  <Lock className="h-3.5 w-3.5" />
                                </span>
                                <input
                                  type="password"
                                  required
                                  placeholder="••••••••"
                                  value={typedPassword}
                                  onChange={(e) => setTypedPassword(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-3xs transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                            >
                              Verify credentials & Sign In
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </form>
                        )}

                        {/* Registration View */}
                        {loginTab === 'register' && (
                          <form onSubmit={handleStudentRegister} className="space-y-4 text-xs">
                            <p className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg leading-relaxed border border-slate-100">
                              Register a brand new student! As requested, registered accounts are automatically assigned professional, high-resolution representative profiles.
                            </p>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                  <User className="h-3.5 w-3.5" />
                                </span>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Chukwuemeka Adebayo"
                                  value={regName}
                                  onChange={(e) => setRegName(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-9 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                                <input
                                  type="email"
                                  required
                                  placeholder="e.g. emeka@apex.edu.ng"
                                  value={regEmail}
                                  onChange={(e) => setRegEmail(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Secure Password</label>
                                <input
                                  type="password"
                                  required
                                  placeholder="Choose password"
                                  value={regPassword}
                                  onChange={(e) => setRegPassword(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800 font-mono"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Department / Major</label>
                                <select
                                  value={regDept}
                                  onChange={(e) => setRegDept(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800 font-medium"
                                >
                                  <option value="Computer Science">Computer Science</option>
                                  <option value="Mathematics & Statistics">Mathematics & Statistics</option>
                                  <option value="Physics & Physical Sciences">Physics & Physical Sciences</option>
                                  <option value="General Studies">General Studies</option>
                                </select>
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enrollment Level</label>
                                <select
                                  value={regLevel}
                                  onChange={(e) => setRegLevel(Number(e.target.value))}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-indigo-600 focus:outline-hidden transition-all text-slate-800 font-medium"
                                >
                                  <option value={100}>100 Level</option>
                                  <option value={200}>200 Level</option>
                                  <option value={300}>300 Level</option>
                                  <option value={400}>400 Level</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Avatar Representation</label>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1 hover:bg-slate-100 transition-all">
                                  <input
                                    type="radio"
                                    name="regGender"
                                    checked={regGender === 'male'}
                                    onChange={() => setRegGender('male')}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="font-bold text-slate-700">Black Man Profile</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex-1 hover:bg-slate-100 transition-all">
                                  <input
                                    type="radio"
                                    name="regGender"
                                    checked={regGender === 'female'}
                                    onChange={() => setRegGender('female')}
                                    className="text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="font-bold text-slate-700">Black Woman Profile</span>
                                </label>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow-3xs transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              Create new Student Account & credentials
                              <Sparkles className="h-4 w-4 text-amber-300" />
                            </button>
                          </form>
                        )}

                        {/* Demo Profile Selector View */}
                        {loginTab === 'selector' && (
                          <div className="space-y-4">
                            <p className="text-[11px] text-slate-400">
                              Choose an preloaded student file with realistic, professional Black student profiles:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              {students.map((st) => (
                                <button
                                  key={st.id}
                                  onClick={() => {
                                    setSelectedStudentId(st.id);
                                    setTypedEmail(st.email);
                                    setLoginTab('signin');
                                    addSecurityLog(`Autofilled login for student: ${st.name}`);
                                  }}
                                  className={`p-3 rounded-xl border text-center space-y-2 hover:border-indigo-600 hover:bg-indigo-50/10 transition-all cursor-pointer flex flex-col items-center justify-center ${
                                    selectedStudentId === st.id 
                                      ? 'border-indigo-600 bg-indigo-50/10' 
                                      : 'border-slate-200'
                                  }`}
                                >
                                  {st.avatar ? (
                                    <img
                                      src={st.avatar}
                                      alt={st.name}
                                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shadow-3xs"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 font-black rounded-xl flex items-center justify-center text-sm shadow-3xs">
                                      {st.name.charAt(0)}
                                    </div>
                                  )}
                                  <div className="leading-tight">
                                    <h5 className="font-extrabold text-slate-800 text-[11px] truncate max-w-[100px]">{st.name}</h5>
                                    <span className="text-[9px] font-mono text-slate-450">{st.matricNumber}</span>
                                  </div>
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setCurrentUserType('student');
                                setActiveStudentTab('dashboard');
                                const current = students.find(s => s.id === selectedStudentId);
                                if (current) addSecurityLog(`Logged in as Student: ${current.name} (${current.matricNumber}).`);
                              }}
                              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-3xs transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              Quick Access Selected Profile (Simulate)
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Admin Credentials form card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-3xs space-y-4">
                        <div>
                          <h3 className="font-black text-slate-950 text-sm uppercase tracking-wider">Administrative Access</h3>
                          <p className="text-xs text-slate-450 mt-0.5">Faculty registrars, coordinators, and grade signers</p>
                        </div>

                        <form onSubmit={handleAdminSignIn} className="space-y-3 text-xs">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Administrative password</label>
                            <input
                              type="password"
                              placeholder="Access token (use 'admin' or '1234')"
                              value={adminPassword}
                              onChange={(e) => setAdminPassword(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:border-indigo-600 focus:outline-hidden font-mono text-xs transition-all text-slate-800"
                            />
                          </div>

                          {adminError && (
                            <p className="text-rose-600 text-xs font-semibold">{adminError}</p>
                          )}

                          <button
                            type="submit"
                            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-extrabold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Shield className="h-4 w-4 text-slate-500" />
                            Authorize Admin Terminal
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer of Public Site */}
          <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 no-print mt-auto">
            <div className="max-w-[1536px] mx-auto px-6 md:px-12 py-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-800">
                {/* Brand Column */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center gap-2.5 text-white">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-black text-sm tracking-tight block">APEX UNIVERSITY</span>
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block -mt-1">E-Registrar Portal</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                    Apex University empowers students with secure, direct access to academic archives, real-time results auditing, and certified syllabus registration.
                  </p>
                </div>

                {/* Academic Services Column */}
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Academic Hub</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Course Catalog Directory
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('departments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Faculties & Departments
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('tuition'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Tuition Calculator
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('faqs'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Frequently Asked Questions
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Quick Navigation Column */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Navigation</h4>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Home Page
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        About Academy
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Academic Calendar
                      </button>
                    </li>
                    <li>
                      <button 
                        onClick={() => { setPublicActiveTab('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="hover:text-indigo-400 transition-colors cursor-pointer text-left"
                      >
                        Contact & Support
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Contact Information Column */}
                <div className="md:col-span-3 space-y-3">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider">Contact & Campus</h4>
                  <ul className="space-y-2.5 text-xs text-slate-400">
                    <li className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Main University Campus, Annex Plaza, Building C</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>registrar@student.apex.edu</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <PhoneCall className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>+1 (555) 445-APEX</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-500">
                <p>&copy; {new Date().getFullYear()} Apex University. All academic credentials verified with SHA-256 secure hash signing.</p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setPublicActiveTab('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    E-Portal Sign In
                  </button>
                  <span>&middot;</span>
                  <span className="text-[10px] font-mono text-indigo-500/70">Secure Gate TLS 1.3</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      )}

      {/* Floating Slip Modal for printing */}
      {printModalConfig?.isOpen && activeStudent && (
        <PrintSlip
          student={activeStudent}
          allCourses={courses}
          grades={grades}
          type={printModalConfig.type}
          semesterId={printModalConfig.semesterId}
          semesterName="2025/2026 Academic Session"
          onClose={() => setPrintModalConfig(null)}
        />
      )}

      {/* Dynamic Toast Alerts Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none no-print">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
              className="bg-white rounded-2xl border border-slate-200/85 p-4 shadow-xl flex gap-3 pointer-events-auto shrink-0 relative overflow-hidden animate-pulse-once"
            >
              {/* Colored status strip */}
              <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                notif.type === 'success' ? 'bg-emerald-500' :
                notif.type === 'warning' ? 'bg-amber-500' : 'bg-indigo-500'
              }`} />
              
              <div className="flex-1 pl-1 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 pr-4 text-xs">{notif.title}</h4>
                  <span className="text-[9px] font-mono text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-slate-500 leading-relaxed font-semibold">{notif.message}</p>
              </div>

              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-slate-400 hover:text-slate-600 transition-colors h-max p-1 rounded-lg hover:bg-slate-50 cursor-pointer flex-shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
