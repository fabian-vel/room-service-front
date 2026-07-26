import type {OrderEventType} from "@/types/OrderEventType.ts";

export interface OrderEvent<T = unknown> {
    type: OrderEventType;
    pedidoId: number;
    eventDate: string;
    payload?: T;
}
