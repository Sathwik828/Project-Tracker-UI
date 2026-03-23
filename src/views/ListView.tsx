import { useMemo, useRef, useState, useEffect } from "react";
import { useStore } from "../store.ts";
import { Task, USERS, Status, Priority } from "../types.ts";
import { ChevronUp, ChevronDown, MoreHorizontal, AlertCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROW_HEIGHT = 56;
const BUFFER = 5;

export const ListView = () => {
  const { tasks, filters, sortBy, setSortBy, updateTaskStatus, clearFilters, openModal } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
      const assigneeMatch = filters.assignee.length === 0 || filters.assignee.includes(task.assigneeId);
      return statusMatch && priorityMatch && assigneeMatch;
    });

    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a[sortBy.field] as string) || "";
        const bValue = (b[sortBy.field] as string) || "";
        if (aValue < bValue) return sortBy.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortBy.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tasks, filters, sortBy]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(filteredTasks.length, Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER);
  const visibleTasks = filteredTasks.slice(startIndex, endIndex);

  const totalHeight = filteredTasks.length * ROW_HEIGHT;
  const translateY = startIndex * ROW_HEIGHT;

  const handleSort = (field: keyof Task) => {
    if (sortBy?.field === field) {
      setSortBy({ field, direction: sortBy.direction === "asc" ? "desc" : "asc" });
    } else {
      setSortBy({ field, direction: "asc" });
    }
  };

  return (
    <div className="h-full flex flex-col bg-card overflow-x-auto thin-scrollbar">
      <div className="min-w-[800px] flex flex-col h-full">
        <div className="flex items-center border-b border-border bg-muted/50 px-8 py-3 shrink-0">
          <div className="w-1/3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("title")}>
            Title
            {sortBy?.field === "title" && (sortBy.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </div>
          <div className="w-1/6 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("status")}>
            Status
            {sortBy?.field === "status" && (sortBy.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </div>
          <div className="w-1/6 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("priority")}>
            Priority
            {sortBy?.field === "priority" && (sortBy.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </div>
          <div className="w-1/6 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 cursor-pointer select-none" onClick={() => handleSort("dueDate")}>
            Due Date
            {sortBy?.field === "dueDate" && (sortBy.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
          </div>
          <div className="w-1/6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Assignee</div>
        </div>

        <div 
          ref={containerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto thin-scrollbar relative"
        >
          <div style={{ height: totalHeight, width: "100%" }}>
            <div 
              style={{ 
                transform: `translateY(${translateY}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0
              }}
            >
              {visibleTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                  <p className="text-sm font-medium">No tasks match your filters</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 text-primary font-semibold text-xs"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                visibleTasks.map((task) => (
                  <ListRow 
                    key={task.id} 
                    task={task} 
                    onStatusChange={updateTaskStatus} 
                    onEdit={() => openModal(task)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ListRow = ({ 
  task, 
  onStatusChange,
  onEdit
}: { 
  task: Task, 
  onStatusChange: (id: string, s: Status) => void,
  onEdit: () => void
}) => {
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "Done";
  
  const getPriorityStyles = (p: Priority) => {
    switch (p) {
      case "Critical": return "bg-red-500/10 text-red-600";
      case "High": return "bg-orange-500/10 text-orange-600";
      case "Medium": return "bg-blue-500/10 text-blue-600";
      default: return "bg-emerald-500/10 text-emerald-600";
    }
  };

  return (
    <div 
      className="h-14 flex items-center px-8 border-b border-border/50 hover:bg-muted/30 transition-colors group cursor-pointer"
      onClick={onEdit}
    >
      <div className="w-1/3 flex items-center gap-3">
        <div className={cn("w-2 h-2 rounded-full", getPriorityStyles(task.priority).split(" ")[0].replace("/10", ""))} />
        <span className="text-sm font-medium truncate pr-4">{task.title}</span>
      </div>
      
      <div className="w-1/6" onClick={(e) => e.stopPropagation()}>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer border-none p-0 hover:text-primary transition-colors"
        >
          {(["To Do", "In Progress", "In Review", "Done"] as Status[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="w-1/6">
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight", getPriorityStyles(task.priority))}>
          {task.priority}
        </span>
      </div>

      <div className={cn("w-1/6 text-xs font-medium flex items-center gap-1.5", isOverdue ? "text-destructive" : "text-muted-foreground")}>
        {isOverdue && <AlertCircle size={12} />}
        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>

      <div className="w-1/6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-card", assignee?.color || "bg-slate-400")}>
            {assignee?.initials || "??"}
          </div>
          <span className="text-xs text-muted-foreground truncate max-w-[80px]">{assignee?.name.split(" ")[0] || "Unassigned"}</span>
        </div>
        <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
          <MoreHorizontal size={14} />
        </button>
      </div>
    </div>
  );
};
