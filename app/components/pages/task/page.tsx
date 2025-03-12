"use client";

// import { getTaskkApi, getTaskkToApi } from "@/app/lib/api/getTaskApi";
import { useAuthStore } from "@/app/lib/store/authStore";
import { Task } from "@/app/types/databaseTypes";
import { useEffect } from "react";
import { TaskList } from "../../organisms/task-list";
import { useTaskStore } from "@/app/lib/store/taskStore";

export default function TasksPage() {
  const { fetchTaskData, fetchTaskToData } = useTaskStore();
  // const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const isLead = user?.role === "lead";
  const isTeam = user?.role === "team";

  useEffect(() => {
    if (isLead) {
      fetchTaskData();
    } else if (isTeam) {
      fetchTaskToData();
    }
  }, [user, isLead, isTeam, fetchTaskData, fetchTaskToData]);

  const handleEditTask = (task: Task) => {
    // For team members, they can't edit tasks
    if (!isLead) return;

    // Redirect to dashboard for editing
    window.location.href = `/dashboard?edit=${task.id}`;
  };

  return (
    <>
      <div className=" container mx-auto">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <p className="text-gray-600">
          {user?.role === "lead"
            ? "Tasks you created or are assigned to you"
            : "Tasks assigned to you"}
        </p>
      </div>

        <TaskList onEditTask={handleEditTask} />
    </>
  );
}
