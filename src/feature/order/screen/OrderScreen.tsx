import {useEffect, useState} from "react";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/shared/shadcn/components/ui/select.tsx";
import {Search, X} from "lucide-react";
import type {Order} from "@/feature/order/types/Order.ts";
import {getOrders} from "@/feature/order/service/OrderService.ts";
import {OrdersTable} from "@/feature/order/components/OrdersTable.tsx";
import {CatalogPaginator} from "@/feature/masters/catalogs/components/CatalogPaginator.tsx";

const PAGE_SIZE = 20;
const MIN_PRODUCTO_LENGTH = 3;
const DEBOUNCE_MS = 400;
const TODOS = "todos";

// los valores corresponden a espe_id en mst_estados_pedido
const ESTADOS = [
    {value: TODOS, label: "Todos"},
    {value: "1", label: "Pendiente"},
    {value: "2", label: "En preparación"},
    {value: "3", label: "Entregado"},
    {value: "4", label: "Cancelado"},
] as const;

interface Filters {
    desde: string;
    hasta: string;
    estado: string;
    habitacion: string;
    producto: string;
}

const EMPTY_FILTERS: Filters = {
    desde: "",
    hasta: "",
    estado: TODOS,
    habitacion: "",
    producto: "",
};

export function OrderScreen() {

    const [orders, setOrders] = useState<Order[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // filtros aplicados a la consulta; al entrar a la vista se consulta sin filtros
    const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
    const [page, setPage] = useState(1);
    const [habitacionInput, setHabitacionInput] = useState("");
    const [productoInput, setProductoInput] = useState("");

    const applyFilters = (changes: Partial<Filters>) => {
        setFilters(prev => ({...prev, ...changes}));
        setPage(1);
    };

    useEffect(() => {
        const controller = new AbortController();
        getOrders({
            fechaDesde: filters.desde || undefined,
            fechaHasta: filters.hasta || undefined,
            estadoPedido: filters.estado === TODOS ? undefined : Number(filters.estado),
            habitacion: filters.habitacion || undefined,
            producto: filters.producto || undefined,
            page,
            size: PAGE_SIZE,
        }, controller.signal)
            .then(data => {
                if (controller.signal.aborted) return;
                setOrders(data.items);
                setTotal(data.total);
                setError(null);
            })
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') {
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, [filters, page]);

    // los filtros de texto se aplican cuando el usuario deja de escribir
    useEffect(() => {
        const habitacion = habitacionInput.trim();
        const term = productoInput.trim();
        const producto = term.length >= MIN_PRODUCTO_LENGTH ? term : "";
        if (habitacion === filters.habitacion && producto === filters.producto) return;

        const timeout = setTimeout(() => {
            setFilters(prev => ({...prev, habitacion, producto}));
            setPage(1);
        }, DEBOUNCE_MS);
        return () => clearTimeout(timeout);
    }, [habitacionInput, productoInput, filters.habitacion, filters.producto]);

    const clearFilters = () => {
        setHabitacionInput("");
        setProductoInput("");
        setFilters(EMPTY_FILTERS);
        setPage(1);
    };

    if (loading)
        return <div className="flex h-full items-center justify-center">Cargando...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <div className="flex h-full flex-col gap-3">
            <div className="flex flex-wrap items-end gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="filtro_desde">Desde</Label>
                    <Input
                        id="filtro_desde"
                        type="date"
                        value={filters.desde}
                        max={filters.hasta || undefined}
                        onChange={e => applyFilters({desde: e.target.value})}
                        className="w-40"
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="filtro_hasta">Hasta</Label>
                    <Input
                        id="filtro_hasta"
                        type="date"
                        value={filters.hasta}
                        min={filters.desde || undefined}
                        onChange={e => applyFilters({hasta: e.target.value})}
                        className="w-40"
                    />
                </div>
                <div className="grid gap-1.5">
                    <Label>Estado</Label>
                    <Select
                        items={ESTADOS}
                        value={filters.estado}
                        onValueChange={value => applyFilters({estado: value as string})}
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {ESTADOS.map(estado => (
                                    <SelectItem key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="filtro_habitacion">Habitación</Label>
                    <Input
                        id="filtro_habitacion"
                        placeholder="Ej: 302"
                        value={habitacionInput}
                        onChange={e => setHabitacionInput(e.target.value)}
                        className="w-28"
                    />
                </div>
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Filtrar por producto..."
                        value={productoInput}
                        onChange={e => setProductoInput(e.target.value)}
                        className="w-72 pl-8"
                    />
                </div>
                <Button variant="outline" className="gap-2" onClick={clearFilters}>
                    <X className="size-4"/>
                    Limpiar filtros
                </Button>
                <span className="ml-auto text-sm text-muted-foreground">{total} pedido(s)</span>
            </div>

            <div className="min-h-0 flex-1">
                <OrdersTable
                    orders={orders}
                    showEstado
                    onOpenWindow={(order) => {
                        console.log("Abrir ventana del pedido", order.pediId);
                    }}
                />
            </div>

            <CatalogPaginator
                currentPage={Math.min(page, totalPages)}
                totalPages={totalPages}
                goToPage={target => setPage(Math.max(1, Math.min(target, totalPages)))}
            />
        </div>
    );
}
