import type {Label, LabelFormData} from "@/feature/masters/types/Label.ts";
import {axiosInstance} from "@/api/axios.ts";

const BASE = "/etiquetas";

export const getLabels = async (signal?: AbortSignal): Promise<Label[]> => {
    const response = await axiosInstance.get(BASE, {signal});
    return response.data.data;
};

export const createLabel = async (data: LabelFormData): Promise<Label> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateLabel = async (id: number, data: LabelFormData): Promise<Label> => {
    const response = await axiosInstance.put(`${BASE}/${id}`, data);
    return response.data.data;
};

export const deleteLabel = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${id}`);
};
