import type {Order} from "@/feature/daily-order/types/Order.ts";
import {axiosInstance} from "@/api/axios.ts";


export const getOrder = async (signal?: AbortSignal): Promise<Order[]> => {
    const response = await axiosInstance.get('/consulta-pedidos-fecha-actual', {signal});

    return response.data.data;
}
