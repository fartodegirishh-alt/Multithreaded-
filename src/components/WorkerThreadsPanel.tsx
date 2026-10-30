import React from 'react';
import { Cpu, CheckCircle2, Clock, Zap, ArrowRightLeft } from 'lucide-react';
import { WorkerThreadState } from '../types/scheduler';
import { getTaskColor } from '../utils/colorPalette';

interface WorkerThreadsPanelProps {
  threads: WorkerThreadState[];
  currentTime: number;
  policy: string;
  timeQuantum: number;
}

export const WorkerThreadsPanel: React.FC<WorkerThreadsPanelProps> = ({
  threads,
  currentTime,
  policy,
  timeQuantum,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Worker Thread Pool
            </h2>
            <p className="text-xs text-slate-400">
              Active concurrent execution workers consuming from shared queue
            </p>
          </div>
        </div>

        {/* Status Count Summary */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            {threads.filter((t) => t.status === 'RUNNING').length} Busy
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
            {threads.filter((t) => t.status === 'IDLE').length} Idle
          </span>
        </div>
      </div>

      {/* Grid of Thread Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {threads.map((thread) => {
          const task = thread.currentTask;
          const color = task ? getTaskColor(task.colorIndex) : null;
          const taskProgress = task
            ? Math.round(((task.burstTime - task.remainingTime) / task.burstTime) * 100)
            : 0;

          // Utilization of this thread so far
          const threadUtil =
            currentTime > 0
              ? Math.min(100, Math.round((thread.busyTime / currentTime) * 100))
              : 0;

          return (
            <div
              key={thread.id}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 ${
                task
                  ? 'bg-slate-950/90 border-slate-700 shadow-lg shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-80'
              }`}
            >
              {/* Thread Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs ${
                      task
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    W{thread.id}
                  </div>
                  <span className="text-xs font-semibold text-white">
                    Thread {thread.id}
                  </span>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold tracking-wider ${
                    task
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {task ? 'RUNNING' : 'IDLE'}
                </span>
              </div>

              {/* Task Details or Idle State */}
              {task && color ? (
                <div className={`p-2.5 rounded-lg border mb-2.5 ${color.bgClass} ${color.borderClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold font-mono px-1.5 py-0.2 rounded ${color.badgeBg}`}>
                      {task.id}
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">
                      P{task.priority}
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium truncate mb-2" title={task.name}>
                    {task.name}
                  </p>

                  {/* Task Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-300">
                      <span>Progress</span>
                      <span>
                        {task.burstTime - task.remainingTime}/{task.burstTime}u ({taskProgress}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${taskProgress}%`,
                          backgroundColor: color.hex,
                        }}
                      />
                    </div>
                  </div>

                  {/* Round Robin Quantum Slice Progress */}
                  {policy === 'RR' && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80">
                      <div className="flex justify-between text-[10px] font-mono text-amber-300">
                        <span className="flex items-center gap-1">
                          <ArrowRightLeft className="w-2.5 h-2.5" /> Quantum Slice
                        </span>
                        <span>
                          {task.currentQuantumSpent}/{timeQuantum}u
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (task.currentQuantumSpent / timeQuantum) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-slate-800 bg-slate-900/30 text-center mb-2.5 flex flex-col items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <span className="text-xs text-slate-500 font-mono">Thread in Wait State</span>
                  <span className="text-[10px] text-slate-600">Waiting on Ready Queue</span>
                </div>
              )}

              {/* Thread Stats & Action */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Busy Time:</span>
                  <span className="text-slate-200">{thread.busyTime}u ({threadUtil}%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Tasks Finished:</span>
                  <span className="text-cyan-400">{thread.tasksCompletedCount}</span>
                </div>
                {/* Mini Util Bar */}
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden mt-1">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${threadUtil}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
