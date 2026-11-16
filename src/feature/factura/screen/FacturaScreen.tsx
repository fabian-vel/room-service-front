import {useEffect, useRef, useState} from "react";
import {flushSync} from "react-dom";
import {CreditCard, Printer, Search} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {
    type AccesoFactura, buscarAccesos, dinero, type Factura, fechaHora, getFactura, nombreMetodo,
    type PagoFactura, type PagoFormData, registrarPago
} from "@/feature/factura/service/FacturaService.ts";
import {DetalleFactura} from "@/feature/factura/components/DetalleFactura.tsx";
import {FacturaImprimible} from "@/feature/factura/components/FacturaImprimible.tsx";
import {PagoDialog} from "@/feature/factura/components/PagoDialog.tsx";

// recepción cobra al huésped: pedidos sin pagar del acceso, registro del pago e impresión
export function FacturaScreen() {
    const [habitacion, setHabitacion] = useState("");
    const [accesos, setAccesos] = useState<AccesoFactura[]>([]);
    const [haacId, setHaacId] = useState<number | null>(null);
    const [factura, setFactura] = useState<Factura | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pagoOpen, setPagoOpen] = useState(false);
    // qué sale al imprimir: null = cuenta pendiente; un pago = copia de ese cobro
    const [pagoImpreso, setPagoImpreso] = useState<PagoFactura | null>(null);
    // acceso elegido al llegar la respuesta: descarta la de un acceso anterior
    const seleccionado = useRef<number | null>(null);

    // al entrar: los accesos que tienen saldo pendiente
    useEffect(() => {
        const controller = new AbortController();
        buscarAccesos("", controller.signal)
            .then(setAccesos)
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') setError(e.message);
            });
        return () => controller.abort();
    }, []);

    const buscar = async () => {
        try {
            setError(null);
            setAccesos(await buscarAccesos(habitacion.trim()));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo buscar");
        }
    };

    const cargarFactura = async (id: number) => {
        try {
            setError(null);
            const nueva = await getFactura(id);
            if (seleccionado.current === id) setFactura(nueva);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo cargar la factura");
        }
    };

    const seleccionar = (id: number) => {
        seleccionado.current = id;
        setHaacId(id);
        setFactura(null);
        void cargarFactura(id);
    };

    const handlePago = async (data: PagoFormData) => {
        await registrarPago(haacId!, data);
        setPagoOpen(false);
        await Promise.all([cargarFactura(haacId!), buscar()]);
    };

    const imprimir = (pago: PagoFactura | null) => {
        // el portal tiene que estar renderizado con este contenido antes de abrir el diálogo de impresión
        flushSync(() => setPagoImpreso(pago));
        window.print();
    };

    const pendientes = factura?.pedidos.filter(p => p.pagoId == null) ?? [];
    const impresos = factura?.pedidos.filter(p => p.pagoId === (pagoImpreso?.pagoId ?? null)) ?? [];

    return (
        <div className="flex h-full gap-4 pb-4">
            <aside className="flex w-80 shrink-0 flex-col gap-3">
                <form className="flex gap-2" onSubmit={e => {
                    e.preventDefault();
                    void buscar();
                }}>
                    <Input placeholder="Habitación (vacío: los que deben)" value={habitacion}
                           onChange={e => setHabitacion(e.target.value)}/>
                    <Button type="submit" size="icon" aria-label="Buscar">
                        <Search className="size-4"/>
                    </Button>
                </form>

                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                    {accesos.length === 0 && (
                        <p className="p-4 text-center text-sm text-muted-foreground">No hay accesos</p>
                    )}
                    {accesos.map(acceso => (
                        <button key={acceso.haacId} type="button" onClick={() => seleccionar(acceso.haacId)}
                                className={`rounded-xl border bg-white p-3 text-left text-sm hover:bg-slate-50 ${
                                    acceso.haacId === haacId ? "ring-2 ring-primary" : ""}`}>
                            <div className="flex justify-between font-semibold">
                                <span>Hab. {acceso.haacHabitacion}</span>
                                <span className="tabular-nums">{dinero(acceso.totalPendiente)}</span>
                            </div>
                            <div className="text-muted-foreground">{acceso.haacClienteNombre}</div>
                            <div className="text-xs text-muted-foreground">
                                {fechaHora(acceso.haacFechaInicio)} a {fechaHora(acceso.haacFechaFin)}
                            </div>
                            {acceso.pedidosSinEntregar > 0 && (
                                <div className="mt-1 text-xs font-medium text-amber-700">
                                    {acceso.pedidosSinEntregar} pedido(s) sin entregar
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </aside>

            <section className="min-h-0 flex-1 overflow-y-auto rounded-xl border bg-white p-4">
                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

                {haacId == null && !error && (
                    <p className="p-8 text-center text-muted-foreground">Seleccione un acceso para ver su factura</p>
                )}
                {haacId != null && !factura && !error && <p className="p-8 text-center">Cargando...</p>}

                {factura && <>
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Habitación {factura.acceso.haacHabitacion} · {factura.acceso.haacClienteNombre}
                                {factura.acceso.haacClienteDoc && ` (${factura.acceso.haacClienteDoc})`}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Estadía: {fechaHora(factura.acceso.haacFechaInicio)} a {fechaHora(factura.acceso.haacFechaFin)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="gap-2" disabled={pendientes.length === 0}
                                    onClick={() => imprimir(null)}>
                                <Printer className="size-4"/>
                                Imprimir cuenta
                            </Button>
                            <Button className="gap-2" onClick={() => setPagoOpen(true)}
                                    disabled={pendientes.length === 0 || factura.acceso.pedidosSinEntregar > 0}>
                                <CreditCard className="size-4"/>
                                Registrar pago
                            </Button>
                        </div>
                    </div>

                    {factura.acceso.pedidosSinEntregar > 0 && (
                        <p className="mb-3 rounded-md bg-amber-50 p-2 text-sm text-amber-800">
                            Hay {factura.acceso.pedidosSinEntregar} pedido(s) sin entregar: se puede cobrar cuando
                            estén entregados.
                        </p>
                    )}

                    <h3 className="mb-1 font-semibold">Pendiente de cobro</h3>
                    <DetalleFactura pedidos={pendientes} total={factura.acceso.totalPendiente}/>

                    <h3 className="mt-6 mb-1 font-semibold">Pagos registrados</h3>
                    {factura.pagos.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin pagos</p>
                    ) : (
                        <ul className="divide-y rounded-md border">
                            {factura.pagos.map(pago => (
                                <li key={pago.pagoId} className="flex items-center justify-between gap-2 p-2 text-sm">
                                    <span>
                                        #{pago.pagoId} · {fechaHora(pago.pagoFechaCreacion)} · {nombreMetodo(pago.pagoMetodo)}
                                        · {pago.emplNombre}
                                        {pago.pagoObservacion && <span className="text-muted-foreground"> · {pago.pagoObservacion}</span>}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <b className="tabular-nums">{dinero(pago.pagoTotal)}</b>
                                        <Button variant="ghost" size="icon" aria-label="Imprimir pago"
                                                onClick={() => imprimir(pago)}>
                                            <Printer className="size-4"/>
                                        </Button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <FacturaImprimible acceso={factura.acceso} pedidos={impresos} pago={pagoImpreso}
                                       total={pagoImpreso?.pagoTotal ?? factura.acceso.totalPendiente}/>
                    <PagoDialog key={haacId} open={pagoOpen} total={factura.acceso.totalPendiente}
                                onOpenChange={setPagoOpen} onSubmit={handlePago}/>
                </>}
            </section>
        </div>
    );
}
