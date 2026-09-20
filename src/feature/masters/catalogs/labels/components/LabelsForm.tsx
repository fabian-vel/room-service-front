import {useState} from "react";
import type {Label, LabelFormData} from "@/feature/masters/types/Label.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label as UILabel} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface Props {
    initialData?: Label | null;
    onSubmit: (data: LabelFormData) => Promise<void>;
    onCancel: () => void;
}

export function LabelsForm({initialData, onSubmit, onCancel}: Readonly<Props>) {
    const [form, setForm] = useState<LabelFormData>({
        etiqLlaveMst: initialData?.etiqLlaveMst ?? "",
        etiqNombre: initialData?.etiqNombre ?? "",
        etiqDescripcion: initialData?.etiqDescripcion ?? "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LabelFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof LabelFormData, value: string | undefined) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};

        if (!form.etiqLlaveMst.trim()) e.etiqLlaveMst = "Requerido";
        if (form.etiqLlaveMst.length > 50) e.etiqLlaveMst = "Máximo 50 caracteres";
        if (!form.etiqNombre.trim()) e.etiqNombre = "Requerido";
        if (form.etiqNombre.length > 100) e.etiqNombre = "Máximo 100 caracteres";
        if (form.etiqDescripcion && form.etiqDescripcion.length > 255) e.etiqDescripcion = "Máximo 255 caracteres";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                etiqLlaveMst: form.etiqLlaveMst.trim(),
                etiqNombre: form.etiqNombre.trim(),
                etiqDescripcion: form.etiqDescripcion?.trim() || undefined,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
                <UILabel htmlFor="etic_llave_mst">Key *</UILabel>
                <Input
                    id="etic_llave_mst"
                    value={form.etiqLlaveMst}
                    onChange={e => set("etiqLlaveMst", e.target.value)}
                    disabled={!!initialData}
                    aria-invalid={!!errors.etiqLlaveMst}
                />
                {errors.etiqLlaveMst && <p className="text-xs text-red-500">{errors.etiqLlaveMst}</p>}
            </div>

            <div className="grid gap-1.5">
                <UILabel htmlFor="etiq_nombre">Name *</UILabel>
                <Input
                    id="etiq_nombre"
                    value={form.etiqNombre}
                    onChange={e => set("etiqNombre", e.target.value)}
                    aria-invalid={!!errors.etiqNombre}
                />
                {errors.etiqNombre && <p className="text-xs text-red-500">{errors.etiqNombre}</p>}
            </div>

            <div className="grid gap-1.5">
                <UILabel htmlFor="etiq_descripcion">Description</UILabel>
                <Input
                    id="etiq_descripcion"
                    value={form.etiqDescripcion ?? ""}
                    onChange={e => set("etiqDescripcion", e.target.value || undefined)}
                />
                {errors.etiqDescripcion && <p className="text-xs text-red-500">{errors.etiqDescripcion}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : initialData ? "Actualizar" : "Crear"}
                </Button>
            </div>
        </form>
    );
}
