import type {Category} from "@/feature/masters/types/Category.ts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {getStatusConfig} from "@/shared/utils/stateLabel.ts";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";

interface Props {
    data: Category[];
    selectedItem: Category | null;
    onSelectionChange: (item: Category | null) => void;
}

export function CategoriesTable({data, selectedItem, onSelectionChange}: Readonly<Props>) {
    return (
        <div className="overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead />
                        <TableHead className="font-bold">Llave maestra</TableHead>
                        <TableHead className="font-bold">Nombre</TableHead>
                        <TableHead className="font-bold">Descripción</TableHead>
                        <TableHead className="font-bold">Imagen</TableHead>
                        <TableHead className="font-bold">Estado</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No categories
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(item => {
                            const status = getStatusConfig(item.mecaEstado);
                            return (
                                <TableRow key={item.mecaId}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItem?.mecaId === item.mecaId}
                                            onCheckedChange={(checked) => {
                                                onSelectionChange(checked ? item : null);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.mecaLlaveMst}</TableCell>
                                    <TableCell>{item.mecaNombre}</TableCell>
                                    <TableCell className="max-w-62.5">
                                        <span className="block truncate">{item.mecaDescripcion ?? "—"}</span>
                                    </TableCell>
                                    <TableCell className="max-w-50">
                                        <span className="block truncate">{item.mecaImagenUrl ?? "—"}</span>
                                    </TableCell>
                                    <TableCell>
                                    <span
                                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${status.className}`}>
                                        {status.label}
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
