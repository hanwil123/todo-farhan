"use client";

import { useState, useEffect } from "react";

import { useAuthStore } from "@/app/lib/store/authStore";
import supabase from "@/app/lib/supabase";
// import type { Task } from "@/app/types/databaseTypes";
import { DashboardTemplate } from "../../templates/dashboard-template";
// import { Button } from "@/components/ui/button"
// import { TaskList } from "../../organisms/task-list";
import { TaskForm } from "../../organisms/task-form";
import TasksPage from "../task/page";
// import { X } from "lucide-react";
// import { Button } from "../../atoms/button";
// import { Dialog, DialogContent } from "../../atoms/dialog";
// import { DialogTitle } from "@radix-ui/react-dialog";

export default function DashboardPage() {
  const [, setIsFormOpen] = useState(false);
  // const [, setSelectedTask] = useState<Task | undefined>(undefined);
  const { user, isLoggedIn } = useAuthStore();
  const isLead = user?.role === "lead";
  // const isTeam = user?.role === "team";

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (isLead) {
        const { data, error } = await supabase
          .from("users")
          .select("id, email")
          .eq("role", "team");

        if (!error && data) {
          // setTeamMembers(data);
        }
      }
    };

    if (user) {
      fetchTeamMembers();
    }
  }, [user, isLead]);

  // const handleCreateTask = () => {
  //   setSelectedTask(undefined);
  //   setIsFormOpen(true); // Changed from false to true to open the form
  // };

  // const handleEditTask = (task: Task) => {
  //   setSelectedTask(task);
  //   setIsFormOpen(true);
  // };

  return (
    <>
      {isLoggedIn ? (
        <DashboardTemplate>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            {isLead && <TaskForm onClose={() => setIsFormOpen(false)} />}
          </div>
          <div className=" my-20">
            <TasksPage />
          </div>

          {/* <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogTitle className="text-lg font-bold">
          create task
        </DialogTitle>
        <DialogContent className="sm:max-w-md"> */}
          {/* <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedTask ? "Edit Task" : "Create New Task"}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFormOpen(false)}
          className="h-7 w-7"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div> */}
          {/* </DialogContent>
      </Dialog> */}
        </DashboardTemplate>
      ) : (
        <div className=" bg-red-500 flex flex-row justify-center w-screen h-screen">
          <div className=" flex flex-col justify-center text-2xl">
            Please login to view this page
          </div>
        </div>
      )}
    </>
  );
}
