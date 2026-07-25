import {axiosInstance} from "@/api/axios.ts";
import type {LoginRequest, LoginResponse} from "@/feature/auth/types/Login.ts";

export const loginUser = async (body: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/empleado/login', body);

    return response.data.data;
};
