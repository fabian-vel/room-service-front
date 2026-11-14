import {axiosInstance} from "@/api/axios.ts";

export interface VentaPorDia {
    fecha: string;
    pedidos: number;
    total: number;
}

export interface ItemVendido {
    meitId: number;
    meitNombre: string;
    cantidad: number;
    total: number;
}

export interface PedidosPorEstado {
    espeId: number;
    espeNombre: string;
    pedidos: number;
    total: number;
}

export interface VentaPorHabitacion {
    habitacion: string;
    pedidos: number;
    total: number;
}

// ventas, ítems y habitaciones no cuentan los pedidos cancelados; pedidosPorEstado sí
export interface Reporte {
    ventasPorDia: VentaPorDia[];
    itemsMasVendidos: ItemVendido[];
    pedidosPorEstado: PedidosPorEstado[];
    ventasPorHabitacion: VentaPorHabitacion[];
}

export const getReporte = async (fechaDesde: string, fechaHasta: string, signal?: AbortSignal): Promise<Reporte> => {
    const response = await axiosInstance.get('/reportes', {params: {fechaDesde, fechaHasta}, signal});

    return response.data.data;
}
