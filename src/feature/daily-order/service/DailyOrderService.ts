import type {Order} from "@/feature/daily-order/types/Order.ts";
import {axiosInstance} from "@/api/axios.ts";


export const getOrder = async (signal?: AbortSignal): Promise<Order[]> => {
    const response = await axiosInstance.get('/consulta-pedidos-fecha-actual', {signal});

    return response.data.data;
}

/** estadoPedido es el espe_id destino (2 en preparación, 3 entregado, 4 cancelado) */
export const cambiarEstadoPedido = async (pediId: number, estadoPedido: number): Promise<void> => {
    await axiosInstance.put(`/pedido/${pediId}/estado`, {estadoPedido});
}
