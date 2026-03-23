import { Filter, X, ChevronDown } from "lucide-react";
import { useStore } from "../store";
import { USERS, Status, Priority } from "../types";

const STATUSES: Status[] = ["To Do", "In Progress", "In Review", "Done"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

export const FilterBar = () => {
  const { filters, setFilters, clearFilters } = useStore();
  
  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.assignee.length > 0 || 
    (filters.dateRange?.from || filters.dateRange?.to);

  const toggleStatus = (status: Status) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    setFilters({ status: newStatuses });
  };

  const togglePriority = (priority: Priority) => {
    const newPriorities = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    setFilters({ priority: newPriorities });
  };

  const toggleAssignee = (userId: string) => {
    const newAssignees = filters.assignee.includes(userId)
      ? filters.assignee.filter((id) => id !== userId)
      : [...filters.assignee, userId];
    setFilters({ assignee: newAssignees });
  };

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    setFilters({ 
      dateRange: { 
        from: field === 'from' ? value : (filters.dateRange?.from || ""),
        to: field === 'to' ? value : (filters.dateRange?.to || "")
      } 
    });
  };

  return (
    <div className="h-auto min-h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 lg:px-8 gap-4 shrink-0 overflow-x-auto thin-scrollbar">
      <div className="flex items-center gap-2 text-muted-foreground mr-2 shrink-0">
        <Filter size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Status Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted transition-colors">
            Status
            {filters.status.length > 0 && <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">{filters.status.length}</span>}
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {STATUSES.map((status) => (
              <label key={status} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-xs transition-colors">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        {/* Priority Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted transition-colors">
            Priority
            {filters.priority.length > 0 && <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">{filters.priority.length}</span>}
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
            {PRIORITIES.map((p) => (
              <label key={p} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-xs transition-colors">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(p)}
                  onChange={() => togglePriority(p)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Assignee Filter */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-card text-xs font-medium hover:bg-muted transition-colors">
            Assignee
            {filters.assignee.length > 0 && <span className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px]">{filters.assignee.length}</span>}
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2 group-hover:block">
            {USERS.map((user) => (
              <label key={user.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer text-xs transition-colors">
                <input
                  type="checkbox"
                  checked={filters.assignee.includes(user.id)}
                  onChange={() => toggleAssignee(user.id)}
                  className="rounded border-border text-primary focus:ring-primary/20"
                />
                {user.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="h-4 w-px bg-border mx-2 shrink-0" />

      <div className="flex items-center gap-2 shrink-0">
        <input 
          type="date" 
          className="bg-card border border-border rounded-md px-2 py-1 text-xs focus:ring-primary/20"
          value={filters.dateRange?.from || ""}
          onChange={(e) => handleDateChange('from', e.target.value)}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input 
          type="date" 
          className="bg-card border border-border rounded-md px-2 py-1 text-xs focus:ring-primary/20"
          value={filters.dateRange?.to || ""}
          onChange={(e) => handleDateChange('to', e.target.value)}
        />
      </div>

      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors animate-in fade-in zoom-in-95"
        >
          <X size={14} />
          Clear All
        </button>
      )}
    </div>
  );
};
