import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  AlertOctagon,
  ShieldCheck,
  Code2,
  FileText,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface SyncExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncExplanationModal: React.FC<SyncExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cCodeSnippet = `// Multithreaded Task Scheduler Thread Pool (POSIX Pthreads)
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

// Shared Task Queue Node
typedef struct Task {
    int id;
    int burst_time;
    int priority;
    struct Task* next;
} Task;

// Thread Pool Synchronization Primitives
typedef struct {
    Task* queue_head;
    Task* queue_tail;
    int task_count;
    pthread_mutex_t lock;      // Mutual Exclusion: protects shared queue
    pthread_cond_t cond_empty;  // Condition Variable: signals idle workers
    bool shutdown;
} TaskQueue;

TaskQueue pool_queue;

// Worker Thread Function
void* worker_thread_routine(void* arg) {
    int thread_id = *(int*)arg;

    while (1) {
        // 1. ACQUIRE MUTEX BEFORE ENTERING CRITICAL SECTION
        pthread_mutex_lock(&pool_queue.lock);

        // 2. WAIT ON CONDITION VARIABLE WHILE QUEUE IS EMPTY
        // (Must use while-loop to guard against Spurious Wakeups)
        while (pool_queue.task_count == 0 && !pool_queue.shutdown) {
            pthread_cond_wait(&pool_queue.cond_empty, &pool_queue.lock);
        }

        if (pool_queue.shutdown && pool_queue.task_count == 0) {
            pthread_mutex_unlock(&pool_queue.lock);
            pthread_exit(NULL);
        }

        // 3. CRITICAL SECTION: SAFELY DEQUEUE TASK
        Task* task = pool_queue.queue_head;
        pool_queue.queue_head = task->next;
        pool_queue.task_count--;

        // 4. RELEASE MUTEX IMMEDIATELY: NEVER HOLD LOCK DURING WORK EXECUTION!
        pthread_mutex_unlock(&pool_queue.lock);

        // 5. EXECUTE TASK (PARALLEL EXECUTION WITHOUT BLOCKING OTHER THREADS)
        printf("[Worker %d] Executing Task #%d (Burst: %d units)\\n",
               thread_id, task->id, task->burst_time);
        // ... simulate task computation ...
        free(task);
    }
    return NULL;
}

// Enqueue Task (Producer)
void submit_task(Task* new_task) {
    pthread_mutex_lock(&pool_queue.lock);

    // Critical Section: Add to tail
    new_task->next = NULL;
    if (pool_queue.queue_tail) {
        pool_queue.queue_tail->next = new_task;
    } else {
        pool_queue.queue_head = new_task;
    }
    pool_queue.queue_tail = new_task;
    pool_queue.task_count++;

    // Signal one waiting worker that work is ready
    pthread_cond_signal(&pool_queue.cond_empty);

    pthread_mutex_unlock(&pool_queue.lock);
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cCodeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                OS Thread Synchronization & Concurrency Guide
              </h2>
              <p className="text-xs text-slate-400">
                Viva Explanations: Mutexes, Condition Variables, Race Conditions & Critical Sections
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Conceptual 3-Pillar Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Mutex */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Lock className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    1. Mutex (Mutual Exclusion)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  A binary lock (<code className="text-amber-300 font-mono">pthread_mutex_t</code>) that guarantees <strong>only ONE thread</strong> executes inside the critical section at any given nanosecond.
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  <strong>In our app:</strong> When Thread 1 pops a task from the shared queue, other threads are held at the mutex until the pop pointer updates complete.
                </div>
              </div>
            </div>

            {/* 2. Condition Variable */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    2. Condition Variable
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  Used by worker threads to <strong>sleep efficiently</strong> when the shared queue is empty, eliminating wasteful CPU spinning (busy-waiting).
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  <code className="text-cyan-300 font-mono">pthread_cond_wait()</code> atomically releases the mutex and suspends the thread. When a new task arrives, <code className="text-cyan-300 font-mono">pthread_cond_signal()</code> wakes it up.
                </div>
              </div>
            </div>

            {/* 3. Race Conditions */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-400 mb-2">
                  <AlertOctagon className="w-4 h-4" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    3. Race Condition Avoidance
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  A race condition occurs when concurrent threads access shared data without synchronization, causing non-deterministic errors.
                </p>
                <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800">
                  <strong>Without a mutex:</strong> Two threads could simultaneously read <code className="text-rose-300 font-mono">queue_head</code>, resulting in <em>double task dispatch</em> or memory corruption!
                </div>
              </div>
            </div>
          </div>

          {/* Golden Rules of Thread Synchronization */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Golden Rules for Your OS Viva Examination
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <strong>Always use a while loop for cond_wait:</strong> Condition variables can wake up spontaneously (<em className="text-amber-300">spurious wakeups</em>). Always re-test the queue condition: <code className="text-cyan-300 font-mono">while(queue.empty) pthread_cond_wait(...)</code>.
              </li>
              <li>
                <strong>Minimize critical section duration:</strong> Never execute long CPU tasks while holding the mutex lock! Release the lock as soon as the task pointer is retrieved.
              </li>
              <li>
                <strong>Thread Pool Scalability:</strong> Creating threads is expensive (stack allocation, context switching). A thread pool reuses N pre-allocated threads throughout the app's lifetime.
              </li>
            </ul>
          </div>

          {/* POSIX C Code Snippet */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>pthread_threadpool.c (Real POSIX Implementation)</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy C Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-80 scrollbar-thin">
              <code>{cCodeSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
