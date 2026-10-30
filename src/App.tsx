/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Multithreaded Task Scheduler Simulator
 * Operating Systems Mini Project
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TaskCreationPanel } from './components/TaskCreationPanel';
import { ConfigPanel } from './components/ConfigPanel';
import { ReadyQueueVisualizer } from './components/ReadyQueueVisualizer';
import { WorkerThreadsPanel } from './components/WorkerThreadsPanel';
import { GanttChart } from './components/GanttChart';
import { MetricsDashboard } from './components/MetricsDashboard';
import { ComparisonModal } from './components/ComparisonModal';
import { SyncExplanationModal } from './components/SyncExplanationModal';
import { ReportModal } from './components/ReportModal';
import {
  SchedulingPolicy,
  TaskDefinition,
  SimulationMetrics,
} from './types/scheduler';
import {
  INITIAL_DEFAULT_TASKS,
  generateRandomTasks,
} from './utils/defaultTasks';
import {
  advanceSimulationStep,
  calculateMetrics,
  initializeRuntimeTasks,
  initializeWorkerThreads,
  SimulationState,
} from './utils/schedulerEngine';

export default function App() {
  // Tasks definition pool
  const [tasks, setTasks] = useState<TaskDefinition[]>(INITIAL_DEFAULT_TASKS);

  // Configuration state
  const [threadCount, setThreadCount] = useState<number>(3);
  const [policy, setPolicy] = useState<SchedulingPolicy>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(3);
  const [speedMs, setSpeedMs] = useState<number>(500);

  // Simulation execution state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simState, setSimState] = useState<SimulationState>(() => ({
    currentTime: 0,
    readyQueue: initializeRuntimeTasks(INITIAL_DEFAULT_TASKS),
    workerThreads: initializeWorkerThreads(3),
    completedTasks: [],
    ganttBlocks: [],
    mutexState: {
      isLocked: false,
      lockedByThreadId: null,
      waitingOnCondVarCount: 3,
      lastEvent: 'Thread pool initialized; ready to schedule tasks',
      timestamp: 0,
    },
    policy: 'FCFS',
    timeQuantum: 3,
    isFinished: false,
    contextSwitches: 0,
    totalTasksCount: INITIAL_DEFAULT_TASKS.length,
  }));

  // Modals state
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Animation interval reference
  const timerRef = useRef<number | null>(null);

  // Synchronize simState reset whenever task definitions, thread count, or policy changes (if not running)
  const resetSimulator = useCallback(
    (
      newTasks: TaskDefinition[] = tasks,
      newThreadCount: number = threadCount,
      newPolicy: SchedulingPolicy = policy,
      newQuantum: number = timeQuantum
    ) => {
      setIsPlaying(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      setSimState({
        currentTime: 0,
        readyQueue: initializeRuntimeTasks(newTasks),
        workerThreads: initializeWorkerThreads(newThreadCount),
        completedTasks: [],
        ganttBlocks: [],
        mutexState: {
          isLocked: false,
          lockedByThreadId: null,
          waitingOnCondVarCount: newThreadCount,
          lastEvent: `Simulator reset with ${newThreadCount} threads and ${newPolicy} policy`,
          timestamp: 0,
        },
        policy: newPolicy,
        timeQuantum: newQuantum,
        isFinished: newTasks.length === 0,
        contextSwitches: 0,
        totalTasksCount: newTasks.length,
      });
    },
    [tasks, threadCount, policy, timeQuantum]
  );

  // Advance single step
  const handleStep = useCallback(() => {
    setSimState((prevState) => {
      if (prevState.isFinished) return prevState;
      return advanceSimulationStep(prevState);
    });
  }, []);

  // Interval execution when isPlaying is active
  useEffect(() => {
    if (isPlaying && !simState.isFinished) {
      timerRef.current = window.setInterval(() => {
        setSimState((prevState) => {
          if (prevState.isFinished) {
            setIsPlaying(false);
            return prevState;
          }
          const next = advanceSimulationStep(prevState);
          if (next.isFinished) {
            setIsPlaying(false);
          }
          return next;
        });
      }, speedMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, simState.isFinished, speedMs]);

  // Handlers for task mutations
  const handleAddTask = (newTask: TaskDefinition) => {
    const updated = [...tasks, newTask];
    setTasks(updated);
    resetSimulator(updated, threadCount, policy, timeQuantum);
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    resetSimulator(updated, threadCount, policy, timeQuantum);
  };

  const handleClearAll = () => {
    setTasks([]);
    resetSimulator([], threadCount, policy, timeQuantum);
  };

  const handleLoadDefaults = () => {
    setTasks(INITIAL_DEFAULT_TASKS);
    resetSimulator(INITIAL_DEFAULT_TASKS, threadCount, policy, timeQuantum);
  };

  const handleGenerateRandom = () => {
    const randomSet = generateRandomTasks(10, 1);
    setTasks(randomSet);
    resetSimulator(randomSet, threadCount, policy, timeQuantum);
  };

  // Handlers for configuration updates
  const handleThreadCountChange = (count: number) => {
    setThreadCount(count);
    resetSimulator(tasks, count, policy, timeQuantum);
  };

  const handlePolicyChange = (newPolicy: SchedulingPolicy) => {
    setPolicy(newPolicy);
    resetSimulator(tasks, threadCount, newPolicy, timeQuantum);
  };

  const handleTimeQuantumChange = (newQuantum: number) => {
    setTimeQuantum(newQuantum);
    resetSimulator(tasks, threadCount, policy, newQuantum);
  };

  // Compute live metrics
  const totalCpuBusy = simState.workerThreads.reduce((sum, t) => sum + t.busyTime, 0);
  const liveMetrics: SimulationMetrics = calculateMetrics(
    simState.completedTasks,
    simState.totalTasksCount,
    simState.currentTime,
    threadCount,
    totalCpuBusy,
    simState.contextSwitches
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* App Header */}
      <Header
        onOpenSyncGuide={() => setIsSyncModalOpen(true)}
        onOpenComparison={() => setIsComparisonModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
      />

      {/* Main Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Control Grid: Task Creation & Simulator Config */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Task Pool Form & Table */}
          <div className="lg:col-span-6 space-y-6">
            <TaskCreationPanel
              tasks={tasks}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onClearAll={handleClearAll}
              onLoadDefaults={handleLoadDefaults}
              onGenerateRandom={handleGenerateRandom}
              isSimulating={isPlaying}
            />
          </div>

          {/* Right Column: Engine Configuration & Controls */}
          <div className="lg:col-span-6 space-y-6">
            <ConfigPanel
              threadCount={threadCount}
              onThreadCountChange={handleThreadCountChange}
              policy={policy}
              onPolicyChange={handlePolicyChange}
              timeQuantum={timeQuantum}
              onTimeQuantumChange={handleTimeQuantumChange}
              speedMs={speedMs}
              onSpeedChange={setSpeedMs}
              isPlaying={isPlaying}
              isFinished={simState.isFinished}
              currentTime={simState.currentTime}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onStep={handleStep}
              onReset={() => resetSimulator()}
            />
          </div>
        </div>

        {/* Middle Section: Shared Ready Queue with Mutex Visualization */}
        <ReadyQueueVisualizer
          readyQueue={simState.readyQueue}
          mutexState={simState.mutexState}
          policy={
            policy === 'RR'
              ? `Round Robin (Quantum = ${timeQuantum}u)`
              : policy === 'PRIORITY'
              ? 'Priority Scheduling'
              : 'First-Come, First-Served'
          }
        />

        {/* Worker Threads Live Execution Cards */}
        <WorkerThreadsPanel
          threads={simState.workerThreads}
          currentTime={simState.currentTime}
          policy={policy}
          timeQuantum={timeQuantum}
        />

        {/* Live Multi-threaded Gantt Chart */}
        <GanttChart
          ganttBlocks={simState.ganttBlocks}
          threadCount={threadCount}
          currentTime={simState.currentTime}
          isFinished={simState.isFinished}
        />

        {/* OS Performance Metrics & Completed Tasks Ledger */}
        <MetricsDashboard
          metrics={liveMetrics}
          completedTasks={simState.completedTasks}
          threads={simState.workerThreads}
          currentTime={simState.currentTime}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-4 text-center text-xs text-slate-500">
        <p>
          Multithreaded Task Scheduler Simulator • Operating Systems Lab & Viva Project • Demonstrates Pthreads Mutex, Condition Variables & Scheduling Policies
        </p>
      </footer>

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        tasks={tasks}
        threadCount={threadCount}
        timeQuantum={timeQuantum}
      />

      {/* Thread Synchronization Guide Modal */}
      <SyncExplanationModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      {/* Academic 7-Page Project Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        tasks={tasks}
        threadCount={threadCount}
        timeQuantum={timeQuantum}
      />
    </div>
  );
}
