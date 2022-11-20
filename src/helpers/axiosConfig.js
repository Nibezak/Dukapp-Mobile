import axios from "axios";

const instance = axios.create({
    // dukapp.com
    baseURL: "http://9660-2c0f-fe30-1d93-0-54bf-81de-700a-7323.ngrok.io/api/",
    headers: {
        "app-id": "0JyYiOQXQQr5H9OEn21312",
    },
});

export default instance;