import axios from "axios";
import { TaskInput } from "../validation/task";

export async function submitTaskApi(data: TaskInput) {
  const token = localStorage.getItem("auth_token");
  try {
    const requestBody = {
      title: data.title,
      description: data.description,
      status: data.status,
      assigned_to: data.assigned_to,
    };
    console.log("data yang dikirim ke server", requestBody);
    const response = await axios.post(
      `http://localhost:3000/api/task/taskInput`,
      JSON.stringify(requestBody),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data.data) {
      console.log("Data tidak ditemukan");
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
