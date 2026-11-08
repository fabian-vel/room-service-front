import {cn} from "@/shared/shadcn/lib/utils.ts";
import {OrderCardComponente} from "@/feature/daily-order/components/OrderCardComponente.tsx";
import {useCallback, useEffect, useRef, useState} from "react";
import type {Order} from "@/feature/daily-order/types/Order.ts";
import {getOrder} from "@/feature/daily-order/service/DailyOrderService.ts";
import {KitchenWebSocketService} from "@/feature/daily-order/service/KitchenWebSocketService.ts";
import type {OrderEvent} from "@/types/OrderEvent.ts";
import {OrderEventType} from "@/types/OrderEventType.ts";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {OrderDetailsSheet} from "@/feature/daily-order/components/OrderDetailsSheet.tsx";
import {useSoundStore} from "@/shared/store/soundStore.ts";
import {type OrderToast, OrderToastComponent} from "@/feature/daily-order/components/OrderToastComponent.tsx";
import {calcularTotalProductos} from "@/shared/utils/order.ts";

const webSocketService = new KitchenWebSocketService();

const VENTANA_MS = 1000;
const MAX_AVISOS = 3;

export function DailyOrderScreen() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    const [toasts, setToasts] = useState<OrderToast[]>([]);

    const cerrarToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    // eventos que llegan dentro de la misma ventana se procesan juntos
    const rafaga = useRef<Record<OrderToast["tipo"], number[]>>({nuevo: [], cancelado: []});
    const rafagaTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    // solo se aplica la respuesta de la última recarga, aunque una anterior llegue después
    const ultimaRecarga = useRef(0);

    const fetchOrders = async (): Promise<Order[]> => {
        const recarga = ++ultimaRecarga.current;
        const nuevos = await getOrder();
        if (recarga === ultimaRecarga.current) setOrders(nuevos);
        return nuevos;
    };

    const procesarRafaga = () => {
        rafagaTimer.current = undefined;
        const eventos = rafaga.current;
        rafaga.current = {nuevo: [], cancelado: []};

        if (eventos.nuevo.length) useSoundStore.getState().reproducir('nuevo-pedido');
        if (eventos.cancelado.length) useSoundStore.getState().reproducir('pedido-cancelado');

        fetchOrders()
            .then(pedidos => {
                const aviso = (tipo: OrderToast["tipo"]): OrderToast[] => {
                    const ids = eventos[tipo];
                    if (!ids.length) return [];
                    const encontrados = ids
                        .map(id => pedidos.find(o => o.pediId === id))
                        .filter(o => o !== undefined);
                    return [{
                        id: Date.now() + (tipo === "nuevo" ? 0 : 1),
                        tipo,
                        cantidad: ids.length,
                        habitaciones: encontrados.map(o => o.pediHabitacion),
                        productos: ids.length === 1 && encontrados[0]
                            ? calcularTotalProductos(encontrados[0].detallePedidoList)
                            : undefined,
                        pediId: ids[0],
                    }];
                };
                setToasts(prev => [...prev, ...aviso("nuevo"), ...aviso("cancelado")].slice(-MAX_AVISOS));
            })
            .catch(e => setError(e.message));
    };

    const encolar = (tipo: OrderToast["tipo"], pediId: number) => {
        rafaga.current[tipo].push(pediId);
        // la ventana empieza con el primer evento y no se alarga con los siguientes
        rafagaTimer.current ??= setTimeout(procesarRafaga, VENTANA_MS);
    };

    const handleOrderEvent = (event: OrderEvent) => {
        switch (event.type) {
            case OrderEventType.CREATED:
                encolar("nuevo", event.pedidoId);
                break;
            case OrderEventType.STATUS_CHANGED:
                break;
            case OrderEventType.UPDATED:
                break;
            case OrderEventType.CANCELLED:
                encolar("cancelado", event.pedidoId);
                break;
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getOrder(controller.signal)
            .then(orders => {
                if (!controller.signal.aborted) setOrders(orders);
            })
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') {
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        webSocketService.connect(handleOrderEvent);

        return () => {
            controller.abort();
            clearTimeout(rafagaTimer.current);
            webSocketService.disconnect();
        };
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
            <OrderToastComponent toasts={toasts} onClose={cerrarToast}/>
            <OrderDetailsSheet
                key={selectedOrder?.pediId}
                open={sheetOpen}
                order={selectedOrder}
                onOpenChange={setSheetOpen}
                onEstadoCambiado={() => {
                    setSheetOpen(false);
                    fetchOrders().catch(e => setError(e.message));
                }}
            />
        </div>
    );
}
