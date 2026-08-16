import type {Order} from "@/feature/daily-order/types/Order.ts";
import {axiosInstance} from "@/api/axios.ts";


export const getOrder = async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/consulta-pedidos-fecha-actual');

    return response.data.data;
}
