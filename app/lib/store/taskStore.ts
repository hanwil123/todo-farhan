// store/taskStore.ts
import { Task } from "@/app/types/databaseTypes";
import { create } from "zustand";
import { TaskInput } from "../validation/task";
import { submitTaskApi } from "../api/postTaskApi";
import { getTaskkApi, getTaskkToApi } from "../api/getTaskApi";
import { updateTaskkApi } from "../api/updateTaskApi";

// Define the type expected by updateTaskkApi
interface UpdateTaskPayload {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "on_progress" | "done" | "reject";
  assigned_to: string;
}

interface TaskStore {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  lastUpdatedTask: Task | null;

  // Actions
  submitTask: (data: TaskInput) => Promise<void>;
  fetchTaskData: () => Promise<void>;
  fetchTaskToData: () => Promise<void>;
  updateTask: (taskData: Partial<Task>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  reset: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  // Initial state
  tasks: [],
  isLoading: false,
  error: null,
  lastUpdatedTask: null,

  // Actions
  submitTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await submitTaskApi(data);
      // Refresh quarterly data after submission
      const response = await getTaskkApi();
      set({ tasks: response.data });
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to submit task",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTaskData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTaskkApi();
      set({ tasks: response.data });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch task data",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchTaskToData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTaskkToApi();
      set({ tasks: response.data });
    } catch (err) {
      set({
        error:
          err instanceof Error ? err.message : "Failed to fetch task data",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fixed update task functionality
  updateTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Make sure we have the task ID
      if (!taskData.id) {
        throw new Error("Task ID is required for update");
      }
      
      // Find the existing task to get complete data
      const existingTask = get().tasks.find(t => t.id === taskData.id);
      if (!existingTask) {
        throw new Error("Task not found");
      }
      
      // Create a complete payload by merging existing task with updates
      const updatePayload: UpdateTaskPayload = {
        id: taskData.id,
        title: taskData.title ?? existingTask.title,
        description: taskData.description ?? existingTask.description,
        status: (taskData.status as "not_started" | "on_progress" | "done" | "reject") ?? existingTask.status,
        assigned_to: taskData.assigned_to ?? existingTask.assigned_to ?? "",
      };
      
      // Call the API with complete data
      await updateTaskkApi(updatePayload);
      set({ lastUpdatedTask: updatePayload as Task });
      
      // Refresh task data after update
      const response = await getTaskkApi();
      set({ tasks: response.data });
    } catch (err) {
      set({
        error: err instanceof Error 
          ? err.message 
          : "Failed to update task"
      });
      throw err; // Re-throw to handle in component
    } finally {
      set({ isLoading: false });
    }
  },

  updateTaskStatus: async (taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      // Find the existing task to get complete data
      const existingTask = get().tasks.find(t => t.id === taskId);
      if (!existingTask) {
        throw new Error("Task not found");
      }
      
      // Create a complete payload
      const updatePayload: UpdateTaskPayload = {
        id: taskId,
        title: existingTask.title,
        description: existingTask.description,
        status: status as "not_started" | "on_progress" | "done" | "reject",
        assigned_to: existingTask.assigned_to ?? "",
      };
      
      await updateTaskkApi(updatePayload);
      set({ lastUpdatedTask: updatePayload as Task });
      
      // Refresh task data after update
      const response = await getTaskkToApi();
      set({ tasks: response.data });
    } catch (err) {
      set({
        error: err instanceof Error 
          ? err.message 
          : "Failed to update task status"
      });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    set({
      tasks: [],
      isLoading: false,
      error: null,
      lastUpdatedTask: null
    });
  },
}));