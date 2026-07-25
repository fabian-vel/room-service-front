import {axiosInstance} from "@/api/axios.ts";

interface LoginRequest {
    usuario: string;
    password: string;
}

interface LoginResponse {
    token: string;
    nombre: string;
    rol: string;
}

export const loginEmpleado = async (body: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/empleado/login', body);
    return response.data.data;
};
