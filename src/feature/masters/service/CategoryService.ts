import type {Category, CategoryFormData} from "@/feature/masters/types/Category.ts";
import {axiosInstance} from "@/api/axios.ts";

const BASE = "/categorias";

export const getCategories = async (signal?: AbortSignal): Promise<Category[]> => {
    const response = await axiosInstance.get(`${BASE}/todas`, {signal});
    return response.data.data;
};

export const createCategory = async (data: CategoryFormData): Promise<Category> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateCategory = async (id: number, data: CategoryFormData): Promise<Category> => {
    const response = await axiosInstance.put(`${BASE}/${id}`, data);
    return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${id}`);
};
