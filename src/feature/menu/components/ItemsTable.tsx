import type {Item} from "@/feature/menu/service/ItemService.ts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";

interface Props {
    data: Item[];
    selectedItem: Item | null;
    onSelectionChange: (item: Item | null) => void;
}

export function ItemsTable({data, selectedItem, onSelectionChange}: Readonly<Props>) {
    return (
        <div className="overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead/>
                        <TableHead className="font-bold">Nombre</TableHead>
                        <TableHead className="font-bold">Categoría</TableHead>
                        <TableHead className="font-bold text-right">Precio</TableHead>
                        <TableHead className="font-bold">Etiquetas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No hay ítems
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(item => (
                            <TableRow key={item.meitId}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedItem?.meitId === item.meitId}
                                        onCheckedChange={(checked) => onSelectionChange(checked ? item : null)}
                                    />
                                </TableCell>
                                <TableCell className="max-w-72">
                                    <span className="block truncate font-medium">{item.meitNombre}</span>
                                    {item.meitDescripcion && (
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {item.meitDescripcion}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {item.mecaParentNombre ? `${item.mecaParentNombre} / ` : ""}{item.mecaNombre}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    ${item.meitPrecio.toLocaleString("es-CO")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {item.etiquetas.length === 0 ? "—" : item.etiquetas.map(etiqueta => (
                                            <span key={etiqueta.etiqId}
                                                  className="rounded-full border px-2 py-0.5 text-xs">
                                                {etiqueta.etiqNombre}
                                            </span>
                                        ))}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
