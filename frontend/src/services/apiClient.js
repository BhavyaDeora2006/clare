import axios from 'axios';
import { getSession } from './authServices';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";
const apiClient = axios.create({
    baseURL: `${BASE_URL}/api`,
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
