import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {ChevronRight} from "lucide-react";
import type {Order} from "@/feature/order/types/Order.ts";
import {formatHour} from "@/shared/utils/date.ts";

interface OrdersTableProps {
    orders: Order[];
    showEstado?: boolean;
    onOpenWindow?: (order: Order) => void;
}

const estadoClass: Record<number, string> = {
    1: "border-yellow-600 text-yellow-700",
    2: "border-green-700 text-green-700",
    3: "border-blue-900 text-blue-800",
    4: "border-red-600 text-red-600",
};

export function OrdersTable({orders, showEstado = false, onOpenWindow}: Readonly<OrdersTableProps>) {

    const formatNumberOrder = (value: number): string => {
        return value.toString().padStart(4, "0");
    };

    const productos = (order: Order): string => {
        return order.detallePedidoList.map(i => i.meitNombre).join(", ");
    };

    const colSpan = (showEstado ? 6 : 5) + 1;

    return (
        <div className="h-full overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Habitación</TableHead>
                        {showEstado && <TableHead>Estado</TableHead>}
                        <TableHead>Productos</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead className="w-10"/>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={colSpan} className="h-24 text-center text-muted-foreground">
                                No hay pedidos
                            </TableCell>
                        </TableRow>
                    ) : (
                        orders.map(order => (
                            <TableRow
                                key={order.pediId}
                                className="cursor-pointer"
                                onClick={() => onOpenWindow?.(order)}
                            >
                                <TableCell className="font-medium">
                                    #{formatNumberOrder(order.pediId)}
                                </TableCell>
                                <TableCell>{order.pediHabitacion}</TableCell>
                                {showEstado && (
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${estadoClass[order.espeId] ?? "border-gray-400 text-gray-500"}`}>
                                            {order.espeNombre}
                                        </span>
                                    </TableCell>
                                )}
                                <TableCell className="max-w-[380px]">
                                    <span className="block truncate">{productos(order)}</span>
                                </TableCell>
                                <TableCell className="font-semibold">
                                    ${order.pediTotal.toLocaleString("es-CO")}
                                </TableCell>
                                <TableCell>{formatHour(order.pediFechaCreacion)}</TableCell>
                                <TableCell>
                                    <ChevronRight className="size-4 text-muted-foreground"/>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
