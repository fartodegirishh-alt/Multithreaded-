/**
 * Multithreaded Task Scheduler Simulator - Type Definitions
 * Operating Systems Mini Project
 */

export type SchedulingPolicy = 'FCFS' | 'RR' | 'PRIORITY';

export interface TaskDefinition {
  id: string;              // e.g. "T1"
  name: string;            // e.g. "Matrix Multiplication"
  burstTime: number;       // Execution time units (1-20)
  priority: number;        // 1 to 5 (1 = highest priority, 5 = lowest priority)
  colorIndex: number;      // Palette index
  arrivalTime: number;     // Time when task entered system (default 0)
}

export interface TaskRuntime {
  id: string;
  name: string;
  burstTime: number;
  remainingTime: number;
  priority: number;
  colorIndex: number;
  arrivalTime: number;
  startTime: number | null;
  completionTime: number | null;
  waitingTime: number;
  turnaroundTime: number;
  executedByThreads: number[];
  currentQuantumSpent: number; // for Round Robin
}

export type ThreadStatus = 'IDLE' | 'ACQUIRING_LOCK' | 'RUNNING' | 'YIELDING';

export interface WorkerThreadState {
  id: number;                   // 1..N
  status: ThreadStatus;
  currentTask: TaskRuntime | null;
  busyTime: number;             // Total active computing time
  tasksCompletedCount: number;
  lastActionMessage?: string;
}

export interface GanttBlock {
  id: string;
  threadId: number;
  taskId: string | null;        // null means thread was IDLE
  taskName: string;
  startTime: number;
  endTime: number;
  colorIndex: number;
  priority?: number;
}

export interface SimulationMetrics {
  totalTasks: number;
  completedTasks: number;
  avgWaitingTime: number;
  avgTurnaroundTime: number;
  cpuUtilization: number;       // 0 to 100 percentage
  makespan: number;             // Total execution time (completion of last task)
  throughput: number;           // Tasks finished per time unit
  totalCpuBusyTime: number;
  contextSwitches: number;
}

export interface MutexState {
  isLocked: boolean;
  lockedByThreadId: number | null;
  waitingOnCondVarCount: number;
  lastEvent: string;
  timestamp: number;
}

export interface PolicyComparisonResult {
  policy: SchedulingPolicy;
  policyName: string;
  quantum?: number;
  metrics: SimulationMetrics;
  completedTasks: {
    id: string;
    name: string;
    burstTime: number;
    priority: number;
    completionTime: number;
    waitingTime: number;
    turnaroundTime: number;
  }[];
  ganttBlocks: GanttBlock[];
}
