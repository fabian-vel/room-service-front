import {type ReactNode, useEffect, useState} from "react";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {getReporte, type Reporte} from "@/feature/reportes/service/ReporteService.ts";

// el espe_id 4 es Cancelado (mst_estados_pedido)
const ESTADO_CANCELADO = 4;

// YYYY-MM-DD en la hora local (toISOString usaría UTC y podría dar otro día)
const fechaLocal = (fecha: Date) =>
    `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

const hoy = new Date();
const PRIMER_DIA_MES = fechaLocal(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
const HOY = fechaLocal(hoy);

const dinero = (valor: number) => `$${valor.toLocaleString("es-CO")}`;

// "2026-11-14" -> "14/11/2026" sin pasar por Date, para no correr el día por zona horaria
const fechaCorta = (fecha: string) => fecha.split("-").reverse().join("/");

export function ReportesScreen() {

    const [desde, setDesde] = useState(PRIMER_DIA_MES);
    const [hasta, setHasta] = useState(HOY);
    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!desde || !hasta) return;
        const controller = new AbortController();
        getReporte(desde, hasta, controller.signal)
            .then(data => {
                setReporte(data);
                setError(null);
            })
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') {
                    setError(e.message);
                }
            });
        return () => controller.abort();
    }, [desde, hasta]);

    const ventas = reporte?.ventasPorDia.reduce((acc, d) => acc + d.total, 0) ?? 0;
    const pedidosVendidos = reporte?.ventasPorDia.reduce((acc, d) => acc + d.pedidos, 0) ?? 0;
    const pedidosTotales = reporte?.pedidosPorEstado.reduce((acc, e) => acc + e.pedidos, 0) ?? 0;
    const cancelados = reporte?.pedidosPorEstado.find(e => e.espeId === ESTADO_CANCELADO)?.pedidos ?? 0;

    return (
        <div className="flex h-full flex-col gap-4 overflow-y-auto">
            <div className="flex flex-wrap items-end gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="reporte_desde">Desde</Label>
                    <Input id="reporte_desde" type="date" value={desde} max={hasta || undefined}
                           onChange={e => setDesde(e.target.value)} className="w-40"/>
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="reporte_hasta">Hasta</Label>
                    <Input id="reporte_hasta" type="date" value={hasta} min={desde || undefined}
                           onChange={e => setHasta(e.target.value)} className="w-40"/>
                </div>
                {error && <span className="text-sm text-red-600">{error}</span>}
            </div>

            {!reporte ? (
                !error && <div className="flex flex-1 items-center justify-center">Cargando...</div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        <Indicador titulo="Ventas" valor={dinero(ventas)} detalle="Sin pedidos cancelados"/>
                        <Indicador titulo="Pedidos vendidos" valor={pedidosVendidos.toLocaleString("es-CO")}/>
                        <Indicador titulo="Ticket promedio"
                                   valor={dinero(pedidosVendidos ? Math.round(ventas / pedidosVendidos) : 0)}/>
                        <Indicador titulo="Cancelación"
                                   valor={`${pedidosTotales ? Math.round(cancelados * 100 / pedidosTotales) : 0}%`}
                                   detalle={`${cancelados} de ${pedidosTotales} pedidos`}/>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <Seccion titulo="Ventas por día">
                            <TablaReporte columnas={["Fecha", "Pedidos", "Total"]}
                                          filas={reporte.ventasPorDia.map(d => [fechaCorta(d.fecha), d.pedidos, dinero(d.total)])}/>
                        </Seccion>
                        <Seccion titulo="Ítems más vendidos">
                            <TablaReporte columnas={["Ítem", "Cantidad", "Total"]}
                                          filas={reporte.itemsMasVendidos.map(i => [i.meitNombre, i.cantidad, dinero(i.total)])}/>
                        </Seccion>
                        <Seccion titulo="Pedidos por estado">
                            <TablaReporte columnas={["Estado", "Pedidos", "Total"]}
                                          filas={reporte.pedidosPorEstado.map(e => [e.espeNombre, e.pedidos, dinero(e.total)])}/>
                        </Seccion>
                        <Seccion titulo="Ventas por habitación">
                            <TablaReporte columnas={["Habitación", "Pedidos", "Total"]}
                                          filas={reporte.ventasPorHabitacion.map(h => [h.habitacion, h.pedidos, dinero(h.total)])}/>
                        </Seccion>
                    </div>
                </>
            )}
        </div>
    );
}

function Indicador({titulo, valor, detalle}: Readonly<{ titulo: string; valor: string; detalle?: string }>) {
    return (
        <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-muted-foreground">{titulo}</p>
            <p className="text-2xl font-bold tabular-nums">{valor}</p>
            {detalle && <p className="text-xs text-muted-foreground">{detalle}</p>}
        </div>
    );
}

function Seccion({titulo, children}: Readonly<{ titulo: string; children: ReactNode }>) {
    return (
        <section className="rounded-xl border bg-white p-4">
            <h2 className="mb-2 font-semibold">{titulo}</h2>
            {children}
        </section>
    );
}

// la primera columna es texto; las demás son números y van a la derecha
function TablaReporte({columnas, filas}: Readonly<{ columnas: string[]; filas: (string | number)[][] }>) {
    if (!filas.length)
        return <p className="py-6 text-center text-sm text-muted-foreground">Sin datos en el rango</p>;

    return (
        <div className="max-h-80 overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columnas.map((columna, i) => (
                            <TableHead key={columna} className={i > 0 ? "text-right" : undefined}>{columna}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filas.map(fila => (
                        <TableRow key={String(fila[0])}>
                            {fila.map((celda, i) => (
                                <TableCell key={columnas[i]} className={i > 0 ? "text-right tabular-nums" : undefined}>
                                    {celda}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
