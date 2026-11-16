import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/shared/shadcn/components/ui/dialog.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/shared/shadcn/components/ui/select.tsx";
import {dinero, METODOS_PAGO, type PagoFormData} from "@/feature/factura/service/FacturaService.ts";

interface Props {
    open: boolean;
    total: number;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: PagoFormData) => Promise<void>;
}

export function PagoDialog({open, total, onOpenChange, onSubmit}: Readonly<Props>) {
    const [metodo, setMetodo] = useState("EFECTIVO");
    const [observacion, setObservacion] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (observacion.trim().length > 255) {
            setError("La observación tiene máximo 255 caracteres");
            return;
        }
        setSubmitting(true);
        setError(null);
        try {
            await onSubmit({pagoMetodo: metodo, pagoObservacion: observacion.trim() || null});
            setObservacion("");
        } catch (e: unknown) {
            // p. ej. un pedido que pasó a "en preparación" mientras se cobraba
            setError(e instanceof Error ? e.message : "No se pudo registrar el pago");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar pago de {dinero(total)}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-1.5">
                        <Label>Método de pago *</Label>
                        <Select items={METODOS_PAGO} value={metodo}
                                onValueChange={value => setMetodo((value as string) ?? "EFECTIVO")}>
                            <SelectTrigger className="w-full">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {METODOS_PAGO.map(m => (
                                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="pago_observacion">Observación</Label>
                        <Input id="pago_observacion" value={observacion}
                               onChange={e => setObservacion(e.target.value)}/>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}
                                disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting ? "Registrando..." : "Registrar pago"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
