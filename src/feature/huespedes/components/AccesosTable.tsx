import {type Acceso, type EstadoAcceso, estadoAcceso, fechaHora} from "@/feature/huespedes/service/AccesoService.ts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";

interface Props {
    data: Acceso[];
    selectedItem: Acceso | null;
    onSelectionChange: (item: Acceso | null) => void;
}

const COLOR_ESTADO: Record<EstadoAcceso, string> = {
    "Vigente": "bg-green-100 text-green-800",
    "Por iniciar": "bg-blue-100 text-blue-800",
    "Vencido": "bg-amber-100 text-amber-800",
    "Finalizado": "bg-slate-200 text-slate-700",
};

export function AccesosTable({data, selectedItem, onSelectionChange}: Readonly<Props>) {
    return (
        <div className="overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead/>
                        <TableHead className="font-bold">Habitación</TableHead>
                        <TableHead className="font-bold">Huésped</TableHead>
                        <TableHead className="font-bold">Código</TableHead>
                        <TableHead className="font-bold">Inicio</TableHead>
                        <TableHead className="font-bold">Fin</TableHead>
                        <TableHead className="font-bold">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                No hay accesos
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(acceso => {
                            const estado = estadoAcceso(acceso);
                            return (
                                <TableRow key={acceso.haacId}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItem?.haacId === acceso.haacId}
                                            onCheckedChange={(checked) => onSelectionChange(checked ? acceso : null)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-semibold">{acceso.haacHabitacion}</TableCell>
                                    <TableCell>
                                        <span className="block font-medium">{acceso.haacClienteNombre}</span>
                                        {acceso.haacClienteDoc && (
                                            <span className="block text-xs text-muted-foreground">{acceso.haacClienteDoc}</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-mono tracking-widest">{acceso.haacCodigo}</TableCell>
                                    <TableCell>{fechaHora(acceso.haacFechaInicio)}</TableCell>
                                    <TableCell>{fechaHora(acceso.haacFechaFin)}</TableCell>
                                    <TableCell>
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${COLOR_ESTADO[estado]}`}>
                                            {estado}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
