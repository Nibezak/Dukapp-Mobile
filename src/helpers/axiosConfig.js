import axios from 'axios';

const instance = axios.create({
  // dukapp.com
  baseURL: 'https://4a19-105-161-98-223.ngrok-free.app/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
