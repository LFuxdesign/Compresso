import axios from "axios";

export async function getUserData() {
    const res = axios.get("/api/get/user");
    return res.then(response => {
        console.log("Response from getUserData:", response);
        if (response.status === 200 && response.data.success) {
            return response.data.data.user;
        }
    }).catch(() => { return null; });
}