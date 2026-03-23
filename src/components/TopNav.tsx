import { useState, useEffect } from "react";
import { Search, Bell, Plus, Menu } from "lucide-react";
import { USERS } from "../types.ts";
import { useStore } from "../store.ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const TopNav = () => {
  const [activeUsers, setActiveUsers] = useState<number>(3);
  const { view, setView, toggleSidebar, openModal } = useStore();

  const handleCreateTask = () => {
    openModal();
  };

  // Mock collaboration activity
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers((prev) => Math.max(2, Math.min(6, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors border border-border"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex items-center gap-1 bg-muted/30 p-1 rounded-xl">
          {(["Kanban", "List", "Timeline"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                view === v 
                  ? "bg-card text-primary shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {v}
            </button>
          ))}
        </div>
        
        <div className="relative w-full max-w-[200px] hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-muted/50 border-none rounded-full py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex -space-x-2">
            {USERS.slice(0, activeUsers).map((user) => (
              <div
                key={user.id}
                className={`w-7 h-7 rounded-full border-2 border-card ${user.color} flex items-center justify-center text-[8px] font-bold text-white shadow-sm`}
                title={user.name}
              >
                {user.initials}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-medium text-muted-foreground ml-1">
            {activeUsers} active
          </span>
        </div>

        <div className="hidden lg:block h-6 w-px bg-border mx-2" />

        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full border border-card" />
          </button>
          <button 
            onClick={handleCreateTask}
            className="bg-primary text-primary-foreground px-3 lg:px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95"
          >
            <Plus size={16} />
            <span className="hidden xs:inline text-xs lg:text-sm">Create Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
