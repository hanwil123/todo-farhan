import axios from "axios";

export async function getUserTeamApi() {
    try {
        const response = await axios.get(`http://localhost:3000/api/getuser/role/team`);
        if (!response.data.data) {
            console.log("Data tidak ditemukan");
        }
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null
    }
}