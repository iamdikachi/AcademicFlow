import React from 'react';
import { Course, Student, GradeRecord } from '../types';
import { Printer, X, ShieldAlert, CheckCircle, Award, FileSpreadsheet, Sparkles } from 'lucide-react';

interface PrintSlipProps {
  student: Student;
  allCourses: Course[];
  grades: GradeRecord[];
  type: 'registration' | 'result';
  semesterId: string;
  semesterName: string;
  onClose: () => void;
}

export default function PrintSlip({
  student,
  allCourses,
  grades,
  type,
  semesterId,
  semesterName,
  onClose,
}: PrintSlipProps) {
  const currentLevelCourses = allCourses.filter(
    (c) => student.registeredCourses.includes(c.code)
  );

  const registeredCourseDetails = type === 'registration' 
    ? currentLevelCourses 
    : allCourses.filter(c => grades.some(g => g.courseCode === c.code && g.semesterId === semesterId));

  // Calculate stats for result
  const semesterGrades = grades.filter(
    (g) => g.studentId === student.id && g.semesterId === semesterId && g.approved
  );

  let totalCredits = 0;
  let totalGradePoints = 0;
  let gpa = 0;

  if (type === 'result') {
    semesterGrades.forEach((g) => {
      const course = allCourses.find((c) => c.code === g.courseCode);
      if (course) {
        totalCredits += course.creditUnits;
        totalGradePoints += g.gradePoint * course.creditUnits;
      }
    });
    gpa = totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
  } else {
    totalCredits = registeredCourseDetails.reduce((sum, c) => sum + c.creditUnits, 0);
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden my-8 no-print border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Controls Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                {type === 'registration' ? 'Course Registration Slip' : 'Academic Result Transcript'}
              </h3>
              <p className="text-xs text-slate-500">Official Academic Document Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Paper Document Wrapper */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 flex justify-center">
          <div 
            id="printable-slip"
            className="w-full max-w-[794px] bg-white border border-slate-200 p-10 shadow-lg text-slate-900 font-serif relative"
            style={{ minHeight: '1000px' }}
          >
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Award className="w-[450px] h-[450px] text-slate-900" />
            </div>

            {/* University Letterhead */}
            <div className="flex flex-col items-center text-center border-b-2 border-double border-slate-800 pb-6 relative z-10">
              <div className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center font-sans font-bold text-2xl tracking-widest border-2 border-slate-800 shadow-sm mb-3">
                AU
              </div>
              <h1 className="text-2xl font-bold tracking-wide uppercase font-sans text-slate-900">
                APEX UNIVERSITY, NIGERIA
              </h1>
              <p className="text-xs tracking-widest font-sans uppercase text-slate-600 mt-1">
                Office of the Registrar &middot; Academic Records Division
              </p>
              <p className="text-[11px] italic font-sans text-slate-400 mt-0.5">
                P.M.B. 1042, University Road, Lagos &bull; www.apex.edu.ng
              </p>
            </div>

            {/* Document Title Bar */}
            <div className="my-6 py-2 bg-slate-50 border-y border-slate-800 text-center relative z-10">
              <h2 className="text-lg font-bold font-sans uppercase tracking-widest text-slate-800">
                {type === 'registration' ? 'OFFICIAL COURSE REGISTRATION SLIP' : 'SEMESTER STATEMENT OF RESULTS'}
              </h2>
              <p className="text-xs font-sans text-slate-500 mt-0.5 font-medium">
                ACADEMIC SESSION: {semesterName}
              </p>
            </div>

            {/* Student Biodata Profile Table */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 font-sans text-sm relative z-10">
              <div className="md:col-span-9 grid grid-cols-2 gap-y-3 gap-x-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Student Name</span>
                  <span className="font-semibold text-slate-800 text-base">{student.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Matriculation Number</span>
                  <span className="font-semibold text-slate-800 text-base font-mono">{student.matricNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Faculty / School</span>
                  <span className="font-medium text-slate-700">Science & Technology</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Department</span>
                  <span className="font-medium text-slate-700">{student.department}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Academic Level</span>
                  <span className="font-medium text-slate-700">{student.level} Level</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Verified Student
                  </span>
                </div>
              </div>
              <div className="md:col-span-3 flex flex-col items-center justify-center border border-slate-200 p-2 rounded-lg bg-slate-50/50">
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-24 h-24 object-cover rounded border border-slate-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 flex items-center justify-center rounded border border-slate-300 font-bold text-slate-400 text-2xl font-sans">
                    {student.name.charAt(0)}
                  </div>
                )}
                <span className="text-[9px] font-mono text-slate-400 mt-2">PHOTO ID VERIFIED</span>
              </div>
            </div>

            {/* Main Table: Registered Courses or Graded Courses */}
            <div className="mb-8 relative z-10">
              <table className="w-full text-left border-collapse border border-slate-800 font-sans text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-800 text-slate-800">
                    <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-12 text-center">S/N</th>
                    <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-24">Course Code</th>
                    <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider">Course Title</th>
                    <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-16 text-center">Credits</th>
                    <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-16 text-center">Type</th>
                    {type === 'result' && (
                      <>
                        <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-12 text-center">CA</th>
                        <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-12 text-center">Exam</th>
                        <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-12 text-center">Total</th>
                        <th className="py-2 px-3 border-r border-slate-800 font-bold uppercase tracking-wider w-12 text-center">Grade</th>
                        <th className="py-2 px-3 font-bold uppercase tracking-wider w-10 text-center">GP</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {registeredCourseDetails.map((course, index) => {
                    const gradeRecord = type === 'result' 
                      ? semesterGrades.find(g => g.courseCode === course.code) 
                      : null;

                    return (
                      <tr key={course.code} className="border-b border-slate-800 hover:bg-slate-50/50">
                        <td className="py-2 px-3 border-r border-slate-800 text-center font-mono">{index + 1}</td>
                        <td className="py-2 px-3 border-r border-slate-800 font-mono font-bold text-slate-800">{course.code}</td>
                        <td className="py-2 px-3 border-r border-slate-800 font-medium text-slate-700">{course.title}</td>
                        <td className="py-2 px-3 border-r border-slate-800 text-center font-mono font-semibold">{course.creditUnits}</td>
                        <td className="py-2 px-3 border-r border-slate-800 text-center uppercase tracking-wider text-[10px] font-bold text-slate-500">{course.type}</td>
                        {type === 'result' && (
                          <>
                            <td className="py-2 px-3 border-r border-slate-800 text-center font-mono">{gradeRecord?.caScore ?? '-'}</td>
                            <td className="py-2 px-3 border-r border-slate-800 text-center font-mono">{gradeRecord?.examScore ?? '-'}</td>
                            <td className="py-2 px-3 border-r border-slate-800 text-center font-mono font-bold">{gradeRecord?.totalScore ?? '-'}</td>
                            <td className="py-2 px-3 border-r border-slate-800 text-center font-bold text-slate-800">{gradeRecord?.grade ?? 'N/A'}</td>
                            <td className="py-2 px-3 text-center font-mono font-bold">{gradeRecord?.gradePoint ?? '0'}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 border-t border-slate-800 font-bold text-slate-800">
                    <td colSpan={3} className="py-3 px-3 border-r border-slate-800 text-right uppercase tracking-wider">Total Credit Units Registered:</td>
                    <td className="py-3 px-3 border-r border-slate-800 text-center font-mono text-sm">{totalCredits}</td>
                    <td colSpan={type === 'result' ? 6 : 1} className="py-3 px-3 text-right">
                      {type === 'result' && (
                        <div className="flex items-center justify-end gap-2 text-sm font-bold">
                          <span className="uppercase tracking-wider">GPA:</span>
                          <span className="bg-slate-900 text-white px-2 py-0.5 rounded font-mono text-xs">{gpa.toFixed(2)}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Authentication Stamp & Seal Area */}
            <div className="grid grid-cols-2 gap-8 mt-12 font-sans relative z-10">
              <div className="flex flex-col justify-end">
                <div className="h-10 w-24 border-b border-slate-600 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-sm font-semibold text-slate-500 opacity-80">Emeka.O</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold mt-1">Student Signature</span>
                <span className="text-[10px] text-slate-500">Date: {currentDateString}</span>
              </div>
              <div className="flex flex-col items-end justify-end text-right">
                <div className="h-10 flex flex-col items-center justify-center relative">
                  {/* Digital Signature Emblem */}
                  <div className="absolute -top-6 text-emerald-600/10 flex items-center justify-center font-bold font-serif italic text-2xl -rotate-12 border-2 border-dashed border-emerald-600/20 px-3 py-1 rounded">
                    APPROVED
                  </div>
                  <div className="w-36 border-b border-slate-600 flex items-end justify-center pb-1 font-serif italic text-sm text-slate-600 font-semibold">
                    Dr. J. A. Kolawole
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold mt-1">Academic Adviser / Coordinator</span>
                <span className="text-[9px] text-slate-400 mt-1 font-mono uppercase">System Verification Code: APX-SEC-{(student.id + semesterId).toUpperCase()}</span>
              </div>
            </div>

            {/* Decorative Footer */}
            <div className="mt-16 pt-4 border-t border-slate-300 flex justify-between text-[10px] font-sans text-slate-400 relative z-10">
              <span>Apex Academic Portal v4.1.2</span>
              <span className="italic">This is a system generated document certified by the Academic Board.</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actual Print Styles Injected */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-slip {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
