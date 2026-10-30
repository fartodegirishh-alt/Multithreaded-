import React, { useRef, useEffect } from 'react';
import { BarChart, Clock, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { GanttBlock } from '../types/scheduler';
import { getTaskColor } from '../utils/colorPalette';

interface GanttChartProps {
  ganttBlocks: GanttBlock[];
  threadCount: number;
  currentTime: number;
  isFinished: boolean;
}

export const GanttChart: React.FC<GanttChartProps> = ({
  ganttBlocks,
  threadCount,
  currentTime,
  isFinished,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Time unit width in pixels (e.g. 28px per time unit)
  const unitWidth = 32;
  const maxTime = Math.max(currentTime, 15);
  const totalWidth = maxTime * unitWidth;

  // Auto-scroll to current time during simulation
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [currentTime]);

  const threadIds = Array.from({ length: threadCount }, (_, i) => i + 1);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
            <BarChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Live Multithreaded Gantt Timeline
            </h2>
            <p className="text-xs text-slate-400">
              Per-worker thread execution blocks synchronized across time ticks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Span: 0 → {currentTime}u
          </span>
        </div>
      </div>

      {/* Gantt Timeline Scroll Container */}
      <div
        ref={containerRef}
        className="border border-slate-800 rounded-xl bg-slate-950/80 overflow-x-auto p-4 scrollbar-thin"
      >
        <div style={{ minWidth: `${totalWidth + 120}px` }}>
          {/* Time Axis Header */}
          <div className="flex items-center border-b border-slate-800/80 pb-2 mb-2 font-mono text-xs text-slate-400">
            <div className="w-24 flex-shrink-0 font-semibold text-slate-300">
              Timeline (t)
            </div>
            <div className="relative flex-1 h-6">
              {Array.from({ length: maxTime + 1 }).map((_, t) => (
                <div
                  key={t}
                  className="absolute top-0 flex flex-col items-center -translate-x-1/2"
                  style={{ left: `${t * unitWidth}px` }}
                >
                  <span className="text-[10px] text-slate-400">{t}</span>
                  <div className={`w-[1px] ${t % 5 === 0 ? 'h-2 bg-slate-500' : 'h-1 bg-slate-700'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Thread Rows */}
          <div className="space-y-2">
            {threadIds.map((threadId) => {
              const blocks = ganttBlocks.filter((b) => b.threadId === threadId);

              return (
                <div key={threadId} className="flex items-center group">
                  {/* Thread Label */}
                  <div className="w-24 flex-shrink-0 flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 font-semibold">
                      Worker {threadId}
                    </span>
                  </div>

                  {/* Thread Timeline Track */}
                  <div
                    className="relative flex-1 h-9 bg-slate-900/50 rounded-lg border border-slate-800/80 overflow-hidden"
                    style={{ width: `${totalWidth}px` }}
                  >
                    {/* Time Grid Lines */}
                    {Array.from({ length: maxTime + 1 }).map((_, t) => (
                      <div
                        key={t}
                        className="absolute top-0 bottom-0 border-r border-slate-800/30 pointer-events-none"
                        style={{ left: `${t * unitWidth}px` }}
                      />
                    ))}

                    {/* Current Time Playhead line */}
                    {currentTime > 0 && (
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 z-20 shadow-[0_0_8px_rgba(6,182,212,0.8)] pointer-events-none"
                        style={{ left: `${currentTime * unitWidth}px` }}
                      />
                    )}

                    {/* Task Execution Blocks */}
                    {blocks.map((block) => {
                      const color = getTaskColor(block.colorIndex);
                      const left = block.startTime * unitWidth;
                      const width = Math.max(4, (block.endTime - block.startTime) * unitWidth);
                      const duration = block.endTime - block.startTime;

                      return (
                        <div
                          key={block.id}
                          className={`absolute top-1 bottom-1 rounded-md border flex items-center justify-center font-mono text-xs font-bold transition-all duration-150 cursor-pointer group/block shadow-sm ${color.bgClass} ${color.borderClass} ${color.textClass}`}
                          style={{
                            left: `${left}px`,
                            width: `${width - 2}px`,
                            backgroundColor: `${color.hex}33`,
                          }}
                          title={`${block.taskId} (${block.taskName})\nDuration: ${duration}u [${block.startTime} → ${block.endTime}]\nPriority: P${block.priority}`}
                        >
                          {/* Inner Label */}
                          <div className="truncate px-1 text-center pointer-events-none flex items-center gap-1">
                            <span>{block.taskId}</span>
                            {width > 60 && (
                              <span className="text-[10px] opacity-80 font-normal">
                                ({duration}u)
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
