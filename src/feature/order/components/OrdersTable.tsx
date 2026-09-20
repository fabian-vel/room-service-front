import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {Bell, CircleCheck, CircleX, CookingPot} from "lucide-react";
import type {Order} from "@/feature/order/types/Order.ts";
import {formatHour} from "@/shared/utils/date.ts";
import React from "react";

interface OrdersTableProps {
    orders: Order[];
    showEstado?: boolean;
    onOpenWindow?: (order: Order) => void;
}

const estateConfig: Record<number, { className: string; icon: React.ReactElement }> = {
    1: {className: "bg-yellow-50 text-yellow-700", icon: <Bell className="size-5" fill="currentColor"/>},
    2: {className: "bg-green-50 text-green-700", icon: <CookingPot className="size-5" fill="currentColor"/>},
    3: {className: "bg-blue-50 text-blue-800", icon: <CircleCheck className="size-5" color="#fff"  fill="currentColor"/>},
    4: {className: "bg-red-50 text-red-600", icon: <CircleX className="size-5" color="#fff"  fill="currentColor"/>},
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
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs 
                                            ${estateConfig[order.espeId]?.className}`}>
                                            {estateConfig[order.espeId]?.icon}
                                            {order.espeNombre}
                                        </span>
                                    </TableCell>
                                )}
                                <TableCell className="max-w-95">
                                    <div className="flex flex-col justify-center gap-1">
                                        <span className="block truncate">{productos(order)}</span>
                                        <span className="text-[11px] text-gray-600 font-bold">
                                            {order.detallePedidoList.length} producto(s)
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                    ${order.pediTotal.toLocaleString("es-CO")}
                                </TableCell>
                                <TableCell>{formatHour(order.pediFechaCreacion)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
