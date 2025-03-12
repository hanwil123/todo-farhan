"use client";

import { getTaskkApi, getTaskkToApi } from "@/app/lib/api/getTaskApi";
import { useAuthStore } from "@/app/lib/store/authStore";
import { Task } from "@/app/types/databaseTypes";
import { useState, useEffect } from "react";
import { TaskList } from "../../organisms/task-list";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isLead = user?.role === "lead";
  const isTeam = user?.role === "team";

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        if (isLead) {
          const dataTask = await getTaskkApi();
          console.log(dataTask.data);
          setTasks(dataTask.data);
        } else if (isTeam) {
          const dataTask = await getTaskkToApi();
          console.log(dataTask.data);
          setTasks(dataTask.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, isLead, isTeam]);

  const handleEditTask = (task: Task) => {
    // For team members, they can't edit tasks
    if (!isLead) return;

    // Redirect to dashboard for editing
    window.location.href = `/dashboard?edit=${task.id}`;
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-gray-600">
          {user?.role === "lead"
            ? "Tasks you created or are assigned to you"
            : "Tasks assigned to you"}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : (
        <TaskList initialTasks={tasks} onEditTask={handleEditTask} />
      )}
    </>
  );
}
