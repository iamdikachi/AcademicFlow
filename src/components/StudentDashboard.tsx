import React from 'react';
import { Student, Course, GradeRecord } from '../types';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Printer, 
  FileText,
  TrendingUp,
  MapPin,
  Mail,
  ShieldCheck,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  student: Student;
  allCourses: Course[];
  grades: GradeRecord[];
  onNavigate: (tab: string) => void;
  onOpenSlip: (type: 'registration' | 'result', semesterId: string) => void;
}

export default function StudentDashboard({
  student,
  allCourses,
  grades,
  onNavigate,
  onOpenSlip,
}: StudentDashboardProps) {
  // Calculate dynamic GPA/CGPA
  const studentGrades = grades.filter((g) => g.studentId === student.id && g.approved);
  
  // Dynamic calculation
  let totalGPPoints = 0;
  let totalGPAUnits = 0;

  studentGrades.forEach((g) => {
    const course = allCourses.find((c) => c.code === g.courseCode);
    if (course) {
      totalGPPoints += g.gradePoint * course.creditUnits;
      totalGPAUnits += course.creditUnits;
    }
  });

  const cgpa = totalGPAUnits > 0 ? Number((totalGPPoints / totalGPAUnits).toFixed(2)) : 0.0;

  // Let's get class of degree
  const getDegreeClass = (cgpaValue: number) => {
    if (cgpaValue >= 4.5) return 'First Class Honours';
    if (cgpaValue >= 3.5) return 'Second Class Honours (Upper Division)';
    if (cgpaValue >= 2.4) return 'Second Class Honours (Lower Division)';
    if (cgpaValue >= 1.5) return 'Third Class Honours';
    return 'Pass';
  };

  // Get current registered courses details
  const registeredDetails = allCourses.filter((c) =>
    student.registeredCourses.includes(c.code)
  );
  const registeredCredits = registeredDetails.reduce((sum, c) => sum + c.creditUnits, 0);

  // Status message
  const statusConfig = {
    'Not Registered': {
      bg: 'bg-rose-50 border-rose-100',
      text: 'text-rose-700',
      icon: <AlertCircle className="h-5 w-5 text-rose-600" />,
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      desc: 'You have not registered for courses this semester. Please complete your registration immediately.'
    },
    'Pending Approval': {
      bg: 'bg-amber-50 border-amber-100',
      text: 'text-amber-700',
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      desc: 'Your course registration is submitted and pending review by your level coordinator.'
    },
    'Approved': {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-700',
      icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      desc: 'Your course registration has been fully approved by the department. You are cleared for lectures.'
    }
  };

  const status = statusConfig[student.registrationStatus] || statusConfig['Not Registered'];

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="relative bg-white rounded-2xl p-6 md:p-8 text-slate-800 overflow-hidden shadow-xs border border-slate-200">
        <div className="relative flex flex-col md:flex-row items-center gap-6 z-10">
          <div className="relative">
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-24 h-24 object-cover rounded-2xl border border-slate-200 shadow-3xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-2xl border border-indigo-100 text-slate-800 font-bold text-3xl shadow-3xs">
                {student.name.charAt(0)}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-lg border-2 border-white shadow-3xs">
              <ShieldCheck className="h-4 w-4 text-white" />
            </span>
          </div>

          <div className="text-center md:text-left space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100 self-center md:self-auto">
                {student.level} Level
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border self-center md:self-auto ${status.badge}`}>
                {student.registrationStatus}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{student.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5 font-mono">
                <FileText className="h-4 w-4 text-slate-400" />
                {student.matricNumber}
              </span>
              <span className="hidden md:inline text-slate-300">&bull;</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                Department of {student.department}
              </span>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {student.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Semester: {student.currentSemester}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Banner Status */}
      <div className={`p-5 rounded-2xl border ${status.bg} flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs`}>
        <div className="flex gap-3">
          <div className="mt-0.5">{status.icon}</div>
          <div>
            <h4 className={`font-semibold text-sm ${status.text}`}>Course Registration Status: {student.registrationStatus}</h4>
            <p className="text-xs text-slate-600 mt-1">{status.desc}</p>
          </div>
        </div>
        <div>
          {student.registrationStatus === 'Not Registered' ? (
            <button
              onClick={() => onNavigate('registration')}
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              Start Course Registration
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => onOpenSlip('registration', '300-1')}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Course Slip
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic CGPA Ring Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Standing</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">Cumulative GPA</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-center gap-4 py-4">
            <div className="relative flex items-center justify-center">
              {/* Radial circle representation */}
              <svg className="w-16 h-16">
                <circle className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32"/>
                <circle className="text-emerald-500" strokeWidth="6" strokeDasharray={163.3} strokeDashoffset={163.3 - (cgpa / 5) * 163.3} strokeLinecap="round" stroke="currentColor" fill="transparent" r="26" cx="32" cy="32" transform="rotate(-90 32 32)"/>
              </svg>
              <span className="absolute text-sm font-extrabold font-mono text-slate-800">{cgpa.toFixed(2)}</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">Scale: 5.00</p>
              <p className="text-sm font-bold text-slate-700 mt-0.5">{getDegreeClass(cgpa)}</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('results')}
            className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-100 flex items-center justify-center gap-1 cursor-pointer"
          >
            Check Semester Results
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Course Registration overview card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">Current Workload</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>
          <div className="py-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">{registeredCredits}</span>
              <span className="text-slate-400 text-sm">/ 24 max credits</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered <strong className="text-slate-700">{student.registeredCourses.length}</strong> courses for {student.currentSemester}
            </p>
          </div>
          <button 
            onClick={() => onNavigate('registration')}
            className="w-full text-center py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all border border-slate-100 flex items-center justify-center gap-1 cursor-pointer"
          >
            {student.registrationStatus === 'Not Registered' ? 'Register Courses' : 'Modify Course List'}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick Help Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-50">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support Hub</p>
              <h3 className="text-xl font-bold text-slate-800 mt-1">Academic Calendar</h3>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="py-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
              <span>Reg Deadline: <strong>July 25, 2026</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
              <span>Mid-Term Exam: <strong>Aug 10, 2026</strong></span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span>Result Release: <strong>Sept 28, 2026</strong></span>
            </div>
          </div>
          <div className="pt-1.5 text-[11px] text-slate-400 border-t border-slate-50 flex items-center justify-between">
            <span>Dean\'s Office Helpdesk</span>
            <span className="font-mono text-slate-500">01-445-APEX</span>
          </div>
        </div>
      </div>

      {/* Course List Card if Registered */}
      {student.registeredCourses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Active Course Registrations</h3>
              <p className="text-xs text-slate-500">Approved courses for the ongoing academic term</p>
            </div>
            <button
              onClick={() => onOpenSlip('registration', '300-1')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Slip
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {registeredDetails.map((course) => (
              <div key={course.code} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 font-mono font-extrabold text-xs flex items-center justify-center border border-slate-100 shadow-3xs">
                    {course.code.split(' ')[1]}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{course.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-mono font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{course.code}</span>
                      <span>&bull;</span>
                      <span>{course.creditUnits} Units</span>
                      <span>&bull;</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{course.type}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-medium">Departmental core</span>
                  <div className="p-1 text-emerald-600 bg-emerald-50 rounded-full">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
