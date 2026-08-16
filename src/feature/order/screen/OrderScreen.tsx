import {useEffect, useMemo, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/shared/shadcn/components/ui/tabs.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Search} from "lucide-react";
import type {Order} from "@/feature/order/types/Order.ts";
import {getOrders} from "@/feature/order/service/OrderService.ts";
import {OrdersTable} from "@/feature/order/components/OrdersTable.tsx";

const ESTADO_PENDIENTE = 1;
const ESTADO_PREPARACION = 2;
const ESTADO_ENTREGADO = 3;
const ESTADO_CANCELADO = 4;

const TABS = [
    {value: "todos", label: "Todos"},
    {value: "pendientes", label: "Pendientes"},
    {value: "preparacion", label: "En preparación"},
    {value: "entregados", label: "Entregados"},
    {value: "cancelados", label: "Cancelados"},
] as const;

type TabValue = (typeof TABS)[number]["value"];

const ESTADOS_FILTRO: Record<Exclude<TabValue, "todos">, number> = {
    pendientes: ESTADO_PENDIENTE,
    preparacion: ESTADO_PREPARACION,
    entregados: ESTADO_ENTREGADO,
    cancelados: ESTADO_CANCELADO,
};

const productosText = (order: Order): string => {
    return order.detallePedidoList.map(i => i.meitNombre).join(", ").toLowerCase();
};

export function OrderScreen() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const tabOrders = useMemo(() => {
        const term = filter.trim().toLowerCase();

        const filterByProductos = (list: Order[]): Order[] => {
            if (term.length < 3) {
                return list;
            }

            return list.filter(order => productosText(order).includes(term));
        };

        return TABS.reduce<Record<TabValue, Order[]>>((acc, tab) => {
            const list = tab.value === "todos"
                ? orders
                : orders.filter(o => o.espeId === ESTADOS_FILTRO[tab.value]);
            acc[tab.value] = filterByProductos(list);
            return acc;
        }, {} as Record<TabValue, Order[]>);
    }, [orders, filter]);

    if (loading)
        return <div className="flex h-full items-center justify-center">Cargando...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    return (
        <Tabs defaultValue="todos" className="flex h-full flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
                <TabsList className="h-9">
                    {TABS.map(tab => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Filtrar por producto..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-72 pl-8"
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1">
                {TABS.map(tab => (
                    <TabsContent key={tab.value} value={tab.value} className="h-full">
                        <OrdersTable
                            orders={tabOrders[tab.value]}
                            showEstado={tab.value === "todos"}
                            onOpenWindow={(order) => {
                                console.log("Abrir ventana del pedido", order.pediId);
                            }}
                        />
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
}
