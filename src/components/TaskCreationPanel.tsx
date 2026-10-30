import React, { useState } from 'react';
import { Plus, Sparkles, Trash2, RotateCcw, Hash, Clock, AlertCircle } from 'lucide-react';
import { TaskDefinition } from '../types/scheduler';
import { getTaskColor } from '../utils/colorPalette';
import { generateRandomTasks, INITIAL_DEFAULT_TASKS } from '../utils/defaultTasks';

interface TaskCreationPanelProps {
  tasks: TaskDefinition[];
  onAddTask: (task: TaskDefinition) => void;
  onDeleteTask: (id: string) => void;
  onClearAll: () => void;
  onLoadDefaults: () => void;
  onGenerateRandom: () => void;
  isSimulating: boolean;
}

export const TaskCreationPanel: React.FC<TaskCreationPanelProps> = ({
  tasks,
  onAddTask,
  onDeleteTask,
  onClearAll,
  onLoadDefaults,
  onGenerateRandom,
  isSimulating,
}) => {
  const [taskName, setTaskName] = useState('');
  const [burstTime, setBurstTime] = useState<number>(6);
  const [priority, setPriority] = useState<number>(2);

  // Auto-generate next task ID
  const nextIdNumber =
    tasks.length > 0
      ? Math.max(...tasks.map((t) => parseInt(t.id.replace(/\D/g, '') || '0', 10))) + 1
      : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = taskName.trim() || `User Process #${nextIdNumber}`;
    const newTask: TaskDefinition = {
      id: `T${nextIdNumber}`,
      name: finalName,
      burstTime: Math.min(20, Math.max(1, burstTime)),
      priority: Math.min(5, Math.max(1, priority)),
      colorIndex: (nextIdNumber - 1) % 12,
      arrivalTime: 0,
    };

    onAddTask(newTask);
    setTaskName('');
    // Alternate priority & burst for variety
    setBurstTime(Math.floor(Math.random() * 8) + 3);
    setPriority(Math.floor(Math.random() * 4) + 1);
  };

  const totalBurst = tasks.reduce((sum, t) => sum + t.burstTime, 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Task Pool & Definitions
            </h2>
            <p className="text-xs text-slate-400">
              Configure burst times and priority levels (Arrive at t=0)
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-mono">
            Σ {totalBurst} Burst Units
          </span>
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          {/* Task Name */}
          <div className="sm:col-span-5">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Task Name (or OS Process)
            </label>
            <input
              type="text"
              placeholder={`e.g. Memory Compaction #T${nextIdNumber}`}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          {/* Burst Time (1-20) */}
          <div className="sm:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Burst Time
              </label>
              <span className="text-xs font-mono text-cyan-400 font-semibold">
                {burstTime} units
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="20"
                value={burstTime}
                onChange={(e) => setBurstTime(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <input
                type="number"
                min="1"
                max="20"
                value={burstTime}
                onChange={(e) => setBurstTime(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                className="w-14 px-2 py-1 text-center text-xs font-mono rounded bg-slate-900 border border-slate-700 text-cyan-400"
              />
            </div>
          </div>

          {/* Priority (1-5, lower = higher) */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">
                Priority
              </label>
              <span className="text-[10px] text-amber-400 font-mono font-medium">
                {priority === 1 ? '1 (Highest)' : priority === 5 ? '5 (Lowest)' : `${priority}`}
              </span>
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10))}
              className="w-full px-2.5 py-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="1">1 - Critical / Realtime (Highest)</option>
              <option value="2">2 - High Priority</option>
              <option value="3">3 - Normal Priority</option>
              <option value="4">4 - Low Priority</option>
              <option value="5">5 - Background Idle (Lowest)</option>
            </select>
          </div>

          {/* Add Button */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] transition-all shadow-md shadow-cyan-950/50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </form>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onGenerateRandom}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate 10 Random Tasks</span>
          </button>

          <button
            type="button"
            onClick={onLoadDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to OS Defaults</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          disabled={tasks.length === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <div className="max-h-56 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6 text-slate-600" />
              <span>No tasks in the pool. Add a task or generate random ones to begin.</span>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">ID</th>
                  <th className="py-2.5 px-3 font-semibold">Task Name</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Burst Time</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Priority</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Arrival</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {tasks.map((task) => {
                  const color = getTaskColor(task.colorIndex);
                  return (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* ID with color badge */}
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center justify-center font-bold px-2 py-0.5 rounded text-[11px] ${color.bgClass} ${color.textClass} border ${color.borderClass}`}
                        >
                          {task.id}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-2 px-3 font-sans text-slate-200 truncate max-w-[200px] sm:max-w-[280px]">
                        {task.name}
                      </td>

                      {/* Burst Time */}
                      <td className="py-2 px-3 text-center text-cyan-400 font-semibold">
                        {task.burstTime}u
                      </td>

                      {/* Priority */}
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            task.priority === 1
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : task.priority === 2
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : task.priority === 3
                              ? 'bg-blue-950 text-blue-300 border border-blue-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          P{task.priority} {task.priority === 1 ? '(High)' : task.priority === 5 ? '(Low)' : ''}
                        </span>
                      </td>

                      {/* Arrival Time */}
                      <td className="py-2 px-3 text-center text-slate-400">
                        t = {task.arrivalTime}
                      </td>

                      {/* Delete Action */}
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-rose-950/40 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
  );
};
