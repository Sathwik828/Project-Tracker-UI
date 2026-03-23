import { create } from "zustand";
import { Task, Status, Priority } from "./types.ts";
import { generateTasks } from "./lib/seed.ts";

interface FilterState {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateRange: { from: string; to: string } | null;
}

interface AppState {
  tasks: Task[];
  view: "Kanban" | "List" | "Timeline";
  filters: FilterState;
  searchQuery: string;
  sortBy: { field: keyof Task; direction: "asc" | "desc" } | null;
  isSidebarOpen: boolean;
  isModalOpen: boolean;
  editingTask: Task | null;
  
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, status: Status) => void;
  setView: (view: AppState["view"]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: AppState["sortBy"]) => void;
  clearFilters: () => void;
  syncFromUrl: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (task?: Task) => void;
  closeModal: () => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}

const getInitialStateFromUrl = (): Partial<AppState> => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const view = params.get("view") as AppState["view"] || "Kanban";
  const status = params.get("status")?.split(",") as Status[] || [];
  const priority = params.get("priority")?.split(",") as Priority[] || [];
  const assignee = params.get("assignee")?.split(",") || [];
  const from = params.get("from");
  const to = params.get("to");
  
  return {
    view,
    filters: {
      status,
      priority,
      assignee,
      dateRange: from && to ? { from, to } : null,
    }
  };
};

const updateUrlFromState = (state: AppState) => {
  const params = new URLSearchParams();
  params.set("view", state.view);
  if (state.filters.status.length) params.set("status", state.filters.status.join(","));
  if (state.filters.priority.length) params.set("priority", state.filters.priority.join(","));
  if (state.filters.assignee.length) params.set("assignee", state.filters.assignee.join(","));
  if (state.filters.dateRange) {
    params.set("from", state.filters.dateRange.from);
    params.set("to", state.filters.dateRange.to);
  }
  
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.pushState({}, "", newUrl);
};

export const useStore = create<AppState>((set, get) => ({
  tasks: generateTasks(500),
  view: "Kanban",
  searchQuery: "",
  sortBy: null,
  filters: {
    status: [],
    priority: [],
    assignee: [],
    dateRange: null,
  },
  isSidebarOpen: false,
  isModalOpen: false,
  editingTask: null,
  ...getInitialStateFromUrl(),

  setTasks: (tasks) => set({ tasks }),
  updateTaskStatus: (taskId, status) => {
    set((state) => ({
      tasks: state.tasks.map((t) => t.id === taskId ? { ...t, status } : t)
    }));
  },
  setView: (view) => {
    set({ view });
    updateUrlFromState(get());
  },
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
    updateUrlFromState(get());
  },
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sortBy) => set({ sortBy }),
  clearFilters: () => {
    set({
      filters: {
        status: [],
        priority: [],
        assignee: [],
        dateRange: null,
      }
    });
    updateUrlFromState(get());
  },
  syncFromUrl: () => {
    set(getInitialStateFromUrl());
    updateUrlFromState(get());
  },
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openModal: (task) => set({ isModalOpen: true, editingTask: task || null }),
  closeModal: () => set({ isModalOpen: false, editingTask: null }),
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },
  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  },
  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    }));
  },
}));
