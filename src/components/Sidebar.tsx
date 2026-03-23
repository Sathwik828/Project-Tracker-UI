import { LayoutDashboard, ListTodo, CalendarDays, Users, Settings, BarChart3 } from "lucide-react";
import { useStore } from "../store.ts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { view, setView } = useStore();

  const navItems = [
    { id: "Kanban", icon: LayoutDashboard, label: "Kanban Board" },
    { id: "List", icon: ListTodo, label: "List View" },
    { id: "Timeline", icon: CalendarDays, label: "Timeline" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <LayoutDashboard size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">ProjectX</h1>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                view === item.id 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="pt-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
            <Users size={20} />
            Team
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors mt-1">
            <BarChart3 size={20} />
            Analytics
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors mt-1">
            <Settings size={20} />
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
};
