// src/services/httpService.js
import axios from 'axios';

// Create an Axios instance with default settings
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add authentication token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Example: using localStorage for auth tokens
    console.log("TOKEN : " , token);
    if (token) {
      // config.headers['Authorization'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific status codes here, like 401 or 403
    // if (error.response && error.response.status === 401) {
    //   // For example: redirect to login page if not authorized
    //   if(!window.location.href.includes("/signin")){
    //     window.location = '/signin';
    //   }
    // }
    return Promise.reject(error);
  }
);

export default api;
