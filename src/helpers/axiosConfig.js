import axios from "axios";

const instance = axios.create({
    // dukapp.com
    baseURL: " http://d972-2c0f-fe30-1d93-0-b582-2cb7-1abf-7a17.ngrok.io/api/",
    headers: {
        "app-id": "0JyYiOQXQQr5H9OEn21312",
    },
});

export default instance;