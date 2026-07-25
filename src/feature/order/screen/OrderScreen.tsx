import {cn} from "@/shared/shadcn/lib/utils.ts";
import {OrderCardComponente} from "@/feature/order/components/OrderCardComponente.tsx";
import {useEffect, useState} from "react";
import type {Order} from "@/feature/order/types/Order.ts";
import {getOrder} from "@/feature/order/service/OrderService.ts";

export function OrderScreen() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setOrders(await getOrder());
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

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
                        />
                    ))}
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
                        />
                    ))}
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
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
