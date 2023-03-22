import axios from 'axios';

const instance = axios.create({
  // dukapp.com
  baseURL: 'http://165.227.137.254:4001/api/v1/',
  headers: {
    'app-id': '0JyYiOQXQQr5H9OEn21312',
  },
});

export default instance;
