import React, { useState, useEffect } from 'react';
import { Course, Student } from '../types';
import { 
  CheckSquare, 
  Square, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  Printer, 
  HelpCircle, 
  ChevronRight, 
  BookMarked,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

interface CourseRegistrationProps {
  student: Student;
  allCourses: Course[];
  onUpdateRegistration: (courseCodes: string[]) => void;
  onOpenSlip: (type: 'registration' | 'result', semesterId: string) => void;
}

export default function CourseRegistration({
  student,
  allCourses,
  onUpdateRegistration,
  onOpenSlip,
}: CourseRegistrationProps) {
  // Filter courses for student level & first semester
  const availableCourses = allCourses.filter(
    (c) => c.level === student.level && c.semester === 1
  );

  // Core courses that are mandatory
  const coreCourses = availableCourses.filter((c) => c.type === 'Core');

  // Initialize selection
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Set default selection to include all core courses on load
  useEffect(() => {
    if (student.registeredCourses.length > 0) {
      setSelectedCodes(student.registeredCourses);
    } else {
      setSelectedCodes(coreCourses.map((c) => c.code));
    }
  }, [student, allCourses]);

  const toggleCourse = (code: string) => {
    const course = availableCourses.find((c) => c.code === code);
    if (!course) return;

    if (course.type === 'Core' && !student.registeredCourses.length) {
      // Don't allow toggling off CORE courses initially, they are mandatory!
      setErrorMsg(`Course ${code} is a Core Departmental Course and is mandatory.`);
      setTimeout(() => setErrorMsg(null), 4000);
      return;
    }

    if (selectedCodes.includes(code)) {
      // Remove
      setSelectedCodes(selectedCodes.filter((c) => c !== code));
    } else {
      // Add
      const totalCredits = calculateSelectedCredits([...selectedCodes, code]);
      if (totalCredits > 24) {
        setErrorMsg('Academic Constraint: Total credits cannot exceed 24 credit units.');
        setTimeout(() => setErrorMsg(null), 4000);
        return;
      }
      setSelectedCodes([...selectedCodes, code]);
    }
  };

  const calculateSelectedCredits = (codes: string[]) => {
    return availableCourses
      .filter((c) => codes.includes(c.code))
      .reduce((sum, c) => sum + c.creditUnits, 0);
  };

  const currentCredits = calculateSelectedCredits(selectedCodes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const missingCore = coreCourses.filter((c) => !selectedCodes.includes(c.code));
    if (missingCore.length > 0) {
      setErrorMsg(`Validation Error: You must register all core courses. Missing: ${missingCore.map(c => c.code).join(', ')}`);
      return;
    }

    if (currentCredits < 12) {
      setErrorMsg('Validation Error: You must register for a minimum of 12 credit units.');
      return;
    }

    if (currentCredits > 24) {
      setErrorMsg('Validation Error: Maximum allowed credit units is 24.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onUpdateRegistration(selectedCodes);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  // If already registered and approved
  const hasRegistered = student.registeredCourses.length > 0;

  return (
    <div className="space-y-6">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Online Course Registration</h2>
          <p className="text-sm text-slate-500 mt-1">
            Complete your official academic registry for the 2025/2026 First Semester.
          </p>
        </div>
        {hasRegistered && (
          <button
            onClick={() => onOpenSlip('registration', '300-1')}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            View Registration Slip
          </button>
        )}
      </div>

      {hasRegistered && !isSuccess ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xs text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">Course Registration Completed!</h3>
            <p className="text-sm text-slate-500">
              Your registered courses are locked in. You are registered for{' '}
              <strong className="text-slate-700">{student.registeredCourses.length} courses</strong> ({currentCredits} Credits).
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-xs text-slate-600 text-left border border-slate-100/80 space-y-1.5 font-sans">
            <p className="font-semibold text-slate-800 flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-slate-500" />
              Registration Summary:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1 text-slate-500">
              {availableCourses
                .filter((c) => student.registeredCourses.includes(c.code))
                .map((c) => (
                  <li key={c.code}>
                    <strong>{c.code}</strong> &mdash; {c.title} ({c.creditUnits} Units)
                  </li>
                ))}
            </ul>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenSlip('registration', '300-1')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Print / Save Slip
            </button>
            <button
              onClick={() => {
                // Allow resetting for presentation purposes
                if (window.confirm('Do you want to clear your current registration and start over?')) {
                  onUpdateRegistration([]);
                }
              }}
              className="bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Reset & Reregister
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Selected list & constraints */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Offered Courses ({availableCourses.length})</h3>
                    <p className="text-xs text-slate-500">Select electives and confirm core subjects</p>
                  </div>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Level {student.level} - Semester 1
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {availableCourses.map((course) => {
                    const isSelected = selectedCodes.includes(course.code);
                    const isCore = course.type === 'Core';

                    return (
                      <div
                        key={course.code}
                        onClick={() => toggleCourse(course.code)}
                        className={`p-5 flex items-start gap-4 transition-all cursor-pointer hover:bg-slate-50/50 select-none ${
                          isSelected ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        <div className="mt-1 flex-shrink-0">
                          {isSelected ? (
                            <CheckSquare className="h-5 w-5 text-indigo-600" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm">{course.title}</h4>
                            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {course.code}
                            </span>
                            {isCore ? (
                              <span className="text-[10px] uppercase font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                Core (Mandatory)
                              </span>
                            ) : (
                              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                Elective
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                          <p className="text-[11px] font-semibold text-slate-400">
                            Credit Units: <strong className="text-slate-700">{course.creditUnits}</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Error Box */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs">Registration Rules Violated</h5>
                    <p className="text-xs text-rose-600 mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              {/* Action */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCodes(coreCourses.map((c) => c.code))}
                  className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Reset Selection
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Encrypting & Registering...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Registry
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Summary Box */}
          <div className="lg:col-span-4 space-y-6">
            {/* Real-time Workload Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-6 sticky top-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Course Load Calculator</h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time credit unit checker</p>
              </div>

              {/* Credit Tracker Visual */}
              <div className="space-y-2">
                <div className="flex justify-between items-baseline text-xs text-slate-500 font-medium">
                  <span>Selected Workload</span>
                  <span>
                    <strong className="text-slate-800 text-lg font-mono font-extrabold">{currentCredits}</strong>{' '}
                    / 24 credits
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      currentCredits > 24
                        ? 'bg-rose-500'
                        : currentCredits >= 18
                        ? 'bg-emerald-500'
                        : currentCredits >= 12
                        ? 'bg-indigo-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min((currentCredits / 24) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Constraint List */}
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Rules</p>
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentCredits >= 12 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span>Minimum units: <strong>12 credits</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentCredits <= 24 && currentCredits > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span>Maximum units: <strong>24 credits</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Check if all cores are in selectedCodes */}
                    {coreCourses.every((c) => selectedCodes.includes(c.code)) ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    )}
                    <span>Compulsory cores registered</span>
                  </div>
                </div>
              </div>

              {/* Selected breakdown list */}
              {selectedCodes.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workload Breakdown</p>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {availableCourses
                      .filter((c) => selectedCodes.includes(c.code))
                      .map((c) => (
                        <div key={c.code} className="flex items-center justify-between text-xs text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                          <span className="font-mono font-bold text-slate-800">{c.code}</span>
                          <span className="truncate max-w-[120px] font-medium text-slate-600">{c.title}</span>
                          <span className="font-mono text-slate-400 font-semibold">{c.creditUnits} U</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
