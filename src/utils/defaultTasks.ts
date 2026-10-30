import { TaskDefinition } from '../types/scheduler';

export const INITIAL_DEFAULT_TASKS: TaskDefinition[] = [
  {
    id: 'T1',
    name: 'Matrix Multiplication (GPU offload)',
    burstTime: 7,
    priority: 2,
    colorIndex: 0,
    arrivalTime: 0,
  },
  {
    id: 'T2',
    name: 'Disk Buffer Cache Flush',
    burstTime: 4,
    priority: 1, // Highest priority
    colorIndex: 1,
    arrivalTime: 0,
  },
  {
    id: 'T3',
    name: 'TCP Packet Stream Checksum',
    burstTime: 6,
    priority: 3,
    colorIndex: 2,
    arrivalTime: 0,
  },
  {
    id: 'T4',
    name: 'Page Frame Zeroing Daemon',
    burstTime: 3,
    priority: 1, // Highest priority
    colorIndex: 3,
    arrivalTime: 0,
  },
  {
    id: 'T5',
    name: 'SHA-256 Crypto Key Hash',
    burstTime: 9,
    priority: 4,
    colorIndex: 4,
    arrivalTime: 0,
  },
  {
    id: 'T6',
    name: 'Audio DMA Buffer Synthesis',
    burstTime: 5,
    priority: 2,
    colorIndex: 5,
    arrivalTime: 0,
  },
  {
    id: 'T7',
    name: 'Garbage Collector Mark Sweep',
    burstTime: 8,
    priority: 5, // Lowest priority
    colorIndex: 6,
    arrivalTime: 0,
  },
];

const RANDOM_TASK_NAMES = [
  'Database WAL Commit',
  'TLS Handshake Verification',
  'File Index Compression',
  'Network Frame Demuxing',
  'Process Memory Compaction',
  'Kernel Interrupt Handler',
  'VFS Inode Metadata Sync',
  'DNS Cache Lookup',
  'RAID Parity Calculation',
  'IPC Message Queue Dispatch',
  'Memory Heap Reallocation',
  'Display Scanout Compositor',
  'Video Slice Decoding',
  'Log Stream Rotation',
  'AES Block Cipher Encryption',
];

export function generateRandomTasks(count: number = 10, startIdNumber: number = 1): TaskDefinition[] {
  const tasks: TaskDefinition[] = [];
  const shuffledNames = [...RANDOM_TASK_NAMES].sort(() => 0.5 - Math.random());

  for (let i = 0; i < count; i++) {
    const idNum = startIdNumber + i;
    const name = shuffledNames[i % shuffledNames.length];
    // Burst time between 2 and 12 for reasonable simulation times
    const burstTime = Math.floor(Math.random() * 11) + 2;
    // Priority 1 to 5 (1 is highest)
    const priority = Math.floor(Math.random() * 5) + 1;

    tasks.push({
      id: `T${idNum}`,
      name: `${name} #${idNum}`,
      burstTime,
      priority,
      colorIndex: (idNum - 1) % 12,
      arrivalTime: 0,
    });
  }

  return tasks;
}
