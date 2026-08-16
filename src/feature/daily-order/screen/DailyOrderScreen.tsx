import {cn} from "@/shared/shadcn/lib/utils.ts";
import {OrderCardComponente} from "@/feature/daily-order/components/OrderCardComponente.tsx";
import {useEffect, useState} from "react";
import type {Order} from "@/feature/daily-order/types/Order.ts";
import {getOrder} from "@/feature/daily-order/service/DailyOrderService.ts";
import {KitchenWebSocketService} from "@/feature/daily-order/service/KitchenWebSocketService.ts";
import type {OrderEvent} from "@/types/OrderEvent.ts";
import {OrderEventType} from "@/types/OrderEventType.ts";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {OrderDetailsSheet} from "@/feature/daily-order/components/OrderDetailsSheet.tsx";

const webSocketService = new KitchenWebSocketService();

export function DailyOrderScreen() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const handleOrderEvent = (event: OrderEvent) => {
        switch (event.type) {
            case OrderEventType.CREATED:
                fetchOrders()
                    .then(setOrders)
                    .catch(e => setError(e.message));
                break;
            case OrderEventType.STATUS_CHANGED:
                break;
            case OrderEventType.UPDATED:
                break;
            case OrderEventType.CANCELLED:
                break;
        }
    };

    const fetchOrders = async (): Promise<Order[]> => {
        return await getOrder();
    };

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const orders = await fetchOrders();
                setOrders(orders);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();

        webSocketService.connect(handleOrderEvent);

        return () => webSocketService.disconnect();
    }, []);

    const openOrder = (order: Order) => {
        setSelectedOrder(order);
        setSheetOpen(true);
    };

    if (loading)
        return <div className="flex h-full items-center justify-center">Cargando...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    const pendientes = orders.filter(o => o.espeId === 1);
    const preparacion = orders.filter(o => o.espeId === 2);
    const entregados = orders.filter(o => o.espeId === 3);

    const columnClass = "flex flex-1 flex-col rounded-xl border bg-white p-4 overflow-y-auto";

    const badgeClass =
        "ml-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-xs font-semibold";

    return (
        <div className="flex h-full gap-4 overflow-hidden">
            <section className={columnClass}>
                <div className="mb-5 flex items-center">
                    <h2 className="text-lg font-semibold text-yellow-600">
                        PENDIENTES
                    </h2>
                    <span className={cn(badgeClass, "border-yellow-600")}>
                            {pendientes.length}
                        </span>
                </div>
                <div className="space-y-3">
                    {pendientes.map(order => (
                        <OrderCardComponente
                            key={order.pediId}
                            state="pendiente"
                            order={order}
                            onClick={openOrder}
                        />
                    ))}
                </div>
                <div className="flex flex-row justify-center mt-auto w-full">
                    <Button
                        type="submit"
                        className="w-full mt-6 bg-transparent border border-yellow-600 text-back
                        hover:bg-transparent hover:text-white hover:bg-yellow-600"
                        disabled={pendientes.length <= 0}
                        onClick={() => {
                        }}
                    >
                        Ver todo ({pendientes.length})
                    </Button>
                </div>
            </section>
            <section className={columnClass}>
                <div className="mb-5 flex items-center">
                    <h2 className="text-lg font-semibold text-green-700">
                        EN PREPARACIÓN
                    </h2>
                    <span className={cn(badgeClass, "border-green-700")}>
                            {preparacion.length}
                        </span>
                </div>
                <div className="space-y-3">
                    {preparacion.map(order => (
                        <OrderCardComponente
                            key={order.pediId}
                            state="preparacion"
                            order={order}
                            onClick={openOrder}
                        />
                    ))}
                </div>
                <div className="flex flex-row justify-center mt-auto w-full">
                    <Button
                        type="submit"
                        className="w-full mt-6 bg-transparent border border-green-700 text-back
                        hover:bg-transparent hover:text-white hover:bg-green-700"
                        disabled={preparacion.length <= 0}
                        onClick={() => {
                        }}
                    >
                        Ver todo ({pendientes.length})
                    </Button>
                </div>
            </section>
            <section className={columnClass}>
                <div className="mb-5 flex items-center">
                    <h2 className="text-lg font-semibold text-blue-900">
                        ENTREGADOS
                    </h2>
                    <span className={cn(badgeClass, "border-blue-900")}>
                            {entregados.length}
                        </span>
                </div>
                <div className="space-y-3">
                    {entregados.map(order => (
                        <OrderCardComponente
                            key={order.pediId}
                            state="entregado"
                            order={order}
                            onClick={openOrder}
                        />
                    ))}
                </div>
                <div className="flex flex-row justify-center mt-auto w-full">
                    <Button
                        type="submit"
                        className="w-full mt-6 bg-transparent border border-blue-900 text-back
                        hover:bg-transparent hover:text-white hover:bg-blue-900"
                        disabled={entregados.length <= 0}
                        onClick={() => {
                        }}
                    >
                        Ver todo ({pendientes.length})
                    </Button>
                </div>
            </section>
            <OrderDetailsSheet
                open={sheetOpen}
                order={selectedOrder}
                onOpenChange={setSheetOpen}
            />
        </div>
    );
}
