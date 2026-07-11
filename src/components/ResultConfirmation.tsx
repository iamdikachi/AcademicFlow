import React, { useState } from 'react';
import { Course, Student, GradeRecord } from '../types';
import { 
  GraduationCap, 
  Calendar, 
  Printer, 
  Search, 
  BookOpen, 
  TrendingUp, 
  Award,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle,
  Loader,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

interface ResultConfirmationProps {
  student: Student;
  allCourses: Course[];
  grades: GradeRecord[];
  onOpenSlip: (type: 'registration' | 'result', semesterId: string) => void;
  confirmedResults: {[key: string]: {confirmedAt: string, signedName: string}};
  onConfirmResults: (semesterId: string, signedName: string) => void;
  onSeedDemoGrades?: (studentId: string, semesterId: string) => void;
}

export default function ResultConfirmation({
  student,
  allCourses,
  grades,
  onOpenSlip,
  confirmedResults,
  onConfirmResults,
  onSeedDemoGrades,
}: ResultConfirmationProps) {
  // Let's declare the standard semesters available in the system
  const semesterOptions = [
    { id: '100-1', name: '100 Level - First Semester' },
    { id: '100-2', name: '100 Level - Second Semester' },
    { id: '200-1', name: '200 Level - First Semester' },
    { id: '200-2', name: '200 Level - Second Semester' },
    { id: '300-1', name: '300 Level - First Semester' },
  ];

  const [selectedSemester, setSelectedSemester] = useState(() => {
    const studentSem = `${student.level}-1`;
    return semesterOptions.some(opt => opt.id === studentSem) ? studentSem : '100-1';
  });
  const [isSearching, setIsSearching] = useState(false);
  const [signatureInput, setSignatureInput] = useState('');

  const confirmationKey = `${student.id}_${selectedSemester}`;
  const confirmationDetails = confirmedResults[confirmationKey];
  const isConfirmed = !!confirmationDetails;

  const activeSemesterOpt = semesterOptions.find(s => s.id === selectedSemester);

  // Filter student grades for selected semester
  const semesterGrades = grades.filter(
    (g) => g.studentId === student.id && g.semesterId === selectedSemester
  );

  // Filter APPROVED grades for GPA calculations
  const approvedGrades = semesterGrades.filter(g => g.approved);
  const unapprovedCount = semesterGrades.length - approvedGrades.length;

  // Perform GPA calculations
  let totalCreditsRegistered = 0;
  let totalCreditsPassed = 0;
  let totalGPPoints = 0;

  approvedGrades.forEach((g) => {
    const course = allCourses.find((c) => c.code === g.courseCode);
    if (course) {
      totalCreditsRegistered += course.creditUnits;
      if (g.grade !== 'F') {
        totalCreditsPassed += course.creditUnits;
      }
      totalGPPoints += g.gradePoint * course.creditUnits;
    }
  });

  const gpa = totalCreditsRegistered > 0 ? Number((totalGPPoints / totalCreditsRegistered).toFixed(2)) : 0;

  // Let's compute CGPA (all approved grades in history up to current selected level/semester)
  const allApprovedGrades = grades.filter(
    (g) => g.studentId === student.id && g.approved
  );

  let cumulativeGPPoints = 0;
  let cumulativeCredits = 0;

  allApprovedGrades.forEach((g) => {
    const course = allCourses.find((c) => c.code === g.courseCode);
    if (course) {
      cumulativeGPPoints += g.gradePoint * course.creditUnits;
      cumulativeCredits += course.creditUnits;
    }
  });

  const cgpa = cumulativeCredits > 0 ? Number((cumulativeGPPoints / cumulativeCredits).toFixed(2)) : 0;

  // Get status text
  const getAcademicStatus = (gpaValue: number) => {
    if (gpaValue >= 4.5) return { text: 'First Class Outstanding', color: 'text-emerald-700 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' };
    if (gpaValue >= 3.5) return { text: 'Second Class Upper Division', color: 'text-indigo-700 bg-indigo-50 border-indigo-100', dot: 'bg-indigo-500' };
    if (gpaValue >= 2.4) return { text: 'Second Class Lower Division', color: 'text-slate-700 bg-slate-50 border-slate-100', dot: 'bg-slate-500' };
    if (gpaValue >= 1.5) return { text: 'Third Class Standing', color: 'text-amber-700 bg-amber-50 border-amber-100', dot: 'bg-amber-500' };
    return { text: 'Academic Probation Warning', color: 'text-rose-700 bg-rose-50 border-rose-100', dot: 'bg-rose-500 animate-pulse' };
  };

  const status = getAcademicStatus(cgpa);

  const handleSearchChange = (semId: string) => {
    setIsSearching(true);
    setSelectedSemester(semId);
    setTimeout(() => {
      setIsSearching(false);
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 font-sans">Academic Result Portal</h2>
          <p className="text-sm text-slate-500 mt-1">
            Confirm and print your secure end-of-semester statements and GPA transcripts. <span className="text-indigo-600 font-semibold">(To save as PDF, click print and select 'Save as PDF' as your destination)</span>
          </p>
        </div>
        {approvedGrades.length > 0 && (
          <button
            onClick={() => onOpenSlip('result', selectedSemester)}
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm px-4.5 py-3 rounded-xl transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
          >
            <Printer className="h-4.5 w-4.5" />
            Print Result / Save PDF
          </button>
        )}
      </div>

      {/* Sandbox helper for new student profiles with no released results */}
      {approvedGrades.length === 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-3xs">
          <div className="space-y-1.5 max-w-2xl text-xs">
            <span className="font-extrabold text-[10px] text-indigo-600 bg-indigo-100/50 border border-indigo-200/40 px-2.5 py-1 rounded-full uppercase tracking-wider block w-max">
              Fresh Student Profile Sandbox Helper
            </span>
            <h3 className="font-black text-slate-900 text-sm">
              No Published results for {activeSemesterOpt?.name || selectedSemester} yet
            </h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              Since you registered a brand new account, your semester course registration is either pending or does not have approved results published yet. You can release results in two ways:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-500 font-semibold mt-2">
              <li>Log in as an <strong>Administrator</strong> (access password is <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">admin</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-mono">1234</code>) to approve registrations and sign off on student grades.</li>
              <li>Or click the button on the right to <strong>Auto-Publish Demo Results</strong> for this semester immediately so you can test result sign-off, GPA transcripts, and printing!</li>
            </ul>
          </div>
          {onSeedDemoGrades && (
            <button
              type="button"
              onClick={() => onSeedDemoGrades(student.id, selectedSemester)}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3.5 rounded-2xl transition-all shadow-sm cursor-pointer hover:scale-[1.02] shrink-0 self-start md:self-auto"
            >
              <Award className="h-4.5 w-4.5 text-amber-300 animate-pulse" />
              Auto-Publish Demo Results
            </button>
          )}
        </div>
      )}

      {/* Selector and Standing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Semester selector */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 space-y-4">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Academic Term
          </label>
          <div className="space-y-2">
            {semesterOptions.map((sem) => {
              const isActive = selectedSemester === sem.id;
              // Check how many grades we have for this semester
              const courseCount = grades.filter(g => g.studentId === student.id && g.semesterId === sem.id).length;
              
              return (
                <button
                  key={sem.id}
                  onClick={() => handleSearchChange(sem.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className={`h-4 w-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{sem.name}</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {courseCount} {courseCount === 1 ? 'course' : 'courses'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Cumulative Stats Banner */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1 md:border-r border-slate-50 md:pr-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Semester GPA</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {isSearching ? '...' : gpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.00</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Based on {totalCreditsRegistered} credit units passed.</p>
          </div>

          <div className="space-y-1 md:border-r border-slate-50 md:px-4">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Cumulative CGPA</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">
                {isSearching ? '...' : cgpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 5.00</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">All sessions combined overall grade index.</p>
          </div>

          <div className="space-y-2 md:pl-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">Academic Standing</span>
            <div className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-semibold ${status.color}`}>
              <div className={`w-2 h-2 rounded-full ${status.dot}`}></div>
              <span className="truncate">{status.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              Statement of Results: {activeSemesterOpt?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">End-of-term transcript of continuous assessment and exam grades</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isConfirmed ? (
              <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-150 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-3xs">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 animate-bounce" />
                <div className="leading-tight">
                  <span className="block font-extrabold text-[10px] uppercase text-emerald-650">Digitally Confirmed & Signed</span>
                  <span className="text-[9px] font-mono text-slate-450">Sig: {confirmationDetails.signedName} ({confirmationDetails.confirmedAt.split(',')[0]})</span>
                </div>
              </div>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                Pending Student Confirmation
              </span>
            )}

            {approvedGrades.length > 0 && (
              <button
                type="button"
                onClick={() => onOpenSlip('result', selectedSemester)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-3xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print / Save PDF</span>
              </button>
            )}
          </div>
        </div>

        {isSearching ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader className="h-8 w-8 animate-spin text-slate-400" />
            <span className="text-xs font-medium">Securing connection & compiling transcript...</span>
          </div>
        ) : semesterGrades.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-800 text-sm">No Academic Results Registered</h4>
              <p className="text-xs text-slate-500">
                You do not have any registered courses or approved results for this semester ID ({selectedSemester}).
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {unapprovedCount > 0 && (
              <div className="bg-amber-50 border-b border-amber-100 text-amber-800 p-3.5 px-5 flex items-start gap-2.5 text-xs">
                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Result Notice:</strong> There is {unapprovedCount} course score pending admin verification & release. GPA computation excludes unreleased courses.
                </div>
              </div>
            )}
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/60 text-slate-500 border-b border-slate-100 font-semibold">
                  <th className="py-3.5 px-5 w-24">Course Code</th>
                  <th className="py-3.5 px-5">Course Title</th>
                  <th className="py-3.5 px-5 w-20 text-center">Credits</th>
                  <th className="py-3.5 px-5 w-20 text-center">CA (40)</th>
                  <th className="py-3.5 px-5 w-20 text-center">Exam (60)</th>
                  <th className="py-3.5 px-5 w-24 text-center">Total Score</th>
                  <th className="py-3.5 px-5 w-20 text-center">Grade</th>
                  <th className="py-3.5 px-5 w-20 text-center">GP</th>
                  <th className="py-3.5 px-5 w-32 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {semesterGrades.map((g) => {
                  const course = allCourses.find((c) => c.code === g.courseCode);
                  if (!course) return null;

                  return (
                    <tr key={g.courseCode} className="hover:bg-slate-50/30 transition-all">
                      <td className="py-4 px-5 font-mono font-bold text-slate-800">{g.courseCode}</td>
                      <td className="py-4 px-5">
                        <div className="font-semibold text-slate-700">{course.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 capitalize">{course.type} Departmental course</div>
                      </td>
                      <td className="py-4 px-5 text-center font-mono font-bold text-slate-600">{course.creditUnits}</td>
                      <td className="py-4 px-5 text-center font-mono text-slate-500">{g.approved ? g.caScore : '-'}</td>
                      <td className="py-4 px-5 text-center font-mono text-slate-500">{g.approved ? g.examScore : '-'}</td>
                      <td className="py-4 px-5 text-center font-mono font-extrabold text-slate-800">{g.approved ? g.totalScore : '-'}</td>
                      <td className="py-4 px-5 text-center">
                        {g.approved ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            g.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                            g.grade === 'B' ? 'bg-indigo-100 text-indigo-800' :
                            g.grade === 'C' ? 'bg-sky-100 text-sky-800' :
                            g.grade === 'D' ? 'bg-amber-100 text-amber-800' :
                            g.grade === 'E' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {g.grade}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-center font-mono font-bold text-slate-600">
                        {g.approved ? g.gradePoint : '-'}
                      </td>
                      <td className="py-4 px-5 text-center">
                        {g.approved ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium text-[10px]">
                            <CheckCircle className="h-2.5 w-2.5" />
                            Released
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium text-[10px] animate-pulse">
                            <Clock className="h-2.5 w-2.5" />
                            Awaiting Approval
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {semesterGrades.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-650 flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Official Academic Sign-off & Confirmation Receipt</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Under Senate Regulation Sec. 48, students are required to authenticate and confirm the accuracy of their released semester grade statements. Once locked, this ledger creates a permanent tamper-proof record of verification.
              </p>
            </div>
          </div>

          {isConfirmed ? (
            <div className="bg-emerald-50/50 border border-emerald-150 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/60 pb-3">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-650" />
                  Academic Transcript Digitally Signed & Confirmed
                </span>
                <span className="font-mono text-[9px] bg-emerald-100/70 text-emerald-800 px-2.5 py-1 rounded-full font-bold">
                  VERIFIED-LEDGER-{student.id}-{selectedSemester}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-450 block">Signatory Name</span>
                  <span className="font-extrabold text-slate-800 text-sm">{confirmationDetails.signedName}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-450 block">Verification Timestamp</span>
                  <span className="font-mono text-slate-700 text-xs">{confirmationDetails.confirmedAt}</span>
                </div>
              </div>

              <div className="pt-3.5 mt-2 border-t border-emerald-100/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-emerald-700 font-semibold leading-relaxed">
                  Verification permanently locked. You can now download your digital signed transcript or print a copy.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenSlip('result', selectedSemester)}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] cursor-pointer shrink-0"
                >
                  <Printer className="h-4 w-4" />
                  Print / Save PDF Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                By entering your name below, you confirm that you have reviewed your grades, including Continuous Assessment (CA) and Examinations, and found them correct. This will record a digital validation signature in the institution security log.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                <div className="flex-1 w-full space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Type Your Full Name to Sign</label>
                  <input
                    type="text"
                    value={signatureInput}
                    onChange={(e) => setSignatureInput(e.target.value)}
                    placeholder={student.name}
                    className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2 text-xs font-medium outline-hidden text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  disabled={!signatureInput.trim()}
                  onClick={() => {
                    onConfirmResults(selectedSemester, signatureInput);
                    setSignatureInput('');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex-shrink-0"
                >
                  Authenticate & Confirm Grades
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grading Key and CGPA Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GPA Formula Explanation */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3.5">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <TrendingUp className="h-4 w-4 text-slate-500" />
            GPA Computation Methodology
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Grade Point Average (GPA) is computed by multiplying the credit unit of each course by the grade point earned, summing these products (Quality Points), and dividing by the total credit units registered for the semester:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-[11px] text-slate-600 flex justify-center text-center leading-relaxed">
            GPA = &Sigma;(Credit Units &times; Grade Points) / &Sigma;(Total Credit Units)
          </div>
          <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
            <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span>Under university guidelines, courses with F grades are included in the GPA divisor, which penalizes performance until the course is cleared.</span>
          </div>
        </div>

        {/* Official Grading Key / Legend */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3">
          <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
            <Award className="h-4 w-4 text-slate-500" />
            Standard Academic Grading Scale
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center justify-between p-2 bg-emerald-50 text-emerald-800 rounded-lg font-medium">
              <span>A (70 - 100%)</span>
              <span className="font-bold">5.0 Points</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-indigo-50 text-indigo-800 rounded-lg font-medium">
              <span>B (60 - 69%)</span>
              <span className="font-bold">4.0 Points</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-sky-50 text-sky-800 rounded-lg font-medium">
              <span>C (50 - 59%)</span>
              <span className="font-bold">3.0 Points</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-amber-50 text-amber-800 rounded-lg font-medium">
              <span>D (45 - 49%)</span>
              <span className="font-bold">2.0 Points</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-amber-50/50 text-amber-700 rounded-lg font-medium">
              <span>E (40 - 44%)</span>
              <span className="font-bold">1.0 Points</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-rose-50 text-rose-800 rounded-lg font-medium">
              <span>F (0 - 39%)</span>
              <span className="font-bold">0.0 Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
