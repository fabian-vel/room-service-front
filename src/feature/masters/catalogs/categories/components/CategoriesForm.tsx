import {useState} from "react";
import type {Category, CategoryFormData} from "@/feature/masters/types/Category.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface Props {
    initialData?: Category | null;
    onSubmit: (data: CategoryFormData) => Promise<void>;
    onCancel: () => void;
}

export function CategoriesForm({initialData, onSubmit, onCancel}: Readonly<Props>) {
    const [form, setForm] = useState<CategoryFormData>({
        mecaLlaveMst: initialData?.mecaLlaveMst ?? "",
        mecaNombre: initialData?.mecaNombre ?? "",
        mecaDescripcion: initialData?.mecaDescripcion ?? "",
        mecaImagenUrl: initialData?.mecaImagenUrl ?? "",
        mecaParentId: initialData?.mecaParentId ?? undefined,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof CategoryFormData, value: string | number | undefined) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};

        if (!form.mecaLlaveMst.trim()) e.mecaLlaveMst = "Requerido";
        if (form.mecaLlaveMst.length > 50) e.mecaLlaveMst = "Máximo 50 caracteres";
        if (!form.mecaNombre.trim()) e.mecaNombre = "Requerido";
        if (form.mecaNombre.length > 100) e.mecaNombre = "Máximo 100 caracteres";
        if (form.mecaDescripcion && form.mecaDescripcion.length > 255) e.mecaDescripcion = "Máximo 255 caracteres";
        if (form.mecaImagenUrl && form.mecaImagenUrl.length > 500) e.mecaImagenUrl = "Máximo 500 caracteres";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                mecaLlaveMst: form.mecaLlaveMst.trim(),
                mecaNombre: form.mecaNombre.trim(),
                mecaDescripcion: form.mecaDescripcion?.trim() || undefined,
                mecaImagenUrl: form.mecaImagenUrl?.trim() || undefined,
                mecaParentId: form.mecaParentId || undefined,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="meca_llave_mst">Llave *</Label>
                <Input
                    id="meca_llave_mst"
                    value={form.mecaLlaveMst}
                    onChange={e => set("mecaLlaveMst", e.target.value)}
                    disabled={!!initialData}
                    aria-invalid={!!errors.mecaLlaveMst}
                />
                {errors.mecaLlaveMst && <p className="text-xs text-red-500">{errors.mecaLlaveMst}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meca_nombre">Nombre *</Label>
                <Input
                    id="meca_nombre"
                    value={form.mecaNombre}
                    onChange={e => set("mecaNombre", e.target.value)}
                    aria-invalid={!!errors.mecaNombre}
                />
                {errors.mecaNombre && <p className="text-xs text-red-500">{errors.mecaNombre}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meca_descripcion">Descripción</Label>
                <Input
                    id="meca_descripcion"
                    value={form.mecaDescripcion ?? ""}
                    onChange={e => set("mecaDescripcion", e.target.value || undefined)}
                />
                {errors.mecaDescripcion && <p className="text-xs text-red-500">{errors.mecaDescripcion}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meca_imagen_url">URL de imagen</Label>
                <Input
                    id="meca_imagen_url"
                    value={form.mecaImagenUrl ?? ""}
                    onChange={e => set("mecaImagenUrl", e.target.value || undefined)}
                />
                {errors.mecaImagenUrl && <p className="text-xs text-red-500">{errors.mecaImagenUrl}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meca_parent_id">ID de categoría padre</Label>
                <Input
                    id="meca_parent_id"
                    type="number"
                    value={form.mecaParentId ?? ""}
                    onChange={e => set("mecaParentId", e.target.value ? Number(e.target.value) : undefined)}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
                </Button>
            </div>
        </form>
    );
}
