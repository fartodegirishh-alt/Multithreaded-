/**
 * Multithreaded Task Scheduler Simulator - 7-Page Academic Project Report Generator
 * Generates an IEEE/University standard PDF report using jsPDF.
 */

import { jsPDF } from 'jspdf';
import { PolicyComparisonResult, TaskDefinition } from '../types/scheduler';
import { runHeadlessSimulation } from './schedulerEngine';

interface GenerateReportOptions {
  studentName?: string;
  rollNumber?: string;
  department?: string;
  tasks: TaskDefinition[];
  threadCount: number;
  timeQuantum: number;
}

export function generateProjectReportPDF(options: GenerateReportOptions): jsPDF {
  const {
    studentName = 'Candidate / Student',
    rollNumber = 'CS-2024-OS-042',
    department = 'Department of Computer Science & Engineering',
    tasks,
    threadCount,
    timeQuantum,
  } = options;

  // Run comparative simulation to get real live data for Chapter 5
  const fcfsResult = runHeadlessSimulation(tasks, threadCount, 'FCFS', timeQuantum);
  const rrResult = runHeadlessSimulation(tasks, threadCount, 'RR', timeQuantum);
  const priorityResult = runHeadlessSimulation(tasks, threadCount, 'PRIORITY', timeQuantum);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  // Helper for drawing headers and footers on pages 2..7
  const addHeaderFooter = (pageNum: number, totalPages: number = 7, title: string = 'OS Mini Project Report') => {
    // Header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Multithreaded Task Scheduler Simulator', margin, 12);
    doc.text(title, pageWidth - margin, 12, { align: 'right' });
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(margin, 14, pageWidth - margin, 14);

    // Footer
    doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
    doc.text('Operating Systems Laboratory • Thread Pool & Policy Benchmarking', margin, pageHeight - 10);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Helper for drawing section headers
  const drawSectionHeader = (y: number, num: string, title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text(`${num} ${title}`, margin, y);

    doc.setDrawColor(6, 182, 212); // Cyan accent
    doc.setLineWidth(0.8);
    doc.line(margin, y + 1.8, margin + 40, y + 1.8);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin + 40, y + 1.8, pageWidth - margin, y + 1.8);

    return y + 8;
  };

  // Helper for drawing subsection headers
  const drawSubHeader = (y: number, num: string, title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${num} ${title}`, margin, y);
    return y + 5;
  };

  // ==========================================================================
  // PAGE 1: TITLE PAGE & ACADEMIC CERTIFICATE / METADATA
  // ==========================================================================
  // Outer decorative border
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.8);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Institution / Course Banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('OPERATING SYSTEMS LABORATORY PROJECT REPORT', pageWidth / 2, 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Course: CS301 - Operating Systems Design & Analysis', pageWidth / 2, 38, { align: 'center' });
  doc.text(department, pageWidth / 2, 43, { align: 'center' });

  // Divider Line
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin + 20, 50, pageWidth - margin - 20, 50);

  // Project Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('MULTITHREADED TASK SCHEDULER', pageWidth / 2, 65, { align: 'center' });
  doc.text('SIMULATOR', pageWidth / 2, 73, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(14, 116, 144);
  doc.text('A Thread Pool Implementation with Shared Queue Mutex Synchronization', pageWidth / 2, 81, { align: 'center' });
  doc.text('& Multi-Policy Performance Benchmarking', pageWidth / 2, 87, { align: 'center' });

  // Abstract Box
  const abstractBoxY = 100;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, abstractBoxY, contentWidth, 70, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE ABSTRACT', margin + 6, abstractBoxY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const abstractText =
    "In modern multiprocessing operating systems, thread management and scheduling are foundational to resource utilization and latency minimization. Creating individual threads for transient tasks introduces severe kernel overhead due to repetitive stack allocations and context transitions. This project presents the 'Multithreaded Task Scheduler Simulator', an interactive Operating Systems simulator modeling an N-worker thread pool that retrieves tasks from a thread-safe shared ready queue. Critical section protection is simulated using POSIX-compliant mutual exclusion (pthread_mutex) and condition variables (pthread_cond_wait/signal) to prevent race conditions and eliminate busy-waiting. The simulator evaluates and compares three major CPU scheduling disciplines: First-Come First-Served (FCFS), Round Robin (RR), and Non-preemptive Priority Scheduling under identical task arrival distributions. Real-time metrics including average waiting time, turnaround time, CPU utilization percentage, and makespan are captured and contrasted, providing clear empirical evidence for algorithm selection in multi-core kernel architectures.";
  const splitAbstract = doc.splitTextToSize(abstractText, contentWidth - 12);
  doc.text(splitAbstract, margin + 6, abstractBoxY + 15, { lineHeightFactor: 1.35 });

  // Project Metadata Table / Student Info
  const infoY = 185;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, infoY, contentWidth, 52, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, infoY, contentWidth, 52);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('SUBMISSION & PROJECT DETAILS', margin + 6, infoY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const metaFields = [
    ['Candidate Name:', studentName],
    ['Roll / Register No:', rollNumber],
    ['Academic Unit:', department],
    ['Target Platform:', 'Modern Web Browser (Interactive Client-Side Engine)'],
    ['Pthreads Paradigm:', 'Worker Thread Pool, Mutex Lock, Condition Variables'],
    ['Scheduling Policies:', 'FCFS, Round Robin (Quantum-based), Non-preemptive Priority'],
    ['Academic Term:', '2026-2027 Operating Systems Laboratory Viva Examination'],
  ];

  let currentMetaY = infoY + 14;
  metaFields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 6, currentMetaY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, currentMetaY);
    currentMetaY += 5.2;
  });

  // Date / Signature footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 275);
  doc.text('Signature of Evaluator: _______________________', pageWidth - margin, 275, { align: 'right' });

  // ==========================================================================
  // PAGE 2: CHAPTER 1 - INTRODUCTION & PROBLEM STATEMENT
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(2, 7, 'Chapter 1: Introduction');

  let curY = 22;
  curY = drawSectionHeader(curY, '1.', 'INTRODUCTION & PROBLEM FORMULATION');

  curY = drawSubHeader(curY, '1.1', 'Background & Operating Systems Context');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const p1_1 =
    "In contemporary symmetric multiprocessing (SMP) and multi-core computer systems, CPU scheduling forms the backbone of operating system responsiveness and throughput. Traditional operating system designs often spawned a dedicated thread for each newly arrived task (Thread-per-Message or Thread-per-Request model). However, thread instantiation in UNIX/Linux kernel spaces requires invoking system calls like clone(2) or fork(2), allocating memory for private call stacks, creating thread control blocks (TCBs), and populating page table entries. When high-velocity bursts of tasks flood the system, this naive paradigm leads to resource exhaustion, thread thrashing, and excessive CPU cycles wasted on kernel-space context switching.";
  doc.text(doc.splitTextToSize(p1_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 26;

  curY = drawSubHeader(curY, '1.2', 'The Thread Pool Architectural Solution');
  const p1_2 =
    "To resolve the shortcomings of unbounded thread proliferation, operating systems employ the Thread Pool design pattern. In this architecture, a fixed or dynamically bounded pool of N worker threads is allocated at initialization time. Worker threads persist throughout the application lifecycle, continuously listening on a shared ready queue for pending tasks. By amortizing the thread initialization cost over millions of task dispatches, thread pools yield bounded memory consumption, superior CPU cache locality, and predictable latencies under saturation.";
  doc.text(doc.splitTextToSize(p1_2, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 26;

  curY = drawSubHeader(curY, '1.3', 'Problem Statement & Design Challenges');
  const p1_3 =
    "While thread pools effectively address thread explosion, they introduce critical concurrency and scheduling challenges:\n" +
    "1. Shared Queue Contention & Race Conditions: If multiple worker threads access the ready queue without synchronization, simultaneous reads and writes to queue pointer heads lead to lost updates or double task execution.\n" +
    "2. Busy-Waiting Waste: If idle workers continuously poll the ready queue in a tight spinlock loop (while(queue.empty)), CPU utilization artificially climbs to 100% while executing zero productive work.\n" +
    "3. Policy Trade-offs in Multi-Core Environments: Classical CPU scheduling policies (FCFS, Round Robin, Priority) exhibit drastically different behavior when mapped across N parallel execution units compared to uniprocessor systems.";
  doc.text(doc.splitTextToSize(p1_3, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 34;

  curY = drawSubHeader(curY, '1.4', 'Project Objectives & Scope');
  const p1_4 =
    "The primary objective of this project is to develop a comprehensive, production-grade simulation and pedagogical platform that demonstrates:\n" +
    "• Discrete-event simulation of an N-worker thread pool executing tasks from a shared ready queue.\n" +
    "• Thread-safe critical section protection using simulated POSIX mutexes and condition variables.\n" +
    "• Interactive visualization of queue pipelines, per-worker execution cards, and live multi-track Gantt timelines.\n" +
    "• Direct empirical comparison of FCFS, Round Robin (with parameterized quantum), and Priority algorithms on identical workloads.";
  doc.text(doc.splitTextToSize(p1_4, contentWidth), margin, curY, { lineHeightFactor: 1.35 });

  // ==========================================================================
  // PAGE 3: CHAPTER 2 - SYSTEM ARCHITECTURE & THREAD POOL MODEL
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(3, 7, 'Chapter 2: System Architecture');

  curY = 22;
  curY = drawSectionHeader(curY, '2.', 'SYSTEM ARCHITECTURE & THREAD POOL DESIGN');

  curY = drawSubHeader(curY, '2.1', 'Architectural Decomposition');
  const p2_1 =
    "The Multithreaded Task Scheduler Simulator is organized into four decoupled architectural layers:\n" +
    "1. Task Definition & Generator Layer: Maintains task descriptors containing unique Task IDs, burst times, priorities, and arrival timestamps.\n" +
    "2. Shared Queue & Synchronization Layer: Implements the thread-safe critical section holding waiting tasks. It encapsulates the simulated pthread_mutex lock state and pthread_cond condition variable.\n" +
    "3. Worker Thread Pool Engine: Manages N concurrent execution entities that cycle through lock acquisition, task extraction, execution, and state persistence.\n" +
    "4. Telemetry & Gantt Visualization Layer: Records temporal state intervals, updating real-time KPI metrics and the multithreaded Gantt chart at each discrete time step.";
  doc.text(doc.splitTextToSize(p2_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 34;

  curY = drawSubHeader(curY, '2.2', 'Thread State Transition Model');
  // Draw State Diagram Table/Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('State', margin + 4, curY + 6);
  doc.text('Description', margin + 30, curY + 6);
  doc.text('OS / Pthread Equivalent', margin + 115, curY + 6);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin + 2, curY + 8, margin + contentWidth - 2, curY + 8);

  const states = [
    ['IDLE', 'Worker is waiting for tasks in an empty queue.', 'pthread_cond_wait(&cond, &lock)'],
    ['ACQUIRING', 'Worker attempts to lock the shared queue.', 'pthread_mutex_lock(&lock)'],
    ['RUNNING', 'Worker holds task and executes burst units.', 'CPU computation (Parallel worker core)'],
    ['YIELDING', 'Quantum expired in RR; yields task to tail.', 'pthread_mutex_lock() + push_tail()'],
  ];

  let stY = curY + 14;
  states.forEach(([st, desc, eq]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 116, 144);
    doc.text(st, margin + 4, stY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(desc, margin + 30, stY);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(eq, margin + 115, stY);
    stY += 7;
  });

  curY += 48;

  curY = drawSubHeader(curY, '2.3', 'Producer-Consumer Synchronization Protocol');
  const p2_3 =
    "The synchronization contract follows the canonical POSIX Producer-Consumer model:\n" +
    "• Producer Action (Task Submission): When the user enqueues a new task, the producer calls pthread_mutex_lock(&queue_mutex) to gain exclusive write access, appends the task node to the tail of the linked list, increments queue_length, calls pthread_cond_signal(&queue_not_empty) to wake exactly one sleeping worker, and immediately releases the lock.\n" +
    "• Consumer Action (Worker Thread Loop): Each worker executes an infinite loop. It acquires queue_mutex and evaluates queue_length == 0. If true, it executes pthread_cond_wait(&queue_not_empty, &queue_mutex). Crucially, pthread_cond_wait atomically unlocks the mutex and suspends the thread. Upon being signaled, it re-acquires the lock, pops the candidate task according to the selected policy, releases the mutex, and executes the burst.";
  doc.text(doc.splitTextToSize(p2_3, contentWidth), margin, curY, { lineHeightFactor: 1.35 });

  // ==========================================================================
  // PAGE 4: CHAPTER 3 - SCHEDULING POLICIES & MATHEMATICAL FORMULATIONS
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(4, 7, 'Chapter 3: Scheduling Policies & Formulas');

  curY = 22;
  curY = drawSectionHeader(curY, '3.', 'SCHEDULING ALGORITHMS & MATHEMATICAL FORMULATION');

  curY = drawSubHeader(curY, '3.1', 'First-Come, First-Served (FCFS)');
  const p3_1 =
    "Principles & Mechanics:\n" +
    "FCFS is a non-preemptive algorithm governed by pure First-In, First-Out (FIFO) queue semantics. When a worker thread becomes idle, it selects the task at index 0 (the head of the ready queue). The assigned task retains the CPU until its entire burst time is exhausted.\n" +
    "Theoretical Analysis:\n" +
    "While trivial to implement with O(1) queue operations, FCFS suffers severely from the Convoy Effect: if an early task possesses a large burst time (e.g., T1 with 20u), all subsequent lightweight tasks (e.g., T2 with 1u) are forced to queue, dramatically inflating the average waiting time.";
  doc.text(doc.splitTextToSize(p3_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 28;

  curY = drawSubHeader(curY, '3.2', 'Round Robin (RR) with Time Slicing');
  const p3_2 =
    "Principles & Mechanics:\n" +
    "Round Robin is a preemptive scheduling algorithm engineered for time-sharing operating systems. Each task is granted a maximum slice of CPU time known as the Time Quantum (q). A worker runs the task until either: (1) the task finishes, or (2) the current quantum q expires. In case (2), the worker preempts the task, acquires the queue mutex, appends the remaining task to the rear of the ready queue, and triggers a context switch.\n" +
    "Theoretical Analysis:\n" +
    "If q is excessively large, RR degenerates into FCFS. If q is excessively small, the frequency of context switches escalates, consuming CPU overhead. An optimal quantum balances responsiveness with context switch penalties.";
  doc.text(doc.splitTextToSize(p3_2, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 32;

  curY = drawSubHeader(curY, '3.3', 'Non-preemptive Priority Scheduling');
  const p3_3 =
    "Principles & Mechanics:\n" +
    "Each task is associated with an integer priority value (1 to 5). Under standard operating system conventions (e.g., UNIX nice values and real-time priorities), lower numerical integers signify higher scheduling priority (Priority 1 = Highest, Priority 5 = Lowest). The scheduler scans the ready queue and extracts: Task* = argmin(Priority(T_i)). If priorities are equal, FCFS tie-breaking applies.\n" +
    "Theoretical Analysis:\n" +
    "Priority scheduling guarantees real-time and kernel tasks immediate attention. However, it is vulnerable to Starvation (Indefinite Blocking) where low-priority tasks never run if high-priority tasks arrive continuously.";
  doc.text(doc.splitTextToSize(p3_3, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 32;

  curY = drawSubHeader(curY, '3.4', 'Mathematical Formulations');
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, curY, contentWidth, 34, 2, 2, 'FD');

  const formulas = [
    ['Completion Time (C_i):', 'Temporal timestamp at which task T_i finishes its final burst unit.'],
    ['Turnaround Time (TAT_i):', 'TAT_i = C_i - Arrival_i (Total latency spent in the system).'],
    ['Waiting Time (WT_i):', 'WT_i = TAT_i - Burst_i (Time spent waiting in the ready queue).'],
    ['CPU Utilization (%):', 'Utilization = (Total Busy Time across all threads / (N * Makespan)) * 100%.'],
    ['System Throughput (X):', 'Throughput = Total Completed Tasks / Makespan (tasks per time unit).'],
  ];

  let formY = curY + 5;
  formulas.forEach(([lhs, rhs]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(lhs, margin + 4, formY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(rhs, margin + 50, formY);
    formY += 5.5;
  });

  // ==========================================================================
  // PAGE 5: CHAPTER 4 - THREAD SYNCHRONIZATION & CONCURRENCY
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(5, 7, 'Chapter 4: Thread Synchronization');

  curY = 22;
  curY = drawSectionHeader(curY, '4.', 'THREAD SYNCHRONIZATION & CONCURRENCY CONTROL');

  curY = drawSubHeader(curY, '4.1', 'The Critical Section Problem in Ready Queues');
  const p4_1 =
    "A Critical Section is any segment of code that accesses shared mutable state (in our case, the head and tail pointers of the shared ready queue). If two worker threads W1 and W2 concurrently attempt to dequeue a task without mutual exclusion, a Race Condition ensues:\n" +
    "• Lost Updates: Both threads read the same head pointer, executing the exact same task twice while leaking the subsequent queue node.\n" +
    "• Memory Corruption: Pointer updates tear midway through instruction execution, causing dangling pointer dereferences and segmentation faults.";
  doc.text(doc.splitTextToSize(p4_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 25;

  curY = drawSubHeader(curY, '4.2', 'Mutual Exclusion & Spurious Wakeup Guarding');
  const p4_2 =
    "To achieve race-free execution, the simulator models two synchronization primitives:\n" +
    "1. Mutex (pthread_mutex_t): Guarantees that only ONE thread operates within the ready queue dequeue/enqueue routine at any given instant.\n" +
    "2. Condition Variable (pthread_cond_t): Provides a block-and-wake mechanism. When the queue is empty, workers sleep rather than spinning.\n" +
    "Spurious Wakeup Defense: Operating system kernel schedulers and POSIX specifications note that threads waiting on condition variables may occasionally wake up without an explicit signal (spurious wakeups). Consequently, the condition must ALWAYS be evaluated inside a while loop rather than an if statement:\n" +
    "    while (queue_is_empty && !shutdown) pthread_cond_wait(&cond, &mutex);";
  doc.text(doc.splitTextToSize(p4_2, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 32;

  curY = drawSubHeader(curY, '4.3', 'POSIX C Thread Pool Implementation Reference');
  // Draw C Code Box
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.roundedRect(margin, curY, contentWidth, 90, 2, 2, 'F');

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(226, 232, 240);

  const cCodeLines = [
    '// POSIX Pthreads Thread Pool Routine (Worker Loop)',
    'void* worker_thread_routine(void* arg) {',
    '    int thread_id = *(int*)arg;',
    '    while (1) {',
    '        // Step 1: Acquire Mutex before inspecting queue',
    '        pthread_mutex_lock(&pool_queue.lock);',
    '',
    '        // Step 2: Loop to guard against Spurious Wakeups',
    '        while (pool_queue.task_count == 0 && !pool_queue.shutdown) {',
    '            pthread_cond_wait(&pool_queue.cond_empty, &pool_queue.lock);',
    '        }',
    '        if (pool_queue.shutdown && pool_queue.task_count == 0) {',
    '            pthread_mutex_unlock(&pool_queue.lock);',
    '            pthread_exit(NULL);',
    '        }',
    '',
    '        // Step 3: Critical Section: Pop task from head',
    '        Task* task = pool_queue.head;',
    '        pool_queue.head = task->next;',
    '        pool_queue.task_count--;',
    '',
    '        // Step 4: Unlock Mutex immediately before CPU computation!',
    '        pthread_mutex_unlock(&pool_queue.lock);',
    '',
    '        // Step 5: Execute task in parallel without holding lock',
    '        execute_task_burst(thread_id, task);',
    '        free(task);',
    '    }',
    '    return NULL;',
    '}',
  ];

  let codeY = curY + 6;
  cCodeLines.forEach((line) => {
    if (line.startsWith('//')) {
      doc.setTextColor(148, 163, 184); // Gray comments
    } else if (line.includes('pthread_')) {
      doc.setTextColor(56, 189, 248); // Cyan highlights
    } else {
      doc.setTextColor(241, 245, 249);
    }
    doc.text(line, margin + 4, codeY);
    codeY += 3.2;
  });

  // ==========================================================================
  // PAGE 6: CHAPTER 5 - EXPERIMENTAL RESULTS & POLICY BENCHMARKING
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(6, 7, 'Chapter 5: Experimental Results');

  curY = 22;
  curY = drawSectionHeader(curY, '5.', 'EXPERIMENTAL RESULTS & BENCHMARK COMPARISON');

  curY = drawSubHeader(curY, '5.1', 'Workload Configuration & Experimental Setup');
  const p5_1 = `The simulator was evaluated on the active project dataset comprising ${tasks.length} tasks scheduled across ${threadCount} worker threads. In Round Robin mode, the time quantum was set to ${timeQuantum} time units. All tasks arrived at system startup timestamp t = 0.`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(p5_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 12;

  curY = drawSubHeader(curY, '5.2', 'Comparative Performance Benchmark Table');

  // Benchmark Results Table
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, curY, contentWidth, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin, curY, contentWidth, 38);

  // Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Scheduling Policy', margin + 4, curY + 5.5);
  doc.text('Avg Wait (WT)', margin + 45, curY + 5.5);
  doc.text('Avg TAT', margin + 80, curY + 5.5);
  doc.text('CPU Util %', margin + 110, curY + 5.5);
  doc.text('Makespan', margin + 138, curY + 5.5);
  doc.text('Switches', margin + 160, curY + 5.5);

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, curY + 8, margin + contentWidth, curY + 8);

  const policyRows = [
    [
      'First-Come First-Served (FCFS)',
      `${fcfsResult.metrics.avgWaitingTime} u`,
      `${fcfsResult.metrics.avgTurnaroundTime} u`,
      `${fcfsResult.metrics.cpuUtilization} %`,
      `${fcfsResult.metrics.makespan} u`,
      `${fcfsResult.metrics.contextSwitches}`,
    ],
    [
      `Round Robin (RR, q=${timeQuantum})`,
      `${rrResult.metrics.avgWaitingTime} u`,
      `${rrResult.metrics.avgTurnaroundTime} u`,
      `${rrResult.metrics.cpuUtilization} %`,
      `${rrResult.metrics.makespan} u`,
      `${rrResult.metrics.contextSwitches}`,
    ],
    [
      'Priority (Non-preemptive)',
      `${priorityResult.metrics.avgWaitingTime} u`,
      `${priorityResult.metrics.avgTurnaroundTime} u`,
      `${priorityResult.metrics.cpuUtilization} %`,
      `${priorityResult.metrics.makespan} u`,
      `${priorityResult.metrics.contextSwitches}`,
    ],
  ];

  let rowY = curY + 14;
  policyRows.forEach(([pName, wt, tat, util, ms, sw], idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(pName, margin + 4, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(wt, margin + 45, rowY);
    doc.text(tat, margin + 80, rowY);
    doc.text(util, margin + 110, rowY);
    doc.text(ms, margin + 138, rowY);
    doc.text(sw, margin + 160, rowY);

    if (idx < policyRows.length - 1) {
      doc.setDrawColor(241, 245, 249);
      doc.line(margin + 2, rowY + 3, margin + contentWidth - 2, rowY + 3);
    }
    rowY += 9;
  });

  curY += 46;

  curY = drawSubHeader(curY, '5.3', 'Visual Benchmark Chart & Metric Distribution');
  // Draw Mini Horizontal Bar Chart in PDF
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, curY, contentWidth, 42, 2, 2, 'FD');

  const maxWait = Math.max(fcfsResult.metrics.avgWaitingTime, rrResult.metrics.avgWaitingTime, priorityResult.metrics.avgWaitingTime, 1);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Comparative Waiting Time Visualization (Lower Bar = Higher Efficiency):', margin + 4, curY + 6);

  const barData = [
    { label: 'FCFS', val: fcfsResult.metrics.avgWaitingTime, color: [6, 182, 212] },
    { label: 'Round Robin', val: rrResult.metrics.avgWaitingTime, color: [245, 158, 11] },
    { label: 'Priority', val: priorityResult.metrics.avgWaitingTime, color: [139, 92, 246] },
  ];

  let barY = curY + 13;
  barData.forEach((b) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(b.label, margin + 4, barY + 3.5);

    // Background track
    doc.setFillColor(226, 232, 240);
    doc.rect(margin + 28, barY, 110, 4.5, 'F');

    // Filled bar
    const barWidth = Math.max(4, (b.val / maxWait) * 110);
    doc.setFillColor(b.color[0], b.color[1], b.color[2]);
    doc.rect(margin + 28, barY, barWidth, 4.5, 'F');

    // Value label
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${b.val} u`, margin + 142, barY + 3.5);

    barY += 8.5;
  });

  curY += 50;

  curY = drawSubHeader(curY, '5.4', 'Empirical Observations & Findings');
  const p5_4 =
    "1. Multi-Core FCFS Behavior: Because N worker threads execute tasks in parallel, the convoy effect is notably dampened compared to uniprocessor setups. However, when multiple long tasks occupy all N threads simultaneously, shorter tasks experience queuing latency spikes.\n" +
    "2. Round Robin Preemption Trade-off: Round Robin provides bounded response times and fair CPU sharing, but registered " +
    rrResult.metrics.contextSwitches +
    " context switches. On real hardware, context switches involve flushing translation lookaside buffers (TLB) and register dumps.\n" +
    "3. Priority Performance: In applications where task urgency varies (e.g., interrupt handlers vs background indexers), Priority scheduling dramatically reduces wait times for critical processes.";
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(p5_4, contentWidth), margin, curY, { lineHeightFactor: 1.35 });

  // ==========================================================================
  // PAGE 7: CHAPTER 6 - CONCLUSION, VIVA QUESTIONS & REFERENCES
  // ==========================================================================
  doc.addPage();
  addHeaderFooter(7, 7, 'Chapter 6: Conclusion & Viva References');

  curY = 22;
  curY = drawSectionHeader(curY, '6.', 'CONCLUSION, VIVA EXAM PREPARATION & REFERENCES');

  curY = drawSubHeader(curY, '6.1', 'Conclusion & Summary of Learnings');
  const p6_1 =
    "This project successfully designed and implemented a Multithreaded Task Scheduler Simulator modeling an N-worker thread pool with shared queue synchronization. By combining simulated POSIX synchronization primitives with discrete-event time progression, the tool bridges theoretical OS principles with observable runtime dynamics. The interactive Gantt chart and side-by-side policy comparisons demonstrate how thread pools maximize CPU utilization while eliminating thread creation overhead.";
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(p6_1, contentWidth), margin, curY, { lineHeightFactor: 1.35 });
  curY += 24;

  curY = drawSubHeader(curY, '6.2', 'Key Viva Voce Questions & Answers');

  const vivaQuestions = [
    [
      'Q1: Why is a thread pool preferred over spawning a new thread for each task?',
      'Ans: Spawning threads per task causes severe kernel overhead: allocating TCBs, stacks, and scheduling overhead. A thread pool pre-allocates N reusable worker threads, bounding resource consumption and eliminating creation latency.',
    ],
    [
      'Q2: Why must pthread_cond_wait be invoked inside a while loop rather than an if condition?',
      'Ans: Due to Spurious Wakeups (threads waking without an explicit signal) and race conditions where another thread dequeues the item first. The condition must be re-evaluated upon re-acquiring the mutex lock.',
    ],
    [
      'Q3: What is the convoy effect in FCFS and how does multithreading alleviate it?',
      'Ans: Convoy effect occurs when lightweight processes wait behind a massive burst task. In a multithreaded pool with N workers, up to N tasks run simultaneously, allowing short tasks to execute on adjacent cores.',
    ],
    [
      'Q4: How does time quantum size affect Round Robin performance?',
      'Ans: If quantum q is too small, context switch overhead dominates CPU cycles. If q is very large, Round Robin degenerates into non-preemptive FCFS. Ideal q ensures ~80% of tasks finish within 1 quantum.',
    ],
    [
      'Q5: How is multi-core CPU utilization formulated?',
      'Ans: Utilization = (Total Active Busy Time across all N threads / (N * Makespan)) * 100%. If all threads compute continuously without idling, utilization reaches 100%.',
    ],
  ];

  vivaQuestions.forEach(([q, a]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(14, 116, 144);
    doc.text(q, margin, curY);
    curY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitA = doc.splitTextToSize(a, contentWidth);
    doc.text(splitA, margin, curY, { lineHeightFactor: 1.3 });
    curY += splitA.length * 4.2 + 2;
  });

  curY = drawSubHeader(curY, '6.3', 'Academic References & Standards');
  const refs = [
    '[1] Silberschatz, A., Galvin, P. B., & Gagne, G. "Operating System Concepts", 10th Edition, Wiley, 2018.',
    '[2] Tanenbaum, A. S., & Bos, H. "Modern Operating Systems", 4th Edition, Pearson, 2015.',
    '[3] IEEE Std 1003.1-2017: IEEE Standard for Information Technology—Portable Operating System Interface (POSIX).',
    '[4] Butenhof, D. R. "Programming with POSIX Threads", Addison-Wesley Professional, 1997.',
  ];

  refs.forEach((ref) => {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(ref, margin, curY);
    curY += 4;
  });

  return doc;
}
