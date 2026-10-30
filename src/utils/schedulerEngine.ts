/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Multithreaded Task Scheduler Simulation Engine
 * Operating Systems Mini Project - Thread Pool & CPU Scheduling Policies
 *
 * This file implements the core Operating System concepts:
 * 1. Thread Pool pattern with N worker threads
 * 2. Shared Ready Queue protected by simulated Mutex Lock & Condition Variable
 * 3. Scheduling Algorithms: FCFS, Round Robin, and Priority (non-preemptive)
 * 4. Step-by-step discrete-event simulation engine
 * 5. Headless batch simulator for side-by-side policy comparison
 */

import {
  GanttBlock,
  MutexState,
  PolicyComparisonResult,
  SchedulingPolicy,
  SimulationMetrics,
  TaskDefinition,
  TaskRuntime,
  WorkerThreadState,
} from '../types/scheduler';

/**
 * Initialize runtime task representations from user definitions
 */
export function initializeRuntimeTasks(tasks: TaskDefinition[]): TaskRuntime[] {
  return tasks.map((t) => ({
    id: t.id,
    name: t.name,
    burstTime: t.burstTime,
    remainingTime: t.burstTime,
    priority: t.priority,
    colorIndex: t.colorIndex,
    arrivalTime: t.arrivalTime,
    startTime: null,
    completionTime: null,
    waitingTime: 0,
    turnaroundTime: 0,
    executedByThreads: [],
    currentQuantumSpent: 0,
  }));
}

/**
 * Initialize worker threads for thread pool
 */
export function initializeWorkerThreads(threadCount: number): WorkerThreadState[] {
  const threads: WorkerThreadState[] = [];
  for (let i = 1; i <= threadCount; i++) {
    threads.push({
      id: i,
      status: 'IDLE',
      currentTask: null,
      busyTime: 0,
      tasksCompletedCount: 0,
      lastActionMessage: 'Thread spawned and waiting on condition variable',
    });
  }
  return threads;
}

// ============================================================================
// SCHEDULING ALGORITHMS (Separated for clarity and Viva presentation)
// ============================================================================

/**
 * 1. FCFS (First-Come, First-Served) Scheduling Logic
 *
 * Principle:
 * - Tasks are dispatched in the exact order they entered the ready queue.
 * - Non-preemptive: Once a worker thread acquires a task, it runs it until completion.
 * - Queue behavior: Pure FIFO (First In, First Out).
 *
 * @param readyQueue Array of tasks currently waiting
 * @returns Index of the chosen task (0 for head of queue), or -1 if empty
 */
export function fcfsScheduling(readyQueue: TaskRuntime[]): number {
  if (readyQueue.length === 0) return -1;
  // Always select the front of the FIFO queue
  return 0;
}

/**
 * 2. Priority Scheduling (Non-preemptive) Logic
 *
 * Principle:
 * - Each task has an assigned priority integer (1 to 5).
 * - Standard OS convention: LOWER number represents HIGHER priority (1 is highest).
 * - The scheduler scans the ready queue and selects the task with the minimum priority value.
 * - Tie-breaker: If two tasks share the same priority, FCFS (arrival order) is used.
 * - Non-preemptive: Worker thread holds the CPU until the task burst completes.
 *
 * @param readyQueue Array of tasks currently waiting
 * @returns Index of highest priority task in the queue, or -1 if empty
 */
