import type {Order} from "@/feature/order/types/Order.ts";
import {axiosInstance} from "@/api/axios.ts";

export interface OrderFilters {
    fechaDesde?: string;
    fechaHasta?: string;
    estadoPedido?: number;
    habitacion?: string;
    producto?: string;
    page: number;
    size: number;
}

export interface OrderPage {
    items: Order[];
    total: number;
    page: number;
    pageSize: number;
}

export const getOrders = async (filters: OrderFilters, signal?: AbortSignal): Promise<OrderPage> => {
    const response = await axiosInstance.get('/pedidos', {params: filters, signal});

    return response.data.data;
}
