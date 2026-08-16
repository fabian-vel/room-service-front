import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_LOCAL_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
