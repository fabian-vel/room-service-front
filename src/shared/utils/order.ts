import type {OrderDetails} from "@/feature/order/types/Order.ts";

export function calcularTotalProductos(detalle: OrderDetails[] | null | undefined): number {
    return (detalle ?? []).reduce((acc, item) => acc + item.pedeCantidad, 0);
}
