import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters" }),
    status: z.enum(["not_started", "on_progress", "done", "reject"]),
    assigned_to: z.string(),
});
export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters" }),
    status: z.enum(["not_started", "on_progress", "done", "reject"]),
    assigned_to: z.string(),
});

// export const registerSchema = z.object({
//   full_name: z
//     .string()
//     .min(2, { message: "Name must be at least 2 characters" }),
//   username: z
//     .string()
//     .min(2, { message: "Name must be at least 2 characters" }),
//   email: z.string().email({ message: "Please enter a valid email address" }),
//   password: z
//     .string()
//     .min(8, { message: "Password must be at least 8 characters" })
//     .regex(/[A-Z]/, {
//       message: "Password must contain at least one uppercase letter",
//     })
//     .regex(/[0-9]/, { message: "Password must contain at least one number" }),
// });
// export const userSchema = z.object({
//   id: z.string(),
//   full_name: z
//     .string()
//     .min(2, { message: "Name must be at least 2 characters" }),
//   username: z
//     .string()
//     .min(2, { message: "Name must be at least 2 characters" }),
//   role: z.enum(["lead", "team"]),
// });

export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
// export type RegisterInput = z.infer<typeof registerSchema>;
// export type GetUserType = z.infer<typeof userSchema>;
