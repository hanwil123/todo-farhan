import { Task, TaskStatus } from "../../types/databaseTypes";
import { Badge } from "../atoms/badge";
import { Button } from "../atoms/button";
import { useAuth } from "../../context/auth-context";
import { useState } from "react";
import { UpdateTaskDialog } from "./update-task-dialog";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  teamMembers: { id: string; email: string }[];
  // onUpdate: () => void
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function TaskCard({ task, teamMembers, onStatusChange }: TaskCardProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    not_started: "bg-gray-200 text-gray-800",
    on_progress: "bg-blue-200 text-blue-800",
    done: "bg-green-200 text-green-800",
    reject: "bg-red-200 text-red-800",
  };

  const statusLabels = {
    not_started: "Not Started",
    on_progress: "In Progress",
    done: "Done",
    reject: "Rejected",
  };

  const isLead = user?.role === "lead";
  const isAssignedToMe = task.assigned_to === user?.id;

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-sm transition-shadow bg-white w-full">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">{task.title}</h3>
        <div className="flex items-center space-x-2">
          <Badge className={statusColors[task.status]}>
            {statusLabels[task.status]}
          </Badge>
            <UpdateTaskDialog task={task} teamMembers={teamMembers} />
        </div>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-gray-500 mt-2 hover:text-gray-700"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          <p className="text-gray-600">{task.description}</p>

          {isAssignedToMe && !isLead && onStatusChange && (
            <div className="pt-3 border-t flex justify-end space-x-2">
              {task.status !== "on_progress" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(task.id, "on_progress")}
                >
                  Start Progress
                </Button>
              )}

              {task.status !== "done" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(task.id, "done")}
                >
                  Mark Done
                </Button>
              )}

              {task.status !== "reject" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(task.id, "reject")}
                >
                  Reject
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
