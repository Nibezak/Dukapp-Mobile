import axios from 'axios';

const instance = axios.create({
  // dukapp.com
  baseURL: 'https://1853-2c0f-fe30-1d93-0-585d-afd-5b0f-4d99.ngrok.io/api/',
  headers: {
    'app-id': '0JyYiOQXQQr5H9OEn21312',
  },
});

export default instance;
