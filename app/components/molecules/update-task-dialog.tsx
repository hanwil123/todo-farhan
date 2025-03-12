"use client"

import type React from "react"
import { useState } from "react"
import { Pencil } from "lucide-react"
import type { Task } from "@/app/types/databaseTypes"

import { FormFieldd } from "./form-field2"

import { updateTaskkApi } from "@/app/lib/api/updateTaskApi"
import { useAuthStore } from "@/app/lib/store/authStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../atoms/dialog"
import { Button } from "../atoms/button"
import { Input } from "../atoms/input"
import { Textarea } from "../atoms/textarea"
import { Select } from "../atoms/select"

interface UpdateTaskDialogProps {
  task: Task
  teamMembers: { id: string; email: string }[]
}

export function UpdateTaskDialog({ task, teamMembers }: UpdateTaskDialogProps) {
  const { user } = useAuthStore()
  const isLead = user?.role === "lead"
  const isTeam = user?.role === "team"
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    assigned_to: task.assigned_to || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For team members, only update the status
      if (isTeam) {
        await updateTaskkApi({
          id: task.id,
          status: formData.status,
          // Keep original values for other fields
          title: task.title,
          description: task.description,
          assigned_to: task.assigned_to || "",
        })
      } else if(isLead) {
        // For leads, update all fields
        await updateTaskkApi(formData)
      }

      console.log("Task updated successfully")
      setIsOpen(false)
    } catch (error) {
      console.error("Error updating task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] text-black">
          <DialogHeader>
            <DialogTitle>Edit Commercial Operation Date</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <FormFieldd label="Title" htmlFor="title">
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isTeam}
                className={isTeam ? "opacity-70 cursor-not-allowed" : ""}
              />
            </FormFieldd>

            <FormFieldd label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                disabled={isTeam}
                className={isTeam ? "opacity-70 cursor-not-allowed" : ""}
              />
            </FormFieldd>

            <FormFieldd label="Status" htmlFor="status">
              <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                <option value="not_started">Not Started</option>
                <option value="on_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="reject">Rejected</option>
              </Select>
            </FormFieldd>

            <FormFieldd label="Assign To" htmlFor="assigned_to">
              <Select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                disabled={isTeam}
                className={isTeam ? "opacity-70 cursor-not-allowed" : ""}
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.email}
                  </option>
                ))}
              </Select>
            </FormFieldd>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

