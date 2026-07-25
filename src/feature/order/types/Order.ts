export interface Order {
    pediId: number;
    pediHabitacion: string;
    pediTotal: number;
    pediFechaCreacion: string;
    pediObservacion?: string;
    espeId: number;
    espeNombre: string;
    detallePedidoList: OrderDetails[];
}

export interface OrderDetails {
    meitId: number;
    meitNombre: string;
    pedeCantidad: number;
    pedeSubtotal: number;
}
