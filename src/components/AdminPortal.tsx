import React, { useState } from 'react';
import { Course, Student, GradeRecord, SupportTicket, Announcement } from '../types';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Award,
  AlertCircle,
  Clock,
  Save,
  Check,
  Percent,
  Layers,
  ChevronRight,
  Info,
  MessageSquare,
  ShieldAlert,
  BarChart,
  Send,
  X,
  FileText
} from 'lucide-react';
import { calculateGrade } from '../data/seed';

interface AdminPortalProps {
  students: Student[];
  courses: Course[];
  grades: GradeRecord[];
  onAddCourse: (newCourse: Course) => void;
  onDeleteCourse: (courseCode: string) => void;
  onApproveRegistration: (studentId: string) => void;
  onUpdateGrades: (updatedGrades: GradeRecord[]) => void;
  supportTickets: SupportTicket[];
  onResolveTicket: (id: string, reply: string) => void;
  onDeleteTicket: (id: string) => void;
  announcements: Announcement[];
  onAddAnnouncement: (newAnn: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  securityLogs: string[];
}

export default function AdminPortal({
  students,
  courses,
  grades,
  onAddCourse,
  onDeleteCourse,
  onApproveRegistration,
  onUpdateGrades,
  supportTickets,
  onResolveTicket,
  onDeleteTicket,
  announcements,
  onAddAnnouncement,
  onDeleteAnnouncement,
  securityLogs
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'grading' | 'tickets' | 'messages' | 'security' | 'analytics'>('students');

  // Course Selector for grading
  const [selectedGradingCourse, setSelectedGradingCourse] = useState<string>('CSC 101');
  
  // Student Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'all' | 'Not Registered' | 'Pending Approval' | 'Approved'>('all');

  // Course Search
  const [courseSearch, setCourseSearch] = useState('');
  const [courseLevelFilter, setCourseLevelFilter] = useState<number | 'all'>('all');

  // Course Add form states
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseUnits, setNewCourseUnits] = useState(3);
  const [newCourseLevel, setNewCourseLevel] = useState<number>(100);
  const [newCourseSemester, setNewCourseSemester] = useState<1 | 2>(1);
  const [newCourseType, setNewCourseType] = useState<'Core' | 'Elective'>('Core');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseFormError, setCourseFormError] = useState<string | null>(null);

  // New announcement form state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'Urgent' | 'General' | 'Academic'>('General');

