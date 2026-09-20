import type {Constant, ConstantFormData} from "@/feature/masters/types/Constant.ts";
import {axiosInstance} from "@/api/axios.ts";

const BASE = "/constantes";

export const getConstants = async (signal?: AbortSignal): Promise<Constant[]> => {
    const response = await axiosInstance.get(BASE, {signal});
    return response.data.data;
};

export const createConstant = async (data: ConstantFormData): Promise<Constant> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateConstant = async (id: number, data: ConstantFormData): Promise<Constant> => {
    const response = await axiosInstance.put(`${BASE}/${id}`, data);
    return response.data.data;
};

export const deleteConstant = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${id}`);
};
