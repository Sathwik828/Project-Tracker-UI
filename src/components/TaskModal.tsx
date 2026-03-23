import React, { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { useStore } from "../store";
import { USERS, Status, Priority } from "../types";

export const TaskModal = () => {
  const { isModalOpen, editingTask, closeModal, addTask, updateTask, deleteTask } = useStore();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do" as Status,
    priority: "Medium" as Priority,
    assigneeId: USERS[0].id,
    dueDate: new Date().toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        assigneeId: editingTask.assigneeId,
        dueDate: editingTask.dueDate,
        startDate: editingTask.startDate || new Date().toISOString().split('T')[0]
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
        assigneeId: USERS[0].id,
        dueDate: new Date().toISOString().split('T')[0],
        startDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [editingTask, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    closeModal();
  };

  const handleDelete = () => {
    if (editingTask && window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(editingTask.id);
      closeModal();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeModal}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-bold">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button 
            onClick={closeModal}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</label>
            <input
              autoFocus
              required
              placeholder="What needs to be done?"
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</label>
            <textarea
              placeholder="Add some details..."
              rows={3}
              className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
              <select
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
              >
                {["To Do", "In Progress", "In Review", "Done"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</label>
              <select
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                {["Low", "Medium", "High", "Critical"].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assignee</label>
              <select
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
              >
                {USERS.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-border mt-2">
            {editingTask && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors shrink-0"
                title="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            )}
            <div className="flex-1" />
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95"
            >
              {editingTask ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
