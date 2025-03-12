"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { FormField } from "../molecules/form-field";
import { Textarea } from "../atoms/textarea";
import { Select } from "../atoms/select";
import { Button } from "../atoms/button";
import { FormFieldd } from "../molecules/form-field2";
import { getUserTeamApi } from "@/app/lib/api/getUserTeamApi";
import type { TaskInput } from "@/app/lib/validation/task";
import { submitTaskApi } from "@/app/lib/api/postTaskApi";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../atoms/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "not_started" | "on_progress" | "done" | "reject";
  assigned_to: string;
  created_at?: string;
  updated_at?: string;
}

interface TaskFormProps {
  task?: Task & { assigned_to: string | null };
  onClose: () => void;
}

interface TeamMember {
  id: string;
  full_name: string;
  username: string;
  role: "lead" | "team";
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<TaskInput>({
    title: "",
    description: "",
    status: "not_started",
    assigned_to: "",
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!task;

  // Populate form data when editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        assigned_to: task.assigned_to,
      });
    }
  }, [task]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getUserTeamApi();

        if (response.status === "success" && Array.isArray(response.data)) {
          setTeamMembers(response.data);
        } else {
          console.error("Unexpected API response format:", response);
          setError("Failed to load team members");
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
        setError("Failed to load team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.assigned_to) {
      newErrors.assigned_to = "Please select a team member";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Create new task
      await submitTaskApi(formData);
      // Close the dialog after successful submission
      setIsFormOpen(false);
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
      <DialogTrigger asChild>
        <Button  className="w-40 h-10 p-0 cursor-pointer">
      <DialogTitle className="text-lg font-bold">create task</DialogTitle>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-black">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="title"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Task title"
            error={errors.title}
          />

          <FormFieldd
            htmlFor="description"
            label="Description"
            error={errors.description}
          >
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              rows={4}
            />
          </FormFieldd>

          <FormFieldd label="Status" htmlFor="status">
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="not_started">Not Started</option>
              <option value="on_progress">In Progress</option>
              <option value="done">Done</option>
              <option value="reject">Rejected</option>
            </Select>
          </FormFieldd>

          <FormFieldd
            label="Assign To"
            htmlFor="assigned_to"
            error={errors.assigned_to}
          >
            <Select
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Select Team Member</option>
              {loading ? (
                <option value="" disabled>
                  Loading team members...
                </option>
              ) : error ? (
                <option value="" disabled>
                  Error loading team members
                </option>
              ) : (
                teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.username} ({member.full_name})
                  </option>
                ))
              )}
            </Select>
          </FormFieldd>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || loading}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
