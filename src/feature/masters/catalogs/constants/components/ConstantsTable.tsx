import type {Constant} from "@/feature/masters/types/Constant.ts";
import {Pencil, Trash2} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {getStatusConfig} from "@/shared/utils/stateLabel.ts";

interface Props {
    data: Constant[];
    onEdit: (item: Constant) => void;
    onDelete: (item: Constant) => void;
}

export function ConstantsTable({data, onEdit, onDelete}: Readonly<Props>) {
    return (
        <div className="h-full overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead>Llave maestra</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="w-24"/>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No constants
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map(item => {
                            const status = getStatusConfig(item.consEstado);
                            return (
                                <TableRow key={item.consId}>
                                    <TableCell className="font-medium">{item.consLlave}</TableCell>
                                    <TableCell>{item.consValor}</TableCell>
                                    <TableCell className="max-w-62.5">
                                        <span className="block truncate">{item.consDescripcion ?? "—"}</span>
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