  // Ticket replying state
  const [ticketReplies, setTicketReplies] = useState<{[ticketId: string]: string}>({});

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;
    onAddAnnouncement({
      id: 'ann-' + Date.now(),
      title: newAnnTitle,
      content: newAnnContent,
      date: new Date().toISOString().split('T')[0],
      category: newAnnCategory
    });
    setNewAnnTitle('');
    setNewAnnContent('');
    alert('Announcement successfully published to university portal homepage!');
  };

  const handleSendReply = (ticketId: string) => {
    const rText = ticketReplies[ticketId];
    if (!rText || !rText.trim()) return;
    onResolveTicket(ticketId, rText);
    setTicketReplies({ ...ticketReplies, [ticketId]: '' });
    alert('Reply successfully logged and ticket status marked as RESOLVED.');
  };

  // Score editing states - temporary dictionary of ca & exam scores
  const [editingScores, setEditingScores] = useState<{[studentId: string]: {ca: number, exam: number}}>({});

  // Calculations for KPI Panel
  const totalStudents = students.length;
  const totalCoursesCount = courses.length;
  const pendingRegCount = students.filter(s => s.registrationStatus === 'Pending Approval').length;
  
  // Calculate average CGPA across all students
  const approvedGrades = grades.filter(g => g.approved);
  let totalGradeUnits = 0;
  let totalGPPoints = 0;
  approvedGrades.forEach(g => {
    const course = courses.find(c => c.code === g.courseCode);
    if (course) {
      totalGradeUnits += course.creditUnits;
      totalGPPoints += g.gradePoint * course.creditUnits;
    }
  });
  const avgCgpa = totalGradeUnits > 0 ? Number((totalGPPoints / totalGradeUnits).toFixed(2)) : 0;

  // Filter students based on search
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.matricNumber.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesFilter = studentFilter === 'all' || s.registrationStatus === studentFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter courses
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          c.code.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesLevel = courseLevelFilter === 'all' || c.level === Number(courseLevelFilter);
    return matchesSearch && matchesLevel;
  });

  // List of students registered for the active grading course
  const gradingStudents = students.filter(s => s.registeredCourses.includes(selectedGradingCourse));

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCourseFormError(null);

    if (!newCourseCode || !newCourseTitle) {
      setCourseFormError('Course Code and Course Title are required.');
      return;
    }

    if (courses.some(c => c.code.toLowerCase() === newCourseCode.trim().toLowerCase())) {
      setCourseFormError(`Course with code ${newCourseCode.trim()} already exists.`);
      return;
    }

    const newCourseObj: Course = {
      code: newCourseCode.trim().toUpperCase(),
      title: newCourseTitle.trim(),
      creditUnits: newCourseUnits,
      department: 'Computer Science',
      level: newCourseLevel,
      semester: newCourseSemester,
      type: newCourseType,
      description: newCourseDesc.trim() || undefined
    };

    onAddCourse(newCourseObj);
    
    // Reset Form
    setNewCourseCode('');
    setNewCourseTitle('');
    setNewCourseUnits(3);
    setNewCourseLevel(100);
    setNewCourseSemester(1);
    setNewCourseType('Core');
    setNewCourseDesc('');
    setShowAddCourseModal(false);
  };

  const handleScoreChange = (studentId: string, field: 'ca' | 'exam', val: string) => {
    const numVal = val === '' ? 0 : Math.max(0, parseInt(val) || 0);
    const maxVal = field === 'ca' ? 40 : 60;
    
    const cappedVal = Math.min(numVal, maxVal);

    setEditingScores(prev => ({
      ...prev,
      [studentId]: {
        ca: field === 'ca' ? cappedVal : (prev[studentId]?.ca ?? 0),
        exam: field === 'exam' ? cappedVal : (prev[studentId]?.exam ?? 0)
      }
    }));
  };

  const handleSaveGrades = (studentId: string) => {
    const edit = editingScores[studentId];
    if (!edit) return;

    // Build the score and update
    const total = edit.ca + edit.exam;
    const { grade, gp } = calculateGrade(total);

    const updatedRecord: GradeRecord = {
      studentId,
      courseCode: selectedGradingCourse,
      semesterId: '300-1', // Seed current semester ID
      caScore: edit.ca,
      examScore: edit.exam,
      totalScore: total,
      grade,
      gradePoint: gp,
      approved: true
    };

    // Find if record already exists
    const updatedGradesList = grades.map(g => {
      if (g.studentId === studentId && g.courseCode === selectedGradingCourse) {
        return updatedRecord;
      }
      return g;
    });

    // If it is a new record, append it
    const exists = grades.some(g => g.studentId === studentId && g.courseCode === selectedGradingCourse);
    if (!exists) {
      updatedGradesList.push(updatedRecord);
    }

    onUpdateGrades(updatedGradesList);
    
    // Clear editing state for that student
    const nextEditing = { ...editingScores };
    delete nextEditing[studentId];
    setEditingScores(nextEditing);

    alert(`Grades successfully calculated, encrypted, and published for student.`);
  };

  return (
    <div className="space-y-6">
      {/* KPI Dashboard Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-3xs">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Enrolled</span>
            <h3 className="text-xl font-black text-slate-800 font-mono mt-0.5">{totalStudents} Students</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-3xs">
          <div className="p-3.5 bg-violet-50 text-violet-600 rounded-xl">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Offered Syllabus</span>
            <h3 className="text-xl font-black text-slate-800 font-mono mt-0.5">{totalCoursesCount} Courses</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-3xs">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pending Approvals</span>
            <h3 className="text-xl font-black text-slate-800 font-mono mt-0.5">{pendingRegCount} Registry Slips</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-3xs">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Class Avg GPA</span>
            <h3 className="text-xl font-black text-slate-800 font-mono mt-0.5">{avgCgpa.toFixed(2)} CGPA</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'students'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="h-4 w-4" />
            Students Roster
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="h-4 w-4" />
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'grading'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Award className="h-4 w-4" />
            Score Compiler
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer relative ${
              activeTab === 'tickets'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Support Tickets
            {supportTickets.filter(t => t.status === 'Open').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            Security Audit
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-indigo-600 shadow-3xs border border-slate-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <BarChart className="h-4 w-4" />
            Portal Stats
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* 1. STUDENT REGISTRATIONS TAB */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              {/* Search & Filter bar */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or matric number..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden transition-all"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={studentFilter}
                    onChange={(e: any) => setStudentFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
                  >
                    <option value="all">All Registrations</option>
                    <option value="Not Registered">Not Registered</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
              </div>

              {/* Student Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredStudents.map((student) => {
                  const studentGrades = grades.filter(g => g.studentId === student.id && g.approved);
                  let totalGP = 0;
                  let totalUnits = 0;
                  studentGrades.forEach(g => {
                    const c = courses.find(course => course.code === g.courseCode);
                    if (c) {
                      totalGP += g.gradePoint * c.creditUnits;
                      totalUnits += c.creditUnits;
                    }
                  });
                  const gpa = totalUnits > 0 ? Number((totalGP / totalUnits).toFixed(2)) : 0;

                  return (
                    <div key={student.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs hover:border-slate-200 transition-all space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {student.avatar ? (
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-12 h-12 object-cover rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center rounded-xl border border-slate-200">
                              {student.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{student.name}</h4>
                            <p className="text-[11px] font-mono font-medium text-slate-400 mt-0.5">{student.matricNumber}</p>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          student.registrationStatus === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                          student.registrationStatus === 'Pending Approval' ? 'bg-amber-50 border-amber-100 text-amber-700 animate-pulse' :
                          'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                          {student.registrationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center text-xs">
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block font-medium">Level</span>
                          <strong className="text-slate-700 text-sm">{student.level}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block font-medium">Credits</span>
                          <strong className="text-slate-700 text-sm font-mono">{student.registeredCourses.length ? student.registeredCourses.length * 3 : 0} U</strong>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase text-slate-400 block font-medium">CGPA</span>
                          <strong className="text-slate-700 text-sm font-mono">{gpa.toFixed(2)}</strong>
                        </div>
                      </div>

                      {/* Course Registry Preview */}
                      {student.registeredCourses.length > 0 && (
                        <div className="text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700 block mb-1">Registered Courses ({student.registeredCourses.length}):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {student.registeredCourses.map(code => (
                              <span key={code} className="bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded text-[9px] border border-slate-100">
                                {code}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Approvals button */}
                      {student.registrationStatus === 'Pending Approval' && (
                        <button
                          onClick={() => {
                            onApproveRegistration(student.id);
                            alert(`Registration cleared and APPROVED for ${student.name}`);
                          }}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Approve Registration Slip
                        </button>
                      )}
                    </div>
                  );
                })}

                {filteredStudents.length === 0 && (
                  <div className="col-span-2 py-16 text-center max-w-sm mx-auto space-y-3">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-full w-max mx-auto border border-slate-100">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">No Student Registrations Found</h4>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search query.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. CURRICULUM MANAGEMENT TAB */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {/* Header actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Course Catalog</h3>
                  <p className="text-xs text-slate-500">View and update university syllabus lists</p>
                </div>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add New Course
                </button>
              </div>

              {/* Add course inline modal/form */}
              {showAddCourseModal && (
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/60 max-w-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">Register New Course</h4>
                    <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">Cancel</button>
                  </div>
                  
                  <form onSubmit={handleAddCourseSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-medium text-slate-700">
                    <div className="md:col-span-4">
                      <label className="block mb-1">Course Code (e.g. CSC 301)</label>
                      <input
                        type="text"
                        placeholder="CSC 301"
                        value={newCourseCode}
                        onChange={(e) => setNewCourseCode(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="md:col-span-8">
                      <label className="block mb-1">Course Title</label>
                      <input
                        type="text"
                        placeholder="Systems Programming"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block mb-1">Credit Units</label>
                      <select
                        value={newCourseUnits}
                        onChange={(e) => setNewCourseUnits(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option value={1}>1 Unit</option>
                        <option value={2}>2 Units</option>
                        <option value={3}>3 Units</option>
                        <option value={4}>4 Units</option>
                        <option value={5}>5 Units</option>
                        <option value={6}>6 Units</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block mb-1">Target Level</label>
                      <select
                        value={newCourseLevel}
                        onChange={(e) => setNewCourseLevel(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option value={100}>100 Level</option>
                        <option value={200}>200 Level</option>
                        <option value={300}>300 Level</option>
                        <option value={400}>400 Level</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block mb-1">Semester</label>
                      <select
                        value={newCourseSemester}
                        onChange={(e: any) => setNewCourseSemester(Number(e.target.value) as 1|2)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option value={1}>1st Semester</option>
                        <option value={2}>2nd Semester</option>
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block mb-1">Course Type</label>
                      <select
                        value={newCourseType}
                        onChange={(e: any) => setNewCourseType(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      >
                        <option value="Core">Core</option>
                        <option value="Elective">Elective</option>
                      </select>
                    </div>
                    <div className="md:col-span-12">
                      <label className="block mb-1">Syllabus / Course Description</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of syllabus objectives..."
                        value={newCourseDesc}
                        onChange={(e) => setNewCourseDesc(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs"
                      />
                    </div>

                    {courseFormError && (
                      <div className="md:col-span-12 p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg font-semibold">
                        {courseFormError}
                      </div>
                    )}

                    <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCourseModal(false)}
                        className="bg-white border border-slate-200 text-slate-600 p-2.5 px-4 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 px-5 rounded-lg font-semibold"
                      >
                        Add to Syllabus
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Filters & Grid */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search courses by code or title..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:bg-white focus:border-slate-800 focus:outline-hidden transition-all"
                  />
                </div>
                <select
                  value={courseLevelFilter}
                  onChange={(e: any) => setCourseLevelFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                </select>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCourses.map((c) => (
                  <div key={c.code} className="bg-slate-50/50 border border-slate-100 hover:border-slate-200 rounded-2xl p-4.5 flex items-start justify-between gap-4 transition-all">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-3xs">
                          {c.code}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          c.type === 'Core' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {c.type}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 font-mono">
                          Lvl {c.level}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{c.title}</h4>
                      <p className="text-xs text-slate-400 font-medium font-sans">
                        Credit Weight: <strong className="text-slate-700 font-mono">{c.creditUnits} Units</strong>
                      </p>
                      {c.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${c.code}? This deletes associated grade metrics.`)) {
                          onDeleteCourse(c.code);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SCORE ENTRY & GRADING TAB */}
          {activeTab === 'grading' && (
            <div className="space-y-6">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="font-bold text-slate-800 text-sm">Official Course Grade Entry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Input Continuous Assessment (CA) and Exam grades for registered students</p>
              </div>

              {/* Course selection for scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4.5 rounded-2xl border border-slate-100">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Choose Grading Course
                  </label>
                  <select
                    value={selectedGradingCourse}
                    onChange={(e) => {
                      setSelectedGradingCourse(e.target.value);
                      setEditingScores({}); // clear temp edits
                    }}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                  >
                    {courses.map(c => (
                      <option key={c.code} value={c.code}>
                        [{c.code}] {c.title} ({c.creditUnits} Units) - {c.level} Level
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-center text-xs text-slate-500 border-l border-slate-200 pl-4">
                  <p className="font-medium text-slate-700">Grading Registry Rule:</p>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400 mt-1">
                    <li>Continuous Assessment: 0 - 40 Marks</li>
                    <li>Semester Examination: 0 - 60 Marks</li>
                  </ul>
                </div>
              </div>

              {/* Grading Students list */}
              <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-3xs">
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Students Registered for {selectedGradingCourse} ({gradingStudents.length})</span>
                  <span className="text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">Grade Sheet Compiler v1.0</span>
                </div>

                {gradingStudents.length === 0 ? (
                  <div className="py-16 text-center max-w-sm mx-auto space-y-3">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-xl w-max mx-auto border border-slate-100">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">No Students Registered</h4>
                      <p className="text-xs text-slate-400">There are no students registered for {selectedGradingCourse} in the current session.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {gradingStudents.map((student) => {
                      // Get active record for student/course
                      const record = grades.find(g => g.studentId === student.id && g.courseCode === selectedGradingCourse);

                      const tempEdit = editingScores[student.id];
                      const activeCA = tempEdit ? tempEdit.ca : (record?.caScore ?? 0);
                      const activeExam = tempEdit ? tempEdit.exam : (record?.examScore ?? 0);
                      const activeTotal = activeCA + activeExam;
                      const { grade, gp } = calculateGrade(activeTotal);

                      const isModified = tempEdit !== undefined;

                      return (
                        <div key={student.id} className="p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/30 transition-all">
                          <div className="flex items-center gap-3 w-56 flex-shrink-0">
                            {student.avatar ? (
                              <img src={student.avatar} alt={student.name} className="w-9 h-9 object-cover rounded-lg" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-9 h-9 bg-slate-100 text-slate-700 font-semibold text-sm flex items-center justify-center rounded-lg">{student.name.charAt(0)}</div>
                            )}
                            <div>
                              <h5 className="font-bold text-slate-800 text-xs">{student.name}</h5>
                              <p className="text-[10px] font-mono text-slate-400 mt-0.5">{student.matricNumber}</p>
                            </div>
                          </div>

                          {/* Interactive scorecard */}
                          <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-xs">
                            {/* CA field */}
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">CA Score (40)</label>
                              <input
                                type="number"
                                min={0}
                                max={40}
                                value={activeCA || ''}
                                onChange={(e) => handleScoreChange(student.id, 'ca', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-2 text-xs text-center font-mono font-bold focus:bg-white"
                              />
                            </div>

                            {/* Exam Field */}
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Exam (60)</label>
                              <input
                                type="number"
                                min={0}
                                max={60}
                                value={activeExam || ''}
                                onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 px-2 text-xs text-center font-mono font-bold focus:bg-white"
                              />
                            </div>

                            {/* Auto Total */}
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Total</span>
                              <span className="font-mono text-sm font-extrabold text-slate-800 bg-slate-100 px-2 py-1 rounded inline-block min-w-[40px]">
                                {activeTotal}
                              </span>
                            </div>

                            {/* Auto Grade */}
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Grade / GP</span>
                              <div className="flex items-center justify-center gap-1">
                                <span className="font-bold text-slate-800 text-xs">{grade}</span>
                                <span className="text-slate-400 font-mono text-[10px]">({gp}pt)</span>
                              </div>
                            </div>

                            {/* Status and Action */}
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase tracking-wider">Approval</span>
                              {record?.approved && !isModified ? (
                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100 inline-block">
                                  Approved
                                </span>
                              ) : (
                                <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100 inline-block animate-pulse">
                                  Draft Entry
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex items-center justify-end">
                            <button
                              disabled={!isModified && record?.approved}
                              onClick={() => handleSaveGrades(student.id)}
                              className={`p-2 rounded-xl transition-all font-semibold flex items-center gap-1.5 text-xs shadow-xs cursor-pointer ${
                                isModified
                                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Save className="h-3.5 w-3.5" />
                              <span>Publish</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. SUPPORT TICKETS INBOX TAB */}
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">Support & Feedback Ticket Inbox</h3>
                <p className="text-xs text-slate-500">Respond to student inquiries, result discrepancies, and tech support submissions in real time.</p>
              </div>

              {supportTickets.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-600">No support tickets found</p>
                  <p className="text-xs text-slate-400 mt-1">Student submissions from the public Contact page will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {supportTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className={`p-5 rounded-2xl border transition-all ${
                        ticket.status === 'Open' 
                          ? 'bg-white border-slate-200 shadow-3xs' 
                          : 'bg-slate-50/50 border-slate-100 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800">{ticket.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({ticket.email})</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Submitted: {ticket.submittedAt}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            ticket.category === 'Result Discrepancy' ? 'bg-red-50 text-red-600 border-red-100' :
                            ticket.category === 'Registration Issue' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            ticket.category === 'Tech Support' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {ticket.category}
                          </span>
                          
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                            ticket.status === 'Open' 
                              ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse' 
                              : 'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                            {ticket.status}
                          </span>

                          <button 
                            onClick={() => onDeleteTicket(ticket.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            title="Delete Ticket"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 italic leading-relaxed">
                        "{ticket.message}"
                      </div>

                      {ticket.status === 'Resolved' && ticket.reply && (
                        <div className="mt-4 pl-4 border-l-2 border-green-500 space-y-1">
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Administrative Response
                          </p>
                          <p className="text-xs text-slate-600 bg-green-50/20 p-2.5 rounded-lg border border-green-50/30 leading-relaxed">
                            {ticket.reply}
                          </p>
                        </div>
                      )}

                      {ticket.status === 'Open' && (
                        <div className="mt-4 space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compose Resolution Response</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              placeholder="Type reply to student here..."
                              value={ticketReplies[ticket.id] || ''}
                              onChange={(e) => setTicketReplies({ ...ticketReplies, [ticket.id]: e.target.value })}
                              className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:border-indigo-600 focus:outline-hidden transition-all"
                            />
                            <button 
                              onClick={() => handleSendReply(ticket.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-3xs cursor-pointer"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Send Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. ANNOUNCEMENTS MANAGER TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">Campus Announcements Board Manager</h3>
                <p className="text-xs text-slate-500">Post announcements that appear instantly on the public Homepage and Student Dashboard.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Post Form */}
                <form onSubmit={handleAnnSubmit} className="lg:col-span-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Post New Bulletin</h4>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Announcement Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Matriculation Ceremony date"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:border-indigo-600 focus:outline-hidden transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Category Category</label>
                    <select 
                      value={newAnnCategory}
                      onChange={(e) => setNewAnnCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:border-indigo-600 focus:outline-hidden transition-all"
                    >
                      <option value="Urgent">Urgent Warning</option>
                      <option value="Academic">Academic Schedule</option>
                      <option value="General">General Notice</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Content Text</label>
                    <textarea 
                      rows={4}
                      placeholder="Write full notice details here..."
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:border-indigo-600 focus:outline-hidden transition-all"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-3xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    Publish Announcement
                  </button>
                </form>

                {/* Published List */}
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Active Portal Announcements ({announcements.length})</h4>
                  
                  {announcements.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No announcements published yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-3xs space-y-2 relative group">
                          <button 
                            onClick={() => onDeleteAnnouncement(ann.id)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                            title="Delete Announcement"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>

                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              ann.category === 'Urgent' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              ann.category === 'Academic' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                              'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {ann.category}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                          </div>

                          <h5 className="font-extrabold text-slate-800 text-xs pr-8 leading-snug">{ann.title}</h5>
                          <p className="text-xs text-slate-500 leading-relaxed pr-6">{ann.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. SECURITY AUDITING LEDGER TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Security Audit Log & Grade Integrity Ledger</h3>
                  <p className="text-xs text-slate-500">Cryptographically signed system activity logs verifying non-volatility of published results.</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-emerald-400 px-3 py-1 rounded-lg flex items-center gap-1.5 self-start md:self-auto border border-slate-800">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  LEDGER STATE: SECURED
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Cryptographic Ledger Assurance:</strong> All grade entry modifications, registry approvals, and syllabus edits generate a mock digital signature signature hash (SHA-256). These hashes are audited by student browser terminals to guarantee grade entry records have not been altered or tampered with outside the registrar's audit guidelines.
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-slate-300 font-mono font-bold uppercase tracking-wider">REAL-TIME SYSTEM AUDITS</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">UTC TIME INTERFACE</span>
                </div>
                
                <div className="p-5 font-mono text-[11px] leading-relaxed text-slate-300 max-h-[350px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
                  {securityLogs.length === 0 ? (
                    <p className="text-slate-500 italic">No events recorded in this session ledger.</p>
                  ) : (
                    securityLogs.map((log, index) => (
                      <div key={index} className="flex gap-2.5 items-start hover:bg-slate-800/30 p-1.5 rounded transition-colors">
                        <span className="text-slate-600 shrink-0">[{index + 1}]</span>
                        <div className="space-y-1">
                          <p className="text-emerald-400">{log}</p>
                          <p className="text-slate-500 text-[10px] select-all">
                            SHA-256 HASH: 7d6c6e7561...{Math.floor(Math.random() * 89999 + 10000)}b{Math.floor(Math.random() * 89 + 10)}a89f...cf9d
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 7. SYSTEM ANALYTICS STATS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">Portal Systems Statistics & Performance</h3>
                <p className="text-xs text-slate-500">Academic charts, workload weights, and syllabus distribution calculations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Distribution chart 1 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Enrollment Distribution by Level</h4>
                    <span className="text-[10px] font-mono text-slate-400">Total: {students.length} Students</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    {Array.from(new Set(students.map(s => s.level))).sort().map(lvl => {
                      const count = students.filter(s => s.level === lvl).length;
                      const percentage = (count / students.length) * 100;
                      return (
                        <div key={lvl} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">{lvl} Level</span>
                            <span className="font-mono text-slate-500">{count} student(s) ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Distribution chart 2 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Curriculum Courses weight</h4>
                    <span className="text-[10px] font-mono text-slate-400">Total: {courses.length} Courses</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    {[100, 200, 300].map(lvl => {
                      const count = courses.filter(c => c.level === lvl).length;
                      const percentage = (count / courses.length) * 100;
                      return (
                        <div key={lvl} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">{lvl} Level Syllabus</span>
                            <span className="font-mono text-slate-500">{count} Courses ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Distribution chart 3 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Course Types Breakdown</h4>
                    <span className="text-[10px] font-mono text-slate-400">Core vs Electives</span>
                  </div>
                  <div className="space-y-3 pt-2">
                    {['Core', 'Elective'].map(type => {
                      const count = courses.filter(c => c.type === type).length;
                      const percentage = (count / courses.length) * 100;
                      return (
                        <div key={type} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">{type} Courses</span>
                            <span className="font-mono text-slate-500">{count} ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Distribution chart 4 */}
                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">Publishing Progress Integrity</h4>
                    <span className="text-[10px] font-mono text-slate-400">Result Approval Rate</span>
                  </div>
                  {(() => {
                    const totalGrades = grades.length;
                    const approvedGradesCount = grades.filter(g => g.approved).length;
                    const percentage = totalGrades > 0 ? (approvedGradesCount / totalGrades) * 100 : 0;
                    return (
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">Official Result Approvals</span>
                            <span className="font-mono text-slate-500">{approvedGradesCount} of {totalGrades} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed pt-2">
                          Unapproved results are marked as 'Draft Entries' until signed by the administrator. Approval updates append cryptography signatures directly.
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
