import type {Category} from "@/feature/masters/types/Category.ts";
import {Pencil, Trash2} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {getStatusConfig} from "@/shared/utils/stateLabel.ts";

interface Props {
    data: Category[];
    onEdit: (item: Category) => void;
    onDelete: (item: Category) => void;
}

export function CategoriesTable({data, onEdit, onDelete}: Readonly<Props>) {
    return (
        <div className="h-full overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead>Llave maestra</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-24"/>
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
                                    <TableCell className="font-medium">{item.mecaLlaveMst}</TableCell>
                                    <TableCell>{item.mecaNombre}</TableCell>
                                    <TableCell className="max-w-62.5">
                                        <span className="block truncate">{item.mecaDescripcion ?? "—"}</span>
                                    </TableCell>
                                    <TableCell className="max-w-50">
                                        <span className="block truncate">{item.mecaImagenUrl ?? "—"}</span>
                                    </TableCell>
                                    <TableCell>
                                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${status.className}`}>
                                        {status.label}
                                    </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onEdit(item)}
                                            >
                                                <Pencil className="size-4"/>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => onDelete(item)}
                                            >
                                                <Trash2 className="size-4 text-red-500"/>
                                            </Button>
                                        </div>
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
