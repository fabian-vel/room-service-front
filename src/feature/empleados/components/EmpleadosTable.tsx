import {type Empleado, nombreRol} from "@/feature/empleados/service/EmpleadoService.ts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";

interface Props {
    data: Empleado[];
    selectedItem: Empleado | null;
    onSelectionChange: (item: Empleado | null) => void;
}

export function EmpleadosTable({data, selectedItem, onSelectionChange}: Readonly<Props>) {
    return (
        <div className="overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead/>
                        <TableHead className="font-bold">Nombre</TableHead>
                        <TableHead className="font-bold">Usuario</TableHead>
                        <TableHead className="font-bold">Rol</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                No hay empleados
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(empleado => (
                            <TableRow key={empleado.emplId}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedItem?.emplId === empleado.emplId}
                                        onCheckedChange={(checked) => onSelectionChange(checked ? empleado : null)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{empleado.emplNombre}</TableCell>
                                <TableCell>{empleado.emplUsuario}</TableCell>
                                <TableCell>{nombreRol(empleado.emplRol)}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
