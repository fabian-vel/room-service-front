import {
    Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {dinero, fechaHora, type PedidoFactura} from "@/feature/factura/service/FacturaService.ts";

interface Props {
    pedidos: PedidoFactura[];
    total: number;
}

// una fila por producto; la usan la pantalla y la factura impresa
export function DetalleFactura({pedidos, total}: Readonly<Props>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="font-bold">Pedido</TableHead>
                    <TableHead className="font-bold">Producto</TableHead>
                    <TableHead className="font-bold text-right">Cant.</TableHead>
                    <TableHead className="font-bold text-right">Precio</TableHead>
                    <TableHead className="font-bold text-right">Subtotal</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pedidos.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={5} className="h-16 text-center text-muted-foreground">
                            No hay pedidos
                        </TableCell>
                    </TableRow>
                ) : pedidos.flatMap(pedido => pedido.detalle.map((linea, i) => (
                    <TableRow key={`${pedido.pediId}-${i}`}>
                        <TableCell className="text-xs text-muted-foreground">
                            {i === 0 && <>#{pedido.pediId} · {fechaHora(pedido.pediFechaCreacion)}</>}
                        </TableCell>
                        <TableCell>{linea.meitNombre}</TableCell>
                        <TableCell className="text-right tabular-nums">{linea.cantidad}</TableCell>
                        <TableCell className="text-right tabular-nums">{dinero(linea.precioUnitario)}</TableCell>
                        <TableCell className="text-right tabular-nums">{dinero(linea.subtotal)}</TableCell>
                    </TableRow>
                )))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{dinero(total)}</TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    );
}
