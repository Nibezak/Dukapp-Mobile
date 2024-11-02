import axios from 'axios';

const instance = axios.create({
  // dukapp.com
  baseURL: 'https://3995-41-90-172-142.ngrok-free.app/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
