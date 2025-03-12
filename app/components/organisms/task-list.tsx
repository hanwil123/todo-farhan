"use client";

import { useEffect } from "react";
import { TaskCard } from "../molecules/task-card";
import { Task, TaskStatus } from "../../types/databaseTypes";
// import { useAuth } from "../../context/auth-context";
import supabase from "../../lib/supabase";
// import { getTaskkApi, getTaskkToApi } from "@/app/lib/api/getTaskApi";
import { useAuthStore } from "@/app/lib/store/authStore";
import { useTaskStore } from "@/app/lib/store/taskStore";

interface TaskListProps {
  // initialTasks?: Task[];
  onEditTask: (task: Task) => void;
}

export function TaskList({ onEditTask }: TaskListProps) {
  const { tasks, fetchTaskData, fetchTaskToData } = useTaskStore();
  // const [loading, setLoading] = useState(!initialTasks.length);
  const { user } = useAuthStore();
  const isLead = user?.role === "lead";
  const isTeam = user?.role === "team";
  useEffect(() => {
    // if (initialTasks.length) {
    //   setTasks(initialTasks);
    //   return;
    // }
    if (isLead) {
      fetchTaskData();
    } else if (isTeam) {
      fetchTaskToData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLead, isTeam, ]);

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      // Update task status
      const { error } = await supabase
        .from("tasks")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", taskId);

      if (error) throw error;

      // Log the status change
      await supabase.from("task_logs").insert({
        task_id: taskId,
        user_id: user?.id,
        action: "status_change",
        previous_status: tasks.find((t) => t.id === taskId)?.status,
        new_status: status,
        created_at: new Date().toISOString(),
      });

      // Update local state
      tasks.forEach((task) => {
        if (task.id === taskId) task.status = status;
      });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // if (isLoading) {
  //   return <div className="text-center py-8">Loading tasks...</div>;
  // }

  if (!tasks.length) {
    return (
      <div className="text-center py-8 text-gray-500 ">
        No tasks found.{" "}
        {user?.role === "lead" && "Create a new task to get started."}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onStatusChange={handleStatusChange}
          teamMembers={[]}
          // onUpdate={handleTaskUpdate}
        />
      ))}
    </div>
  );
}