export function priorityScheduling(readyQueue: TaskRuntime[]): number {
  if (readyQueue.length === 0) return -1;

  let bestIndex = 0;
  let minPriority = readyQueue[0].priority;

  for (let i = 1; i < readyQueue.length; i++) {
    if (readyQueue[i].priority < minPriority) {
      minPriority = readyQueue[i].priority;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * 3. Round Robin (RR) Scheduling Logic
 *
 * Principle:
 * - Preemptive time-sharing algorithm designed for fairness.
 * - Worker threads pick tasks from the front of the queue (FIFO).
 * - A task is allowed to execute for at most `timeQuantum` units of CPU time.
 * - If the task completes within the quantum, it exits the system.
 * - If remainingTime > 0 when quantum expires, the thread preempts/yields the task,
 *   re-acquires the queue lock, and pushes it to the BACK of the ready queue.
 *
 * @param readyQueue Array of tasks currently waiting
 * @returns Index 0 (FIFO order for dispatching the next available slice)
 */
export function roundRobinScheduling(readyQueue: TaskRuntime[]): number {
  if (readyQueue.length === 0) return -1;
  return 0;
}

/**
 * Master dispatcher that calls the appropriate scheduling policy
 */
export function pickNextTaskIndex(
  readyQueue: TaskRuntime[],
  policy: SchedulingPolicy
): number {
  switch (policy) {
    case 'FCFS':
      return fcfsScheduling(readyQueue);
    case 'PRIORITY':
      return priorityScheduling(readyQueue);
    case 'RR':
      return roundRobinScheduling(readyQueue);
    default:
      return 0;
  }
}

// ============================================================================
// SIMULATION ENGINE (Discrete Time Stepper)
// ============================================================================

export interface SimulationState {
  currentTime: number;
  readyQueue: TaskRuntime[];
  workerThreads: WorkerThreadState[];
  completedTasks: TaskRuntime[];
  ganttBlocks: GanttBlock[];
  mutexState: MutexState;
  policy: SchedulingPolicy;
  timeQuantum: number;
  isFinished: boolean;
  contextSwitches: number;
  totalTasksCount: number;
}

/**
 * Advance the simulation by exactly ONE discrete time unit.
 *
 * Multithreaded Execution Model in 1 tick:
 * Phase 1: Worker Execution
 *   - Each busy thread executes its active task for 1 time unit (remainingTime - 1).
 *   - Records active execution in thread's Gantt timeline.
 *   - Checks if task has finished:
 *       - If yes: Calculate completionTime, turnaroundTime, waitingTime.
 *       - Mark thread as IDLE, move task to completedTasks.
 *   - Checks Round Robin quantum expiration:
 *       - If policy is RR and quantumSpent >= timeQuantum and remainingTime > 0:
 *         Preempt task, push back to queue, mark thread IDLE, increment context switches.
 *
 * Phase 2: Shared Queue Dispatch & Synchronization
 *   - For each IDLE thread:
 *       - If queue has tasks, acquire simulated mutex, dequeue chosen task (via policy),
 *         assign to worker thread, release mutex.
 *       - If queue is empty, worker enters condition variable wait.
 */
export function advanceSimulationStep(state: SimulationState): SimulationState {
  if (state.isFinished) {
    return state;
  }

  const nextTime = state.currentTime + 1;
  let contextSwitches = state.contextSwitches;
  const readyQueue = [...state.readyQueue];
  const completedTasks = [...state.completedTasks];
  const ganttBlocks = [...state.ganttBlocks];

  let mutexLockedBy: number | null = null;
  let mutexEvent = 'Queue idle';
  let isMutexLocked = false;

  // Clone thread states
  const updatedThreads: WorkerThreadState[] = state.workerThreads.map((thread) => {
    return {
      ...thread,
      currentTask: thread.currentTask ? { ...thread.currentTask } : null,
    };
  });

  // --------------------------------------------------------------------------
  // Phase 1: Execute 1 time unit on all currently active worker threads
  // --------------------------------------------------------------------------
  for (let i = 0; i < updatedThreads.length; i++) {
    const thread = updatedThreads[i];

    if (thread.currentTask) {
      const task = thread.currentTask;

      // Track thread execution
      thread.busyTime += 1;
      task.remainingTime -= 1;
      task.currentQuantumSpent += 1;

      // Track first start time
      if (task.startTime === null) {
        task.startTime = state.currentTime;
      }

      // Record in Gantt Chart
      // If the last block for this thread is the same task and ended at currentTime, extend it
      const lastBlock = ganttBlocks.find(
        (b) => b.threadId === thread.id && b.endTime === state.currentTime && b.taskId === task.id
      );

      if (lastBlock) {
        lastBlock.endTime = nextTime;
      } else {
        ganttBlocks.push({
          id: `gantt-${thread.id}-${task.id}-${state.currentTime}`,
          threadId: thread.id,
          taskId: task.id,
          taskName: task.name,
          startTime: state.currentTime,
          endTime: nextTime,
          colorIndex: task.colorIndex,
          priority: task.priority,
        });
      }

      // Check Task Completion
      if (task.remainingTime <= 0) {
        task.completionTime = nextTime;
        task.turnaroundTime = task.completionTime - task.arrivalTime;
        task.waitingTime = task.turnaroundTime - task.burstTime;

        completedTasks.push(task);
        thread.tasksCompletedCount += 1;
        thread.status = 'IDLE';
        thread.currentTask = null;
        thread.lastActionMessage = `Completed task ${task.id}`;
      } else if (state.policy === 'RR' && task.currentQuantumSpent >= state.timeQuantum) {
        // Round Robin Quantum Expired -> Preemption & Context Switch
        contextSwitches += 1;
        task.currentQuantumSpent = 0; // reset for next round

        // Acquire lock to enqueue back to ready queue
        isMutexLocked = true;
        mutexLockedBy = thread.id;
        mutexEvent = `Thread ${thread.id} acquired Mutex: yielded ${task.id} (quantum expired)`;

        readyQueue.push(task);
        thread.status = 'IDLE';
        thread.currentTask = null;
        thread.lastActionMessage = `Quantum expired (${state.timeQuantum}u); yielded ${task.id} to queue`;
      } else {
        thread.status = 'RUNNING';
        thread.lastActionMessage = `Executing ${task.id} (${task.remainingTime}u remaining)`;
      }
    } else {
      // Thread was idle during this time tick
      // Record idle block in Gantt if needed, or leave clear
      thread.status = 'IDLE';
      thread.lastActionMessage = 'Idle waiting on task queue';
    }
  }

  // --------------------------------------------------------------------------
  // Phase 2: Dispatch from Shared Ready Queue to Idle Worker Threads
  // --------------------------------------------------------------------------
  for (let i = 0; i < updatedThreads.length; i++) {
    const thread = updatedThreads[i];

    if (thread.currentTask === null && readyQueue.length > 0) {
      // Thread acquires the mutex lock to inspect and pull from the shared queue
      const taskIndex = pickNextTaskIndex(readyQueue, state.policy);

      if (taskIndex !== -1 && taskIndex < readyQueue.length) {
        const [dispatchedTask] = readyQueue.splice(taskIndex, 1);

        // Record lock acquisition
        isMutexLocked = true;
        mutexLockedBy = thread.id;
        mutexEvent = `Thread ${thread.id} locked queue & dequeued ${dispatchedTask.id} (${state.policy})`;

        if (!dispatchedTask.executedByThreads.includes(thread.id)) {
          dispatchedTask.executedByThreads.push(thread.id);
        }

        dispatchedTask.currentQuantumSpent = 0;
        thread.currentTask = dispatchedTask;
        thread.status = 'RUNNING';
        thread.lastActionMessage = `Acquired lock & picked ${dispatchedTask.id}`;
      }
    }
  }

  // Calculate idle threads waiting on condition variable
  const idleWaitingCount = updatedThreads.filter((t) => t.currentTask === null).length;

  // Check if simulation is complete
  const allTasksCompleted =
    completedTasks.length === state.totalTasksCount &&
    readyQueue.length === 0 &&
    updatedThreads.every((t) => t.currentTask === null);

  return {
    ...state,
    currentTime: nextTime,
    readyQueue,
    workerThreads: updatedThreads,
    completedTasks,
    ganttBlocks,
    contextSwitches,
    isFinished: allTasksCompleted,
    mutexState: {
      isLocked: isMutexLocked,
      lockedByThreadId: mutexLockedBy,
      waitingOnCondVarCount: idleWaitingCount,
      lastEvent: mutexEvent,
      timestamp: nextTime,
    },
  };
}

/**
 * Compute performance metrics from simulation state
 */
export function calculateMetrics(
  completedTasks: TaskRuntime[],
  totalTasksCount: number,
  currentTime: number,
  threadCount: number,
  totalCpuBusyTime: number,
  contextSwitches: number
): SimulationMetrics {
  const count = completedTasks.length;

  if (count === 0) {
    return {
      totalTasks: totalTasksCount,
      completedTasks: 0,
      avgWaitingTime: 0,
      avgTurnaroundTime: 0,
      cpuUtilization: 0,
      makespan: 0,
      throughput: 0,
      totalCpuBusyTime: 0,
      contextSwitches: 0,
    };
  }

  const totalWait = completedTasks.reduce((sum, t) => sum + t.waitingTime, 0);
  const totalTAT = completedTasks.reduce((sum, t) => sum + t.turnaroundTime, 0);
  const makespan = Math.max(...completedTasks.map((t) => t.completionTime || 0), currentTime);

  // CPU Utilization = Total Busy Time / (Number of Threads * Makespan) * 100
  const maxPossibleCapacity = threadCount * Math.max(makespan, 1);
  const cpuUtilization = Math.min(
    100,
    Math.max(0, (totalCpuBusyTime / maxPossibleCapacity) * 100)
  );

  // Throughput = completed tasks / makespan
  const throughput = makespan > 0 ? count / makespan : 0;

  return {
    totalTasks: totalTasksCount,
    completedTasks: count,
    avgWaitingTime: Number((totalWait / count).toFixed(2)),
    avgTurnaroundTime: Number((totalTAT / count).toFixed(2)),
    cpuUtilization: Number(cpuUtilization.toFixed(1)),
    makespan,
    throughput: Number(throughput.toFixed(3)),
    totalCpuBusyTime,
    contextSwitches,
  };
}

/**
 * Headless execution engine:
 * Runs FCFS, Round Robin, or Priority to completion instantaneously.
 * Used by "Compare All Policies" mode to provide immediate side-by-side analysis.
 */
export function runHeadlessSimulation(
  tasks: TaskDefinition[],
  threadCount: number,
  policy: SchedulingPolicy,
  timeQuantum: number = 2
): PolicyComparisonResult {
  const runtimeTasks = initializeRuntimeTasks(tasks);
  const initialThreads = initializeWorkerThreads(threadCount);

  let state: SimulationState = {
    currentTime: 0,
    readyQueue: [...runtimeTasks],
    workerThreads: initialThreads,
    completedTasks: [],
    ganttBlocks: [],
    mutexState: {
      isLocked: false,
      lockedByThreadId: null,
      waitingOnCondVarCount: threadCount,
      lastEvent: 'Init',
      timestamp: 0,
    },
    policy,
    timeQuantum,
    isFinished: false,
    contextSwitches: 0,
    totalTasksCount: tasks.length,
  };

  // Run discrete steps with safety brake of 5000 units to prevent infinite loops
  let iterations = 0;
  while (!state.isFinished && iterations < 5000) {
    state = advanceSimulationStep(state);
    iterations++;
  }

  const totalCpuBusy = state.workerThreads.reduce((sum, t) => sum + t.busyTime, 0);
  const metrics = calculateMetrics(
    state.completedTasks,
    state.totalTasksCount,
    state.currentTime,
    threadCount,
    totalCpuBusy,
    state.contextSwitches
  );

  const policyNameMap: Record<SchedulingPolicy, string> = {
    FCFS: 'First-Come, First-Served (FCFS)',
    RR: `Round Robin (RR, q=${timeQuantum})`,
    PRIORITY: 'Priority (Non-preemptive)',
  };

  return {
    policy,
    policyName: policyNameMap[policy],
    quantum: policy === 'RR' ? timeQuantum : undefined,
    metrics,
    completedTasks: state.completedTasks.map((t) => ({
      id: t.id,
      name: t.name,
      burstTime: t.burstTime,
      priority: t.priority,
      completionTime: t.completionTime || 0,
      waitingTime: t.waitingTime,
      turnaroundTime: t.turnaroundTime,
    })),
    ganttBlocks: state.ganttBlocks,
  };
}
