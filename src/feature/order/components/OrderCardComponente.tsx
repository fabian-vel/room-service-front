import {Card, CardAction, CardContent, CardHeader, CardTitle} from "@/shared/shadcn/components/ui/card.tsx";
import {Bell, CircleHelp, CookingPot, CircleCheck, ArrowRight} from "lucide-react";
import type {Order} from "@/feature/order/types/Order.ts";

interface OrderCardProps {
    state: "pendiente" | "preparacion" | "entregado";
    order: Order;
}

export function OrderCardComponente({state, order,}: Readonly<OrderCardProps>) {

    const {pediHabitacion, detallePedidoList, pediTotal, pediFechaCreacion} = order;

    const hora = new Date(pediFechaCreacion).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const nombresItems = detallePedidoList
        .map(i => `${i.meitNombre} x${i.pedeCantidad}`)
        .join(", ");

    const borderColor = (() => {
        switch (state) {
            case "pendiente":
                return "border-yellow-600";
            case "preparacion":
                return "border-green-700";
            case "entregado":
                return "border-blue-900";
            default:
                return "border-gray-300";
        }
    })();

    const icon = (() => {
        switch (state) {
            case "pendiente":return <Bell className="fill-yellow-600 text-yellow-600"/>;
            case "preparacion":return <CookingPot className="fill-green-700 text-green-700"/>;
            case "entregado":return <CircleCheck className="fill-blue-900 text-white"/>;
            default:return <CircleHelp className="text-gray-400"/>;
        }
    })();

    return (
        <Card className={`w-full border-l-4 ${borderColor}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-gray-200 px-2 text-base font-semibold">
                        {pediHabitacion}
                    </span>
                    {icon}
                </CardTitle>
                <CardAction className="font-medium text-gray-700">
                    {hora}
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-medium">
                            {nombresItems}
                        </p>
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0"/>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                        {detallePedidoList.length} producto(s)
                    </span>
                    <span className="font-semibold">
                        ${pediTotal}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
