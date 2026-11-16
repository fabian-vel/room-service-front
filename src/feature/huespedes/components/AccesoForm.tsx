import {useState} from "react";
import type {Acceso, AccesoFormData} from "@/feature/huespedes/service/AccesoService.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface Props {
    initialData?: Acceso | null;
    onSubmit: (data: AccesoFormData) => Promise<void>;
    onCancel: () => void;
}

type Form = Required<Omit<AccesoFormData, "haacClienteDoc">> & { haacClienteDoc: string };

// datetime-local trabaja en hora local sin zona: "YYYY-MM-DDTHH:mm"
const aInput = (fecha: Date) => {
    const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 16);
};

// por defecto: desde ahora hasta mañana a mediodía (hora habitual de check-out)
const finPorDefecto = () => {
    const fin = new Date();
    fin.setDate(fin.getDate() + 1);
    fin.setHours(12, 0, 0, 0);
    return fin;
};

export function AccesoForm({initialData, onSubmit, onCancel}: Readonly<Props>) {
    const editando = !!initialData;
    const [form, setForm] = useState<Form>({
        haacHabitacion: initialData?.haacHabitacion ?? "",
        haacClienteNombre: initialData?.haacClienteNombre ?? "",
        haacClienteDoc: initialData?.haacClienteDoc ?? "",
        haacFechaInicio: aInput(initialData ? new Date(initialData.haacFechaInicio) : new Date()),
        haacFechaFin: aInput(initialData ? new Date(initialData.haacFechaFin) : finPorDefecto()),
    });
    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const set = <K extends keyof Form>(field: K, value: Form[K]) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};
        if (!editando) {
            if (!form.haacHabitacion.trim()) e.haacHabitacion = "Requerido";
            else if (form.haacHabitacion.trim().length > 10) e.haacHabitacion = "Máximo 10 caracteres";
        }
        if (!form.haacClienteNombre.trim()) e.haacClienteNombre = "Requerido";
        else if (form.haacClienteNombre.trim().length > 100) e.haacClienteNombre = "Máximo 100 caracteres";
        if (form.haacClienteDoc.trim().length > 20) e.haacClienteDoc = "Máximo 20 caracteres";
        if (!form.haacFechaInicio) e.haacFechaInicio = "Requerido";
        if (!form.haacFechaFin) e.haacFechaFin = "Requerido";
        else if (form.haacFechaInicio && new Date(form.haacFechaFin) <= new Date(form.haacFechaInicio))
            e.haacFechaFin = "Debe ser posterior al inicio";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit({
                haacHabitacion: editando ? undefined : form.haacHabitacion.trim(),
                haacClienteNombre: form.haacClienteNombre.trim(),
                haacClienteDoc: form.haacClienteDoc.trim() || null,
                // con zona horaria, para que el API guarde la hora que eligió recepción
                haacFechaInicio: new Date(form.haacFechaInicio).toISOString(),
                haacFechaFin: new Date(form.haacFechaFin).toISOString(),
            });
        } catch (error: unknown) {
            // p. ej. la habitación ya tiene un acceso en esas fechas
            setSubmitError(error instanceof Error ? error.message : "No se pudo guardar");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="haac_habitacion">Habitación *</Label>
                    <Input id="haac_habitacion" value={form.haacHabitacion} disabled={editando}
                           onChange={e => set("haacHabitacion", e.target.value)}
                           aria-invalid={!!errors.haacHabitacion}/>
                    {errors.haacHabitacion && <p className="text-xs text-red-500">{errors.haacHabitacion}</p>}
                </div>
                <div className="col-span-2 grid gap-1.5">
                    <Label htmlFor="haac_documento">Documento</Label>
                    <Input id="haac_documento" value={form.haacClienteDoc}
                           onChange={e => set("haacClienteDoc", e.target.value)}
                           aria-invalid={!!errors.haacClienteDoc}/>
                    {errors.haacClienteDoc && <p className="text-xs text-red-500">{errors.haacClienteDoc}</p>}
                </div>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="haac_nombre">Nombre del huésped *</Label>
                <Input id="haac_nombre" value={form.haacClienteNombre}
                       onChange={e => set("haacClienteNombre", e.target.value)}
                       aria-invalid={!!errors.haacClienteNombre}/>
                {errors.haacClienteNombre && <p className="text-xs text-red-500">{errors.haacClienteNombre}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="haac_inicio">Inicio *</Label>
                    <Input id="haac_inicio" type="datetime-local" value={form.haacFechaInicio}
                           onChange={e => set("haacFechaInicio", e.target.value)}
                           aria-invalid={!!errors.haacFechaInicio}/>
                    {errors.haacFechaInicio && <p className="text-xs text-red-500">{errors.haacFechaInicio}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="haac_fin">Fin (check-out) *</Label>
                    <Input id="haac_fin" type="datetime-local" value={form.haacFechaFin}
                           onChange={e => set("haacFechaFin", e.target.value)}
                           aria-invalid={!!errors.haacFechaFin}/>
                    {errors.haacFechaFin && <p className="text-xs text-red-500">{errors.haacFechaFin}</p>}
                </div>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : editando ? "Actualizar" : "Registrar"}
                </Button>
            </div>
        </form>
    );
}
