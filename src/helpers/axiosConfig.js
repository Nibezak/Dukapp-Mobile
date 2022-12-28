import axios from "axios";

const instance = axios.create({
    // dukapp.com
    baseURL: " https://f0ac-196-12-132-197.ngrok.io/api/",
    headers: {
        "app-id": "0JyYiOQXQQr5H9OEn21312",
    },
});

export default instance;