import type {Constant} from "@/feature/masters/types/Constant.ts";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/shared/shadcn/components/ui/table.tsx";
import {getStatusConfig} from "@/shared/utils/stateLabel.ts";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";

interface Props {
    data: Constant[];
    selectedItem: Constant | null;
    onSelectionChange: (item: Constant | null) => void;
}

export function ConstantsTable({data, selectedItem, onSelectionChange}: Readonly<Props>) {
    return (
        <div className="overflow-y-auto rounded-xl border bg-white">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                        <TableHead />
                        <TableHead className="font-bold">Llave maestra</TableHead>
                        <TableHead className="font-bold">Valor</TableHead>
                        <TableHead className="font-bold">Descripción</TableHead>
                        <TableHead className="font-bold">Estado</TableHead>
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
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItem?.consId === item.consId}
                                            onCheckedChange={(checked) => {
                                                onSelectionChange(checked ? item : null);
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{item.consLlave}</TableCell>
                                    <TableCell>{item.consValor}</TableCell>
                                    <TableCell className="max-w-62.5">
                                        <span className="block truncate">{item.consDescripcion ?? "—"}</span>
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
