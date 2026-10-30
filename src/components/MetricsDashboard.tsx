import React from 'react';
import {
  TrendingUp,
  Clock,
  Cpu,
  CheckCircle,
  HelpCircle,
  Repeat,
  Zap,
} from 'lucide-react';
import { SimulationMetrics, TaskRuntime, WorkerThreadState } from '../types/scheduler';
import { getTaskColor } from '../utils/colorPalette';

interface MetricsDashboardProps {
  metrics: SimulationMetrics;
  completedTasks: TaskRuntime[];
  threads: WorkerThreadState[];
  currentTime: number;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  completedTasks,
  threads,
  currentTime,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-950 border border-teal-700/60 flex items-center justify-center text-teal-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              OS Performance Metrics & Completed Tasks
            </h2>
            <p className="text-xs text-slate-400">
              Quantitative evaluation: Waiting time, turnaround, CPU utilization & throughput
            </p>
          </div>
        </div>

        {/* Task progress badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {completedTasks.length} / {metrics.totalTasks} Tasks Completed
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* 1. Avg Waiting Time */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Avg Waiting Time</span>
            <span title="WT = Turnaround - Burst" className="cursor-help text-slate-500">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              {metrics.avgWaitingTime}
            </span>
            <span className="text-xs font-mono text-slate-500">units</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            WT = TAT - Burst
          </div>
        </div>

        {/* 2. Avg Turnaround Time */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Avg Turnaround Time</span>
            <span title="TAT = Completion - Arrival (Arrival=0)" className="cursor-help text-slate-500">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-bold font-mono text-indigo-400">
              {metrics.avgTurnaroundTime}
            </span>
            <span className="text-xs font-mono text-slate-500">units</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            TAT = Completion - Arrival
          </div>
        </div>

        {/* 3. CPU Utilization % */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">CPU Utilization</span>
            <span title="Utilization = (Busy Time / (Threads * Makespan)) * 100" className="cursor-help text-slate-500">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {metrics.cpuUtilization}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${metrics.cpuUtilization}%` }}
            />
          </div>
        </div>

        {/* 4. Throughput */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Throughput</span>
            <span title="Tasks completed per time unit = Completed / Makespan" className="cursor-help text-slate-500">
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              {metrics.throughput}
            </span>
            <span className="text-xs font-mono text-slate-500">tasks/u</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {completedTasks.length} tasks in {metrics.makespan}u
          </div>
        </div>

        {/* 5. Makespan & Context Switches */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between group hover:border-slate-700 transition-colors col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Makespan / Switches</span>
            <span className="text-purple-400 font-mono">Cmax: {metrics.makespan}u</span>
          </div>
          <div className="flex items-baseline gap-2 my-1">
            <div className="flex items-center gap-1 text-slate-300 font-mono text-sm">
              <Repeat className="w-3.5 h-3.5 text-purple-400" />
              <span>{metrics.contextSwitches} Preemptions</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Total CPU Busy: {metrics.totalCpuBusyTime}u
          </div>
        </div>
      </div>

      {/* Per-Thread CPU Utilization Bars */}
      <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-3">
        <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Per-Worker Thread CPU Utilization Breakdown
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Current Span: {currentTime}u
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {threads.map((thread) => {
            const util =
              currentTime > 0
                ? Math.min(100, Math.round((thread.busyTime / currentTime) * 100))
                : 0;
            return (
              <div key={thread.id} className="bg-slate-900/80 rounded-lg p-2 border border-slate-800">
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-slate-400">W{thread.id}</span>
                  <span className="text-cyan-400 font-semibold">{util}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${util}%` }}
                  />
                </div>
                <div className="text-[9px] text-slate-500 font-mono mt-1 text-right">
                  {thread.busyTime}u busy
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Tasks Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Completed Tasks Schedule Ledger
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {completedTasks.length} records
          </span>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
          <div className="max-h-56 overflow-y-auto scrollbar-thin">
            {completedTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 font-mono">
                No tasks have completed yet. Click "Start Simulation" or "Step" to run tasks.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 sticky top-0 z-10 font-mono">
                  <tr>
                    <th className="py-2.5 px-3">Task ID</th>
                    <th className="py-2.5 px-3">Task Name</th>
                    <th className="py-2.5 px-3 text-center">Burst</th>
                    <th className="py-2.5 px-3 text-center">Priority</th>
                    <th className="py-2.5 px-3 text-center">Completion (C)</th>
                    <th className="py-2.5 px-3 text-center">Turnaround (TAT)</th>
                    <th className="py-2.5 px-3 text-center">Waiting (WT)</th>
                    <th className="py-2.5 px-3 text-right">Executed On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {completedTasks.map((task) => {
                    const color = getTaskColor(task.colorIndex);
                    return (
                      <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                        {/* ID */}
                        <td className="py-2 px-3">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${color.badgeBg}`}
                          >
                            {task.id}
                          </span>
                        </td>

                        {/* Name */}
                        <td className="py-2 px-3 font-sans text-slate-200 truncate max-w-[200px]">
                          {task.name}
                        </td>

                        {/* Burst */}
                        <td className="py-2 px-3 text-center text-slate-300">
                          {task.burstTime}u
                        </td>

                        {/* Priority */}
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                              task.priority === 1
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            P{task.priority}
                          </span>
                        </td>

                        {/* Completion */}
                        <td className="py-2 px-3 text-center text-cyan-400 font-semibold">
                          t = {task.completionTime}
                        </td>

                        {/* Turnaround */}
                        <td className="py-2 px-3 text-center text-indigo-300">
                          {task.turnaroundTime}u
                        </td>

                        {/* Waiting */}
                        <td className="py-2 px-3 text-center text-emerald-300">
                          {task.waitingTime}u
                        </td>

                        {/* Threads */}
                        <td className="py-2 px-3 text-right text-slate-400">
                          {task.executedByThreads.map((t) => `W${t}`).join(', ') || 'None'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
