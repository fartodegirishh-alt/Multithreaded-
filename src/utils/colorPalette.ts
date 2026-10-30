/**
 * High-contrast, vibrant color palette for OS tasks in dark mode.
 * Each task has a consistent unique color index across the Ready Queue,
 * Worker Threads, and Gantt Timeline.
 */

export interface ColorScheme {
  id: number;
  name: string;
  hex: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
  glowClass: string;
}

export const TASK_COLORS: ColorScheme[] = [
  {
    id: 0,
    name: 'Cyan',
    hex: '#06b6d4',
    bgClass: 'bg-cyan-500/20',
    borderClass: 'border-cyan-500/50',
    textClass: 'text-cyan-300',
    badgeBg: 'bg-cyan-500 text-cyan-950',
    glowClass: 'shadow-[0_0_12px_rgba(6,182,212,0.35)]',
  },
  {
    id: 1,
    name: 'Violet',
    hex: '#8b5cf6',
    bgClass: 'bg-purple-500/20',
    borderClass: 'border-purple-500/50',
    textClass: 'text-purple-300',
    badgeBg: 'bg-purple-500 text-purple-950',
    glowClass: 'shadow-[0_0_12px_rgba(139,92,246,0.35)]',
  },
  {
    id: 2,
    name: 'Emerald',
    hex: '#10b981',
    bgClass: 'bg-emerald-500/20',
    borderClass: 'border-emerald-500/50',
    textClass: 'text-emerald-300',
    badgeBg: 'bg-emerald-500 text-emerald-950',
    glowClass: 'shadow-[0_0_12px_rgba(16,185,129,0.35)]',
  },
  {
    id: 3,
    name: 'Amber',
    hex: '#f59e0b',
    bgClass: 'bg-amber-500/20',
    borderClass: 'border-amber-500/50',
    textClass: 'text-amber-300',
    badgeBg: 'bg-amber-500 text-amber-950',
    glowClass: 'shadow-[0_0_12px_rgba(245,158,11,0.35)]',
  },
  {
    id: 4,
    name: 'Rose',
    hex: '#f43f5e',
    bgClass: 'bg-rose-500/20',
    borderClass: 'border-rose-500/50',
    textClass: 'text-rose-300',
    badgeBg: 'bg-rose-500 text-rose-950',
    glowClass: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]',
  },
  {
    id: 5,
    name: 'Blue',
    hex: '#3b82f6',
    bgClass: 'bg-blue-500/20',
    borderClass: 'border-blue-500/50',
    textClass: 'text-blue-300',
    badgeBg: 'bg-blue-500 text-blue-950',
    glowClass: 'shadow-[0_0_12px_rgba(59,130,246,0.35)]',
  },
  {
    id: 6,
    name: 'Teal',
    hex: '#14b8a6',
    bgClass: 'bg-teal-500/20',
    borderClass: 'border-teal-500/50',
    textClass: 'text-teal-300',
    badgeBg: 'bg-teal-500 text-teal-950',
    glowClass: 'shadow-[0_0_12px_rgba(20,184,166,0.35)]',
  },
  {
    id: 7,
    name: 'Orange',
    hex: '#f97316',
    bgClass: 'bg-orange-500/20',
    borderClass: 'border-orange-500/50',
    textClass: 'text-orange-300',
    badgeBg: 'bg-orange-500 text-orange-950',
    glowClass: 'shadow-[0_0_12px_rgba(249,115,22,0.35)]',
  },
  {
    id: 8,
    name: 'Pink',
    hex: '#ec4899',
    bgClass: 'bg-pink-500/20',
    borderClass: 'border-pink-500/50',
    textClass: 'text-pink-300',
    badgeBg: 'bg-pink-500 text-pink-950',
    glowClass: 'shadow-[0_0_12px_rgba(236,72,153,0.35)]',
  },
  {
    id: 9,
    name: 'Lime',
    hex: '#84cc16',
    bgClass: 'bg-lime-500/20',
    borderClass: 'border-lime-500/50',
    textClass: 'text-lime-300',
    badgeBg: 'bg-lime-500 text-lime-950',
    glowClass: 'shadow-[0_0_12px_rgba(132,204,22,0.35)]',
  },
  {
    id: 10,
    name: 'Indigo',
    hex: '#6366f1',
    bgClass: 'bg-indigo-500/20',
    borderClass: 'border-indigo-500/50',
    textClass: 'text-indigo-300',
    badgeBg: 'bg-indigo-500 text-indigo-950',
    glowClass: 'shadow-[0_0_12px_rgba(99,102,241,0.35)]',
  },
  {
    id: 11,
    name: 'Fuchsia',
    hex: '#d946ef',
    bgClass: 'bg-fuchsia-500/20',
    borderClass: 'border-fuchsia-500/50',
    textClass: 'text-fuchsia-300',
    badgeBg: 'bg-fuchsia-500 text-fuchsia-950',
    glowClass: 'shadow-[0_0_12px_rgba(217,70,239,0.35)]',
  },
];

export function getTaskColor(colorIndex: number): ColorScheme {
  const index = Math.abs(colorIndex) % TASK_COLORS.length;
  return TASK_COLORS[index];
}
