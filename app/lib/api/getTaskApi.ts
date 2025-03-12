import axios from "axios";

export async function getTaskkApi() {
  try {
    const response = await axios.get(`http://localhost:3000/api/task/getTask`);
    if (!response.data.data) {
      console.log("Data tidak ditemukan");
    } else {
      console.log(response.data.data);
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
export async function getTaskkToApi() {
  const token = localStorage.getItem("auth_token");
  try {
    const response = await axios.get(
      `http://localhost:3000/api/task/getTaskAssignedTo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data.data) {
      console.log("Data tidak ditemukan");
    } else {
      console.log(response.data.data);
    }
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
