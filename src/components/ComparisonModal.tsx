import React, { useMemo } from 'react';
import {
  X,
  Trophy,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { PolicyComparisonResult, TaskDefinition } from '../types/scheduler';
import { runHeadlessSimulation } from '../utils/schedulerEngine';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskDefinition[];
  threadCount: number;
  timeQuantum: number;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  tasks,
  threadCount,
  timeQuantum,
}) => {
  // Compute comparison results for all 3 policies instantaneously
  const comparisonResults = useMemo(() => {
    if (!isOpen || tasks.length === 0) return null;

    const fcfs = runHeadlessSimulation(tasks, threadCount, 'FCFS', timeQuantum);
    const rr = runHeadlessSimulation(tasks, threadCount, 'RR', timeQuantum);
    const priority = runHeadlessSimulation(tasks, threadCount, 'PRIORITY', timeQuantum);

    // Identify winners for each metric
    const minWait = Math.min(fcfs.metrics.avgWaitingTime, rr.metrics.avgWaitingTime, priority.metrics.avgWaitingTime);
    const minTAT = Math.min(fcfs.metrics.avgTurnaroundTime, rr.metrics.avgTurnaroundTime, priority.metrics.avgTurnaroundTime);
    const maxUtil = Math.max(fcfs.metrics.cpuUtilization, rr.metrics.cpuUtilization, priority.metrics.cpuUtilization);
    const minMakespan = Math.min(fcfs.metrics.makespan, rr.metrics.makespan, priority.metrics.makespan);

    return {
      policies: [fcfs, rr, priority],
      best: {
        avgWait: minWait,
        avgTAT: minTAT,
        cpuUtil: maxUtil,
        makespan: minMakespan,
      },
    };
  }, [isOpen, tasks, threadCount, timeQuantum]);

  if (!isOpen) return null;

  if (tasks.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">No Tasks in Queue</h3>
          <p className="text-xs text-slate-400 mb-4">
            Please add tasks or generate random tasks before comparing scheduling policies.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { policies, best } = comparisonResults!;

  // Max values for relative bar chart scaling
  const maxWaitVal = Math.max(...policies.map((p) => p.metrics.avgWaitingTime), 1);
  const maxTATVal = Math.max(...policies.map((p) => p.metrics.avgTurnaroundTime), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Scheduling Policies Comparative Evaluation
              </h2>
              <p className="text-xs text-slate-400">
                Benchmarking FCFS vs Round Robin (q={timeQuantum}) vs Priority on {tasks.length} tasks across {threadCount} worker threads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side-by-side Policy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {policies.map((item) => {
              const isBestWait = item.metrics.avgWaitingTime === best.avgWait;
              const isBestTAT = item.metrics.avgTurnaroundTime === best.avgTAT;
              const isBestUtil = item.metrics.cpuUtilization === best.cpuUtil;

              return (
                <div
                  key={item.policy}
                  className={`rounded-xl border p-4.5 flex flex-col justify-between transition-all bg-slate-950/70 ${
                    item.policy === 'FCFS'
                      ? 'border-cyan-800/60 shadow-lg shadow-cyan-950/20'
                      : item.policy === 'RR'
                      ? 'border-amber-800/60 shadow-lg shadow-amber-950/20'
                      : 'border-purple-800/60 shadow-lg shadow-purple-950/20'
                  }`}
                >
                  {/* Policy Title */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md ${
                          item.policy === 'FCFS'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : item.policy === 'RR'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-purple-950 text-purple-300 border border-purple-800'
                        }`}
                      >
                        {item.policy}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.policy === 'RR' ? `Quantum = ${item.quantum}u` : 'Non-preemptive'}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-white mb-3">
                      {item.policyName}
                    </h3>

                    {/* Metrics List */}
                    <div className="space-y-2.5 font-mono text-xs">
                      {/* Avg Wait */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                        <span className="text-slate-400">Avg Waiting Time</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">
                            {item.metrics.avgWaitingTime}u
                          </span>
                          {isBestWait && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-0.5">
                              <Trophy className="w-2.5 h-2.5" /> Best
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Avg Turnaround */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                        <span className="text-slate-400">Avg Turnaround</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">
                            {item.metrics.avgTurnaroundTime}u
                          </span>
                          {isBestTAT && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-0.5">
                              <Trophy className="w-2.5 h-2.5" /> Best
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CPU Utilization */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                        <span className="text-slate-400">CPU Utilization</span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-sm">
                            {item.metrics.cpuUtilization}%
                          </span>
                          {isBestUtil && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-0.5">
                              <Trophy className="w-2.5 h-2.5" /> Best
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Makespan & Context Switches */}
                      <div className="flex items-center justify-between text-slate-400 px-1 pt-1">
                        <span>Makespan: <strong className="text-slate-200">{item.metrics.makespan}u</strong></span>
                        <span>Switches: <strong className="text-amber-400">{item.metrics.contextSwitches}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Graphical Comparison Bar Chart */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Comparative Bar Visualizer
            </h3>

            {/* Waiting Time Chart */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="font-medium">Average Waiting Time (Lower is better)</span>
                <span className="text-slate-500">units</span>
              </div>
              <div className="space-y-2">
                {policies.map((p) => {
                  const pct = Math.round((p.metrics.avgWaitingTime / maxWaitVal) * 100);
                  const isWinner = p.metrics.avgWaitingTime === best.avgWait;
                  return (
                    <div key={`wait-${p.policy}`} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-20 font-bold text-slate-300">{p.policy}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-emerald-500' : 'bg-cyan-600'
                          }`}
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-bold text-white">
                        {p.metrics.avgWaitingTime}u
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Turnaround Time Chart */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="font-medium">Average Turnaround Time (Lower is better)</span>
                <span className="text-slate-500">units</span>
              </div>
              <div className="space-y-2">
                {policies.map((p) => {
                  const pct = Math.round((p.metrics.avgTurnaroundTime / maxTATVal) * 100);
                  const isWinner = p.metrics.avgTurnaroundTime === best.avgTAT;
                  return (
                    <div key={`tat-${p.policy}`} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-20 font-bold text-slate-300">{p.policy}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-bold text-white">
                        {p.metrics.avgTurnaroundTime}u
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CPU Utilization Chart */}
            <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span className="font-medium">CPU Utilization % (Higher is better)</span>
                <span className="text-slate-500">0 - 100%</span>
              </div>
              <div className="space-y-2">
                {policies.map((p) => {
                  const isWinner = p.metrics.cpuUtilization === best.cpuUtil;
                  return (
                    <div key={`util-${p.policy}`} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-20 font-bold text-slate-300">{p.policy}</span>
                      <div className="flex-1 bg-slate-900 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWinner ? 'bg-emerald-500' : 'bg-teal-600'
                          }`}
                          style={{ width: `${Math.max(5, p.metrics.cpuUtilization)}%` }}
                        />
                      </div>
                      <span className="w-14 text-right font-bold text-white">
                        {p.metrics.cpuUtilization}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OS Viva Analysis & Takeaways */}
          <div className="bg-indigo-950/30 border border-indigo-900/60 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>OS viva & Theory Observations for this Dataset</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">FCFS Characteristics</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Simple FIFO order. If a long burst task arrives first, it causes the <em>Convoy Effect</em>, forcing shorter tasks to wait and elevating the average waiting time.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">Round Robin Characteristics</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Fairness-oriented time-slicing. Shorter tasks complete earlier, improving responsiveness. However, excessive preemption incurs context switch overhead ({policies[1].metrics.contextSwitches} switches).
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-purple-400 block mb-1">Priority Characteristics</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Dispatches high-priority processes (low priority index) first. Crucial for real-time and kernel tasks, but low priority processes risk <em>starvation</em> if new high priority tasks keep arriving.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            {threadCount} Worker Threads • All tasks arrived at t = 0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
