import {axiosInstance} from "@/api/axios.ts";

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login'; // ← redirige al login automáticamente
        }

        throw Object.assign(new Error(data?.message ?? 'Error de conexión'), {
            status,
            code: data?.code ?? 'NETWORK_ERROR',
            message: data?.message ?? 'Error de conexión',
            correlationId: data?.correlationId ?? null,
        });
    }
);

export default axiosInstance;
