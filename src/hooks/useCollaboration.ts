import { useState, useEffect } from "react";
import { USERS } from "../types";

interface Presence {
  userId: string;
  taskId: string;
}

export const useCollaboration = (tasks: { id: string }[]) => {
  const [presence, setPresence] = useState<Presence[]>([]);

  useEffect(() => {
    // Initial random placement
    const initialPresence = USERS.slice(0, 3).map((user) => ({
      userId: user.id,
      taskId: tasks[Math.floor(Math.random() * Math.min(tasks.length, 20))].id,
    }));
    setPresence(initialPresence);

    const interval = setInterval(() => {
      setPresence((prev) => 
        prev.map((p) => {
          // 30% chance to move to a new task
          if (Math.random() > 0.7) {
            return {
              ...p,
              taskId: tasks[Math.floor(Math.random() * Math.min(tasks.length, 20))].id,
            };
          }
          return p;
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [tasks.length]);

  return presence;
};
