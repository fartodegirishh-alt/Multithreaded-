import React from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sliders,
  Cpu,
  Clock,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { SchedulingPolicy } from '../types/scheduler';

interface ConfigPanelProps {
  threadCount: number;
  onThreadCountChange: (count: number) => void;
  policy: SchedulingPolicy;
  onPolicyChange: (policy: SchedulingPolicy) => void;
  timeQuantum: number;
  onTimeQuantumChange: (quantum: number) => void;
  speedMs: number;
  onSpeedChange: (speed: number) => void;
  // Controls
  isPlaying: boolean;
  isFinished: boolean;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  threadCount,
  onThreadCountChange,
  policy,
  onPolicyChange,
  timeQuantum,
  onTimeQuantumChange,
  speedMs,
  onSpeedChange,
  isPlaying,
  isFinished,
  currentTime,
  onPlay,
  onPause,
  onStep,
  onReset,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Thread Pool & Scheduler Engine
            </h2>
            <p className="text-xs text-slate-400">
              Configure worker threads, policy parameters & simulation speed
            </p>
          </div>
        </div>

        {/* Live Clock Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-700 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Time:</span>
            <span className="text-cyan-300 font-bold text-sm">t = {currentTime}</span>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide uppercase ${
              isFinished
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : isPlaying
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800 animate-pulse'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {isFinished ? 'Completed' : isPlaying ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 1. Worker Threads Slider (1-8) */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Worker Threads
            </span>
            <span className="text-xs font-mono font-bold text-indigo-300 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60">
              {threadCount} {threadCount === 1 ? 'Thread' : 'Threads'}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="8"
            step="1"
            disabled={isPlaying}
            value={threadCount}
            onChange={(e) => onThreadCountChange(parseInt(e.target.value, 10))}
            className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-50"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>1 (Single)</span>
            <span>4 (Standard)</span>
            <span>8 (Max)</span>
          </div>
        </div>

        {/* 2. Scheduling Policy Dropdown */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <label className="text-xs font-medium text-slate-300 mb-2 block">
            Scheduling Policy
          </label>
          <select
            value={policy}
            disabled={isPlaying}
            onChange={(e) => onPolicyChange(e.target.value as SchedulingPolicy)}
            className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          >
            <option value="FCFS">FCFS (First-Come, First-Served)</option>
            <option value="RR">Round Robin (Preemptive Quantum)</option>
            <option value="PRIORITY">Priority (Non-preemptive, 1=High)</option>
          </select>
          <div className="text-[10px] text-slate-400 mt-2 truncate">
            {policy === 'FCFS' && 'FIFO queue execution to completion'}
            {policy === 'RR' && 'Preempts tasks after time quantum'}
            {policy === 'PRIORITY' && 'Dispatches lowest priority number first'}
          </div>
        </div>

        {/* 3. Time Quantum (Only if Round Robin) or Policy Detail */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          {policy === 'RR' ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">
                  Time Quantum (q)
                </span>
                <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-950 border border-amber-800/60">
                  {timeQuantum} units
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                disabled={isPlaying}
                value={timeQuantum}
                onChange={(e) => onTimeQuantumChange(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-50"
              />
              <div className="text-[10px] text-amber-400/80 mt-2 truncate">
                Preempts & yields every {timeQuantum} ticks
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <span className="text-xs font-medium text-slate-400">Policy Mode</span>
              <span className="text-xs font-bold text-slate-200 mt-1">Non-preemptive</span>
              <span className="text-[10px] text-slate-500 mt-1">
                Tasks run to completion once acquired by a thread
              </span>
            </div>
          )}
        </div>

        {/* 4. Simulation Speed Slider */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              Simulation Speed
            </span>
            <span className="text-xs font-mono text-cyan-300 font-semibold">
              {speedMs <= 200 ? 'Fast (200ms)' : speedMs <= 600 ? 'Normal (500ms)' : 'Slow (1000ms)'}
            </span>
          </div>

          <input
            type="range"
            min="100"
            max="1200"
            step="100"
            value={1300 - speedMs} // Invert slider so right = faster
            onChange={(e) => onSpeedChange(1300 - parseInt(e.target.value, 10))}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>
      </div>

      {/* Engine Control Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800/80 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          {isPlaying ? (
            <button
              onClick={onPause}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-md shadow-amber-950/60 active:scale-[0.98] transition-all"
            >
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Simulator</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isFinished}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/60 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentTime === 0 ? 'Start Simulation' : 'Resume'}</span>
            </button>
          )}

          <button
            onClick={onStep}
            disabled={isPlaying || isFinished}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Advance exactly 1 discrete time tick"
          >
            <SkipForward className="w-4 h-4 text-cyan-400" />
            <span>Step +1 Tick</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>

        {/* Helpful OS viva hint */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 hidden sm:block" />
          <span className="hidden sm:inline">
            Shared Ready Queue is synchronized with simulated <code className="text-indigo-300 font-mono">pthread_mutex</code>.
          </span>
        </div>
      </div>
    </div>
  );
};
