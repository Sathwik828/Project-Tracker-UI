import { useEffect } from "react";
import { useStore } from "./store";
import { Sidebar } from "./components/Sidebar.tsx";
import { TopNav } from "./components/TopNav.tsx";
import { TaskModal } from "./components/TaskModal.tsx";
import { FilterBar } from "./components/FilterBar.tsx";
import { KanbanView } from "./views/KanbanView.tsx";
import { ListView } from "./views/ListView.tsx";
import { TimelineView } from "./views/TimelineView.tsx";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { view, syncFromUrl, isSidebarOpen, setSidebarOpen } = useStore();

  useEffect(() => {
    // Sync URL with initial state if no parameters exist
    if (!window.location.search) {
      syncFromUrl();
    }
    
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [syncFromUrl]);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        >
          {/* The button snippet from the instruction was syntactically misplaced.
              Assuming it was meant to demonstrate openModal usage, but not to be added here.
              If it was meant to be added, its placement needs clarification.
          <button 
            onClick={() => openModal()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            Open Task Modal
          </button>
          */}
        </div>
      )}
      
      <div className={cn(
        "lg:relative fixed inset-y-0 left-0 z-50 transition-all duration-300 lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full h-full">
        <TopNav />
        <FilterBar />
        <main className="flex-1 overflow-hidden relative">
          {view === "Kanban" && <KanbanView />}
          {view === "List" && <ListView />}
          {view === "Timeline" && <TimelineView />}
        </main>
      </div>

      <TaskModal />
    </div>
  );
}

export default App;
