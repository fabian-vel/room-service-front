import {useState} from "react";
import type {Constant, ConstantFormData} from "@/feature/masters/types/Constant.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface Props {
    initialData?: Constant | null;
    onSubmit: (data: ConstantFormData) => Promise<void>;
    onCancel: () => void;
}

export function ConstantsForm({initialData, onSubmit, onCancel}: Readonly<Props>) {
    const [form, setForm] = useState<ConstantFormData>({
        consLlave: initialData?.consLlave ?? "",
        consValor: initialData?.consValor ?? "",
        consDescripcion: initialData?.consDescripcion ?? "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ConstantFormData, string>>>({});
    const [submitting, setSubmitting] = useState(false);

    const set = (field: keyof ConstantFormData, value: string | undefined) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const validate = (): boolean => {
        const e: typeof errors = {};

        if (!form.consLlave.trim()) e.consLlave = "Required";
        if (form.consLlave.length > 100) e.consLlave = "Maximum 100 characters";
        if (!form.consValor.trim()) e.consValor = "Required";
        if (form.consValor.length > 100) e.consValor = "Maximum 100 characters";
        if (form.consDescripcion && form.consDescripcion.length > 255) e.consDescripcion = "Maximum 255 characters";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                consLlave: form.consLlave.trim(),
                consValor: form.consValor.trim(),
                consDescripcion: form.consDescripcion?.trim() || undefined,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="cons_llave">Key *</Label>
                <Input
                    id="cons_llave"
                    value={form.consLlave}
                    onChange={e => set("consLlave", e.target.value)}
                    disabled={!!initialData}
                    aria-invalid={!!errors.consLlave}
                />
                {errors.consLlave && <p className="text-xs text-red-500">{errors.consLlave}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="cons_valor">Value *</Label>
                <Input
                    id="cons_valor"
                    value={form.consValor}
                    onChange={e => set("consValor", e.target.value)}
                    aria-invalid={!!errors.consValor}
                />
                {errors.consValor && <p className="text-xs text-red-500">{errors.consValor}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="cons_descripcion">Description</Label>
                <Input
                    id="cons_descripcion"
                    value={form.consDescripcion ?? ""}
                    onChange={e => set("consDescripcion", e.target.value || undefined)}
                />
                {errors.consDescripcion && <p className="text-xs text-red-500">{errors.consDescripcion}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : initialData ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    );
}
