import React from 'react';
import { Lock, Unlock, Layers, ArrowRight, Activity, Users } from 'lucide-react';
import { MutexState, TaskRuntime } from '../types/scheduler';
import { getTaskColor } from '../utils/colorPalette';

interface ReadyQueueVisualizerProps {
  readyQueue: TaskRuntime[];
  mutexState: MutexState;
  policy: string;
}

export const ReadyQueueVisualizer: React.FC<ReadyQueueVisualizerProps> = ({
  readyQueue,
  mutexState,
  policy,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3.5">
      {/* Top Header with Mutex State Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Shared Ready Queue & Mutex Synchronizer
            </h2>
            <p className="text-xs text-slate-400">
              Thread-safe FIFO/Priority buffer accessed via critical section locks
            </p>
          </div>
        </div>

        {/* Live Mutex Lock Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all duration-300 ${
              mutexState.isLocked
                ? 'bg-rose-950/80 text-rose-300 border-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.4)] animate-pulse'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
            }`}
          >
            {mutexState.isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>
                  MUTEX LOCKED {mutexState.lockedByThreadId ? `[T-Pool Worker ${mutexState.lockedByThreadId}]` : ''}
                </span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>MUTEX UNLOCKED (Ready)</span>
              </>
            )}
          </div>

          {/* Condition variable waiting count */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="font-mono text-slate-300">
              {mutexState.waitingOnCondVarCount}
            </span>
            <span className="hidden sm:inline">waiting on CondVar</span>
          </div>
        </div>
      </div>

      {/* Sync Log Bar */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between gap-2 overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <Activity className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-[11px] font-mono text-slate-300 truncate">
            {mutexState.lastEvent}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
          Policy: {policy}
        </span>
      </div>

      {/* Ready Queue Visual Pipeline */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 min-h-[90px] flex items-center">
        {readyQueue.length === 0 ? (
          <div className="w-full text-center py-4 text-xs text-slate-500 font-mono flex items-center justify-center gap-2">
            <span>Ready queue is empty. Worker threads are waiting on <code className="text-cyan-400">pthread_cond_wait()</code>.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 overflow-x-auto w-full pb-1 scrollbar-thin">
            <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex-shrink-0 pr-1 border-r border-slate-800 flex items-center gap-1">
              <span>HEAD</span>
              <ArrowRight className="w-3 h-3 text-cyan-400" />
            </div>

            {readyQueue.map((task, idx) => {
              const color = getTaskColor(task.colorIndex);
              return (
                <div
                  key={`${task.id}-${idx}`}
                  className={`flex-shrink-0 rounded-xl border p-2.5 transition-all duration-200 min-w-[130px] sm:min-w-[150px] ${color.bgClass} ${color.borderClass} ${color.glowClass} bg-slate-900/90`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${color.badgeBg}`}
                    >
                      {task.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        task.priority === 1
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : task.priority === 2
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      P{task.priority}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-200 truncate" title={task.name}>
                    {task.name}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1.5 pt-1 border-t border-slate-800/80">
                    <span>Rem: <strong className="text-cyan-300">{task.remainingTime}u</strong></span>
                    <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                  </div>
                </div>
              );
            })}

            <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider flex-shrink-0 pl-1 border-l border-slate-800">
              TAIL
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
