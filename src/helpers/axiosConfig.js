import axios from "axios";

const instance = axios.create({
    // dukapp.com
    baseURL: " http://bbe5-2c0f-fe30-1d93-0-b945-b9e9-3baa-e3e3.ngrok.io/api/",
    headers: {
        "app-id": "0JyYiOQXQQr5H9OEn21312",
    },
});

export default instance;