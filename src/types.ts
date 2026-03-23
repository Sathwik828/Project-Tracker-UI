export type Priority = "Low" | "Medium" | "High" | "Critical";
export type Status = "To Do" | "In Progress" | "In Review" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assigneeId: string;
  startDate?: string;
  dueDate: string;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export const USERS: User[] = [
  { id: "u1", name: "Alice Johnson", initials: "AJ", color: "bg-blue-500" },
  { id: "u2", name: "Bob Smith", initials: "BS", color: "bg-green-500" },
  { id: "u3", name: "Charlie Davis", initials: "CD", color: "bg-purple-500" },
  { id: "u4", name: "Diana Prince", initials: "DP", color: "bg-pink-500" },
  { id: "u5", name: "Edward Norton", initials: "EN", color: "bg-yellow-500" },
  { id: "u6", name: "Fiona Gallagher", initials: "FG", color: "bg-indigo-500" },
];
