import React from 'react';
import { Cpu, Lock, BarChart3, FileDown, BookOpen } from 'lucide-react';

interface HeaderProps {
  onOpenSyncGuide: () => void;
  onOpenComparison: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSyncGuide,
  onOpenComparison,
  onOpenReport,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & OS Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-950/50 flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Multithreaded Task Scheduler Simulator
              </h1>
              <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                OS Mini Project
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Thread pool execution with shared queue synchronization (Mutex & Condition Variable) and policy comparison
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenSyncGuide}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm group"
            title="Read OS Mutex, Condition Variable, and Race Condition explanation"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Thread Synchronization</span>
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
              Viva Guide
            </span>
          </button>

          <button
            onClick={onOpenComparison}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all active:scale-[0.98]"
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Compare Policies</span>
          </button>

          <button
            onClick={onOpenReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 shadow-md shadow-cyan-950/50 hover:shadow-cyan-900/40 transition-all active:scale-[0.98]"
            title="Generate and download 7-page academic OS project report in PDF format"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF Report (7 Pages)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
