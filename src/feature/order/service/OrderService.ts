import type {Order} from "@/feature/order/types/Order.ts";
import {axiosInstance} from "@/api/axios.ts";


export const getOrders = async (signal?: AbortSignal): Promise<Order[]> => {
    const response = await axiosInstance.get('/consulta-pedidos-fecha-actual', {signal});

    return response.data.data;
}
