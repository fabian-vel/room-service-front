import {axiosInstance} from "@/api/axios.ts";

export interface Acceso {
    haacId: number;
    haacHabitacion: string;
    haacCodigo: string;
    haacClienteNombre: string;
    haacClienteDoc: string | null;
    haacFechaInicio: string;
    haacFechaFin: string;
    // A: activo; I: finalizado (check-out)
    haacEstado: string;
}

// al editar la habitación no se envía: no cambia
export interface AccesoFormData {
    haacHabitacion?: string;
    haacClienteNombre: string;
    haacClienteDoc: string | null;
    haacFechaInicio: string;
    haacFechaFin: string;
}

export interface CodigoAcceso {
    haacId: number;
    haacCodigo: string;
}

export type EstadoAcceso = "Vigente" | "Por iniciar" | "Vencido" | "Finalizado";

export const estadoAcceso = (acceso: Acceso, ahora = new Date()): EstadoAcceso => {
    if (acceso.haacEstado !== "A") return "Finalizado";
    if (ahora < new Date(acceso.haacFechaInicio)) return "Por iniciar";
    if (ahora > new Date(acceso.haacFechaFin)) return "Vencido";
    return "Vigente";
};

export const fechaHora = (fecha: string) =>
    new Date(fecha).toLocaleString("es-CO", {dateStyle: "short", timeStyle: "short"});

const BASE = "/accesos";

// sin habitación devuelve los accesos activos que no han vencido
export const getAccesos = async (habitacion: string, signal?: AbortSignal): Promise<Acceso[]> => {
    const response = await axiosInstance.get(BASE, {params: {habitacion: habitacion || undefined}, signal});
    return response.data.data;
};

export const registrarAcceso = async (data: AccesoFormData): Promise<CodigoAcceso> => {
    const response = await axiosInstance.post(BASE, data);
    return response.data.data;
};

export const updateAcceso = async (id: number, data: AccesoFormData): Promise<void> => {
    await axiosInstance.put(`${BASE}/${id}`, data);
};

export const renovarCodigo = async (id: number): Promise<CodigoAcceso> => {
    const response = await axiosInstance.post(`${BASE}/${id}/codigo`);
    return response.data.data;
};

export const finalizarAcceso = async (id: number): Promise<void> => {
    await axiosInstance.post(`${BASE}/${id}/finalizar`);
};
