import React, { useState } from 'react';
import {
  X,
  FileDown,
  FileText,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Cpu,
  BarChart3,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { TaskDefinition } from '../types/scheduler';
import { generateProjectReportPDF } from '../utils/pdfReportGenerator';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskDefinition[];
  threadCount: number;
  timeQuantum: number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  tasks,
  threadCount,
  timeQuantum,
}) => {
  const [studentName, setStudentName] = useState('Girish Fartode');
  const [rollNumber, setRollNumber] = useState('CS-2026-OS-701');
  const [department, setDepartment] = useState('Department of Computer Science & Engineering');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(1);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    try {
      const doc = generateProjectReportPDF({
        studentName,
        rollNumber,
        department,
        tasks,
        threadCount,
        timeQuantum,
      });

      doc.save(`Multithreaded_Scheduler_OS_Report_7Pages.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const pagesInfo = [
    { page: 1, title: 'Title Page & Executive Abstract', desc: 'Academic Certificate, Course info & 250-word Abstract' },
    { page: 2, title: 'Chapter 1: Introduction & Problem Formulation', desc: 'Thread-per-request overhead vs Thread Pools, Objectives' },
    { page: 3, title: 'Chapter 2: System Architecture & Thread States', desc: 'Four-layer design, State transitions (IDLE to RUNNING), POSIX Protocol' },
    { page: 4, title: 'Chapter 3: Scheduling Policies & Math Formulas', desc: 'FCFS, Round Robin (q-slice), Priority, and Formulas (TAT, WT, Util)' },
    { page: 5, title: 'Chapter 4: Synchronization & Race Condition Guard', desc: 'Mutex locks, Condition variables, Spurious wakeup & POSIX C code' },
    { page: 6, title: 'Chapter 5: Live Experimental Results & Benchmark', desc: 'Benchmark table, comparative horizontal bar charts & findings' },
    { page: 7, title: 'Chapter 6: Conclusion, Viva Voce Q&A & References', desc: '5 Essential Viva questions with full answers & Textbook citations' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Academic Project Report (7-Page PDF)
              </h2>
              <p className="text-xs text-slate-400">
                Formal University/Laboratory Grade Documentation & Viva Voce Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-lg shadow-cyan-950/50 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download 7-Page PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Metadata Customization Banner */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Personalize Student / Laboratory Metadata (Included in PDF Title Page)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Candidate Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Roll / Register Number
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Department / University
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* 7-Page Architecture Table of Contents */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Report Table of Contents (7 Complete Pages)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
              {pagesInfo.map((p) => (
                <button
                  key={p.page}
                  onClick={() => setActiveTab(p.page)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    activeTab === p.page
                      ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      Page {p.page}
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight line-clamp-2 mt-1 text-slate-200">
                    {p.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Page Content Preview Box */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
            {activeTab === 1 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 1 of 7</span>
                  <span className="text-xs text-slate-400">Formal Title & Executive Abstract</span>
                </div>
                <h4 className="text-sm font-bold text-white">Title Page & Academic Metadata</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Contains formal university certification headers, course designations (CS301 Operating Systems Design), candidate registration details, and a high-density 250-word Executive Abstract synthesizing thread pool overhead reduction, POSIX mutex locks, and multi-policy scheduling results.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> Title Banner, Candidate Info Table, Evaluator Signature block, Executive Abstract.
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 2 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 1</span>
                </div>
                <h4 className="text-sm font-bold text-white">Introduction & Problem Formulation</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Explores the architectural trade-offs of modern multicore process scheduling. Contrasts the high overhead of the classic thread-per-request paradigm (kernel memory consumption, stack allocation, context switch thrashing) against the amortized efficiency of thread pools. Formulates the core challenges: shared queue contention, busy-waiting elimination, and parallel policy trade-offs.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 1.1 OS Background, 1.2 Thread Pool Solution, 1.3 Problem Statement, 1.4 Objectives & Scope.
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 3 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 2</span>
                </div>
                <h4 className="text-sm font-bold text-white">System Architecture & Thread Pool Design</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Decomposes the simulator into four decoupled architectural subsystems: Task Definition Layer, Shared Queue Critical Section, Worker Thread Pool Engine, and Telemetry/Gantt Visualizer. Includes a structured state transition matrix detailing the lifecycle of worker threads: IDLE → ACQUIRING_LOCK → RUNNING → YIELDING / WAITING.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 2.1 Layer Decomposition, 2.2 Thread State Table, 2.3 Producer-Consumer Protocol.
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 4 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 3</span>
                </div>
                <h4 className="text-sm font-bold text-white">Scheduling Algorithms & Mathematical Formulations</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Theoretical analysis and formal mathematical definitions for FCFS (FIFO Head Selection), Round Robin (Quantum-based preemption and context switch modeling), and Non-preemptive Priority Scheduling. Provides standard OS KPI formulas: Completion Time (C), Turnaround Time (TAT = C - Arrival), Waiting Time (WT = TAT - Burst), Multi-Core CPU Utilization %, and System Throughput.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 3.1 FCFS & Convoy Effect, 3.2 Round Robin Preemption, 3.3 Priority & Starvation, 3.4 OS Metric Formulations Box.
                </div>
              </div>
            )}

            {activeTab === 5 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 5 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 4</span>
                </div>
                <h4 className="text-sm font-bold text-white">Thread Synchronization & Concurrency Control</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deep dive into critical section theory and race condition mechanics (lost updates, pointer tearing, and double dequeue). Explains mutual exclusion via POSIX <code className="text-amber-400 font-mono">pthread_mutex_t</code> and condition variable sleep/wake mechanisms (<code className="text-cyan-400 font-mono">pthread_cond_t</code>). Features the critical Spurious Wakeup defense pattern (<code className="text-amber-300 font-mono">while(empty) cond_wait</code>) alongside complete, annotated POSIX C reference code.
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 4.1 Race Conditions, 4.2 Mutex & Spurious Wakeups, 4.3 POSIX Pthreads C Routine Code Box.
                </div>
              </div>
            )}

            {activeTab === 6 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 6 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 5</span>
                </div>
                <h4 className="text-sm font-bold text-white">Experimental Results & Policy Benchmarking</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generates live empirical results derived directly from your current simulation setup ({tasks.length} tasks across {threadCount} threads). Renders a structured comparison table contrasting FCFS vs Round Robin vs Priority across Avg Waiting Time, Turnaround Time, CPU Utilization, Makespan, and Context Switches. Includes a vector-drawn horizontal bar chart directly inside the PDF!
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 5.1 Setup, 5.2 Comparative Table, 5.3 Vector Bar Chart, 5.4 Multi-Core Findings & Discussion.
                </div>
              </div>
            )}

            {activeTab === 7 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">PAGE 7 of 7</span>
                  <span className="text-xs text-slate-400">Chapter 6</span>
                </div>
                <h4 className="text-sm font-bold text-white">Conclusion, Viva Voce Q&A & References</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Concludes the project with 5 comprehensive Viva Voce questions and detailed model answers directly answering common external examiner questions (thread pool benefits, spurious wakeups, convoy effect dampening in multicore, quantum sizing trade-offs, and multi-core utilization formulation). Concludes with formal IEEE/textbook academic citations (Silberschatz, Tanenbaum, POSIX IEEE 1003.1c).
                </p>
                <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
                  <strong className="text-slate-200">Includes:</strong> 6.1 Conclusion, 6.2 Top 5 Viva Questions & Answers, 6.3 Standard Academic References.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            Full 7-Page PDF • A4 Format • Vector Graphics & Benchmark Tables
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Download PDF Report'}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
