import { Task, USERS, Priority, Status } from "../types";

const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];
const STATUSES: Status[] = ["To Do", "In Progress", "In Review", "Done"];

const generateRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

export const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 1; i <= count; i++) {
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const assignee = USERS[Math.floor(Math.random() * USERS.length)];
    
    // Some tasks have no start date
    const hasStartDate = Math.random() > 0.2;
    const dueDate = generateRandomDate(
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10), // Some overdue
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20)
    );
    
    const startDate = hasStartDate 
      ? generateRandomDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15), new Date(dueDate))
      : undefined;

    tasks.push({
      id: `task-${i}`,
      title: `Task ${i}: ${getMockTitle(i)}`,
      description: `Description for task ${i}. Detailed explanation of the work required.`,
      status,
      priority,
      assigneeId: assignee.id,
      startDate,
      dueDate,
    });
  }
  return tasks;
};

const getMockTitle = (i: number) => {
  const actions = ["Implement", "Refactor", "Design", "Test", "Deploy", "Review"];
  const features = ["Auth module", "Payment gateway", "User profile", "Dashboard", "API Integration", "Database Migration"];
  return `${actions[i % actions.length]} ${features[i % features.length]}`;
};
