import {createPortal} from "react-dom";
import {DetalleFactura} from "@/feature/factura/components/DetalleFactura.tsx";
import {
    type AccesoFactura, dinero, fechaHora, nombreMetodo, type PagoFactura, type PedidoFactura
} from "@/feature/factura/service/FacturaService.ts";

interface Props {
    acceso: AccesoFactura;
    pedidos: PedidoFactura[];
    total: number;
    // con pago: copia de un cobro ya registrado; sin pago: cuenta pendiente
    pago: PagoFactura | null;
}

// fuera de #root: en pantalla no se ve y al imprimir es lo único que sale (ver index.css)
export function FacturaImprimible({acceso, pedidos, total, pago}: Readonly<Props>) {
    return createPortal(
        <div className="hidden p-8 text-sm text-black print:block">
            <h1 className="text-xl font-bold">{pago ? `Factura - pago #${pago.pagoId}` : "Cuenta pendiente"}</h1>
            <div className="mt-2 mb-4 grid grid-cols-2 gap-1">
                <span>Habitación: <b>{acceso.haacHabitacion}</b></span>
                <span>Huésped: <b>{acceso.haacClienteNombre}</b>
                    {acceso.haacClienteDoc && ` (${acceso.haacClienteDoc})`}</span>
                <span>Estadía: {fechaHora(acceso.haacFechaInicio)} a {fechaHora(acceso.haacFechaFin)}</span>
                <span>Impresa: {fechaHora(new Date().toISOString())}</span>
                {pago && <>
                    <span>Pagado: {fechaHora(pago.pagoFechaCreacion)} · {nombreMetodo(pago.pagoMetodo)}</span>
                    <span>Recibió: {pago.emplNombre}</span>
                </>}
            </div>
            <DetalleFactura pedidos={pedidos} total={total}/>
            {pago?.pagoObservacion && <p className="mt-4">Observación: {pago.pagoObservacion}</p>}
            {!pago && <p className="mt-4 font-semibold">Total a pagar: {dinero(total)}</p>}
        </div>,
        document.body,
    );
}
