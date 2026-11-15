import {axiosInstance} from "@/api/axios.ts";

export interface Item {
    meitId: number;
    meitNombre: string;
    meitDescripcion: string | null;
    meitPrecio: number;
    meitImagenUrl: string | null;
    mecaId: number;
    mecaNombre: string;
    mecaParentId: number | null;
    mecaParentNombre: string | null;
    etiquetas: { etiqId: number; etiqNombre: string }[];
}

// mecaId es la subcategoría; el API toma la categoría padre de ella
export interface ItemFormData {
    meitNombre: string;
    meitDescripcion: string | null;
    meitPrecio: number;
    meitImagenUrl: string | null;
    mecaId: number;
    etiqIds: number[];
}

const BASE = "/items";

export const getItems = async (signal?: AbortSignal): Promise<Item[]> => {
    const response = await axiosInstance.get(BASE, {signal});
    return response.data.data;
};

export const createItem = async (data: ItemFormData): Promise<number> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateItem = async (id: number, data: ItemFormData): Promise<void> => {
    await axiosInstance.put(`${BASE}/${id}`, data);
};

export const deleteItem = async (id: number): Promise<void> => {
    await axiosInstance.delete(`${BASE}/${id}`);
};
