import axios from "axios";

const instance = axios.create({
    // dukapp.com
    baseURL: "https://17e2-2c0f-fe30-1d93-0-3599-7859-1034-2cf7.ngrok.io/api/",
    headers: {
        "app-id": "0JyYiOQXQQr5H9OEn21312",
    },
});

export default instance;