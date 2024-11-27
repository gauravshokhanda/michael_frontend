import axios from 'axios';

// Create an Axios instance with default headers
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Base URL for the API
});

// Interceptor to add the Authorization token before each request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = window.localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
