import axios from 'axios';
import { getSession } from './authServices';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Add a request interceptor to attach the JWT token
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await getSession();
        if (session) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
