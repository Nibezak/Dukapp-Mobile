import axios from 'axios';

const instance = axios.create({
  // dukapp.com
  baseURL: 'http://143.198.135.41:8001/api/',
  headers: {
    'app-id': '0JyYiOQXQQr5H9OEn21312',
  },
});

export default instance;
