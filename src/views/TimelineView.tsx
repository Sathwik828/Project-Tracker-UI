import { useMemo, useRef } from "react";
import { useStore } from "../store";
import { USERS } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAY_WIDTH = 120;
const ROW_HEIGHT = 60;

export const TimelineView = () => {
  const { tasks, filters } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
      const assigneeMatch = filters.assignee.length === 0 || filters.assignee.includes(task.assigneeId);
      return statusMatch && priorityMatch && assigneeMatch;
    }).slice(0, 50); // Limit for performance
  }, [tasks, filters]);

  const getDayPosition = (dateStr: string) => {
    const d = new Date(dateStr);
    if (d.getMonth() !== currentMonth || d.getFullYear() !== currentYear) {
       return d.getDate() * DAY_WIDTH;
    }
    return (d.getDate() - 1) * DAY_WIDTH;
  };

  const todayLineLeft = (now.getDate() - 1) * DAY_WIDTH + (now.getHours() / 24) * DAY_WIDTH;

  return (
    <div className="h-full flex flex-col bg-card overflow-hidden">
      <div className="h-10 border-b border-border bg-muted/30 flex items-center px-8 shrink-0">
        <span className="text-sm font-bold text-foreground">
          {now.toLocaleString('default', { month: 'long' })} {currentYear}
        </span>
      </div>

      <div className="flex-1 overflow-auto bg-muted/5 relative thin-scrollbar" ref={containerRef}>
        <div className="sticky top-0 z-20 flex bg-card border-b border-border h-10 w-max min-w-full">
          {days.map((day) => (
            <div 
              key={day} 
              className={cn(
                "w-[120px] flex-shrink-0 border-r border-border text-[10px] font-bold text-muted-foreground flex items-center justify-center",
                day === now.getDate() && "bg-primary/5 text-primary"
              )}
            >
              {day} {new Date(currentYear, currentMonth, day).toLocaleString('default', { weekday: 'short' })}
            </div>
          ))}
        </div>

        <div className="relative w-max min-w-full" style={{ height: filteredTasks.length * ROW_HEIGHT + 100 }}>
          <div className="absolute inset-0 flex pointer-events-none">
            {days.map((day) => (
              <div key={day} className="w-[120px] h-full border-r border-border/30" />
            ))}
          </div>

          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-10 pointer-events-none"
            style={{ left: todayLineLeft }}
          >
            <div className="w-3 h-3 bg-primary rounded-full -ml-[5px] -mt-1 shadow-lg border-2 border-card" />
          </div>

          <div className="relative pt-4 px-0">
            {filteredTasks.map((task) => {
              const start = task.startDate ? getDayPosition(task.startDate) : getDayPosition(task.dueDate);
              const end = getDayPosition(task.dueDate) + DAY_WIDTH;
              const width = Math.max(DAY_WIDTH / 2, end - start);
              
              const priorityColors: Record<string, string> = {
                Critical: "bg-red-500",
                High: "bg-orange-500",
                Medium: "bg-blue-500",
                Low: "bg-emerald-500"
              };

              const assignee = USERS.find(u => u.id === task.assigneeId);
              
              return (
                <div key={task.id} className="relative h-[60px] flex items-center">
                  <div 
                    className="absolute h-8 rounded-lg shadow-sm flex items-center px-3 text-[10px] font-bold text-white transition-all hover:scale-[1.02] cursor-pointer group whitespace-nowrap overflow-hidden"
                    style={{ 
                        left: start, 
                        width: width, 
                        backgroundColor: priorityColors[task.priority] || "bg-slate-500"
                    }}
                  >
                    <span className="truncate mr-2">{task.title}</span>
                    <div className="ml-auto flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       <div className={cn("w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white/20", assignee?.color || "bg-slate-400")}>
                          {assignee?.initials || "??"}
                       </div>
                    </div>
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
