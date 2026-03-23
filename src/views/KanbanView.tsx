import { useMemo, useState } from "react";
import { useStore } from "../store.ts";
import { Status, Task, USERS, User } from "../types.ts";
import { Calendar, AlertCircle, Clock } from "lucide-react";
import { useCollaboration } from "../hooks/useCollaboration.ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLUMNS: Status[] = ["To Do", "In Progress", "In Review", "Done"];

export const KanbanView = () => {
  const { tasks, updateTaskStatus, filters, openModal } = useStore();
  const presence = useCollaboration(tasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dropTargetStatus, setDropTargetStatus] = useState<Status | null>(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch = filters.status.length === 0 || filters.status.includes(task.status);
      const priorityMatch = filters.priority.length === 0 || filters.priority.includes(task.priority);
      const assigneeMatch = filters.assignee.length === 0 || filters.assignee.includes(task.assigneeId);
      return statusMatch && priorityMatch && assigneeMatch;
    });
  }, [tasks, filters]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDropTargetStatus(null);
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-1 overflow-x-auto thin-scrollbar p-4 lg:p-8">
        <div className="flex gap-6 min-w-max lg:min-w-0 h-full">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column);
            const isActive = dropTargetStatus === column;

            return (
              <div
                key={column}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDropTargetStatus(column);
                }}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData("taskId");
                  if (id) updateTaskStatus(id, column);
                  setDropTargetStatus(null);
                  setDraggedTaskId(null);
                }}
                onDragLeave={() => setDropTargetStatus(null)}
                className={cn(
                  "flex-shrink-0 w-80 flex flex-col h-full rounded-xl transition-colors duration-200",
                  isActive ? "bg-primary/5" : "bg-transparent"
                )}
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider">{column}</h3>
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded-full text-[10px] font-bold">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "flex-1 overflow-y-auto pr-2 space-y-3 thin-scrollbar",
                  isActive && "ring-2 ring-primary/20 ring-inset rounded-lg"
                )}>
                  {columnTasks.length === 0 ? (
                    <div className="h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-card/50">
                      <div className="text-xs font-medium">No tasks yet</div>
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        collaborators={presence.filter(p => p.taskId === task.id).map(p => USERS.find(u => u.id === p.userId)!)}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        componentClick={() => openModal(task)}
                        onDragEnd={handleDragEnd}
                        isDragging={draggedTaskId === task.id}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  collaborators: User[];
  onDragStart: (e: React.DragEvent) => void;
  componentClick: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TaskCard = ({ task, collaborators, onDragStart, componentClick, onDragEnd, isDragging }: TaskCardProps) => {
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < now && task.status !== "Done";
  const isDueToday = task.dueDate === now.toISOString().split('T')[0];

  const getPriorityColor = (p: Task["priority"]) => {
    switch (p) {
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200 text-slate-500";
    }
  };

  const formatDate = (date: string) => {
    if (isDueToday) return "Due Today";
    const d = new Date(date);
    const n = new Date();
    const diff = n.getTime() - d.getTime();
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (diffDays > 7 && isOverdue) return `${diffDays} days overdue`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={componentClick}
      className={cn(
        "bg-card group border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all cursor-grab active:cursor-grabbing relative",
        isDragging && "opacity-40 scale-95 grayscale shadow-none border-dashed"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <span className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
          getPriorityColor(task.priority)
        )}>
          {task.priority}
        </span>
        
        {collaborators.length > 0 && (
          <div className="flex -space-x-1.5 animate-in fade-in slide-in-from-top-1">
            {collaborators.map(c => (
              <div key={c.id} className={cn("w-5 h-5 rounded-full border-2 border-card flex items-center justify-center text-[8px] font-bold text-white shadow-sm", c.color)} title={`${c.name} is viewing`}>
                {c.initials}
              </div>
            ))}
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold mb-2 leading-snug line-clamp-2">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className={cn(
          "flex items-center gap-1.5 text-[10px] font-medium",
          isOverdue ? "text-destructive" : isDueToday ? "text-orange-500" : "text-muted-foreground"
        )}>
          {isOverdue ? <AlertCircle size={12} /> : isDueToday ? <Clock size={12} /> : <Calendar size={12} />}
          {formatDate(task.dueDate)}
        </div>

        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-2 ring-card", assignee?.color || "bg-slate-400")}>
          {assignee?.initials || "??"}
        </div>
      </div>
    </div>
  );
};
