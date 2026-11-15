import {useState} from "react";
import type {Item, ItemFormData} from "@/feature/menu/service/ItemService.ts";
import type {Category} from "@/feature/masters/types/Category.ts";
import type {Label as Etiqueta} from "@/feature/masters/types/Label.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Checkbox} from "@/shared/shadcn/components/ui/checkbox.tsx";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/shared/shadcn/components/ui/select.tsx";

interface Props {
    initialData?: Item | null;
    categorias: Category[];
    etiquetas: Etiqueta[];
    onSubmit: (data: ItemFormData) => Promise<void>;
    onCancel: () => void;
}

interface Form {
    meitNombre: string;
    meitDescripcion: string;
    meitPrecio: string;
    meitImagenUrl: string;
    mecaId: string;
    etiqIds: number[];
}

export function ItemForm({initialData, categorias, etiquetas, onSubmit, onCancel}: Readonly<Props>) {
    const [form, setForm] = useState<Form>({
        meitNombre: initialData?.meitNombre ?? "",
        meitDescripcion: initialData?.meitDescripcion ?? "",
        meitPrecio: initialData ? String(initialData.meitPrecio) : "",
        meitImagenUrl: initialData?.meitImagenUrl ?? "",
        mecaId: initialData ? String(initialData.mecaId) : "",
        etiqIds: initialData?.etiquetas.map(e => e.etiqId) ?? [],
    });
    const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // un ítem va en una subcategoría (Platos / Entradas); el nombre del padre ayuda a distinguirlas
    const nombrePorId = new Map(categorias.map(c => [c.mecaId, c.mecaNombre]));
    const subcategorias = categorias
        .filter(c => c.mecaParentId != null)
        .map(c => ({value: String(c.mecaId), label: `${nombrePorId.get(c.mecaParentId!) ?? ""} / ${c.mecaNombre}`}))
        .sort((a, b) => a.label.localeCompare(b.label));

    const set = <K extends keyof Form>(field: K, value: Form[K]) => {
        setForm(prev => ({...prev, [field]: value}));
        setErrors(prev => ({...prev, [field]: undefined}));
    };

    const alternarEtiqueta = (etiqId: number, marcada: boolean) =>
        set("etiqIds", marcada ? [...form.etiqIds, etiqId] : form.etiqIds.filter(id => id !== etiqId));

    const validate = (): boolean => {
        const e: typeof errors = {};
        const precio = Number(form.meitPrecio);

        if (!form.meitNombre.trim()) e.meitNombre = "Requerido";
        if (form.meitNombre.trim().length > 100) e.meitNombre = "Máximo 100 caracteres";
        if (!form.meitPrecio.trim() || !(precio > 0)) e.meitPrecio = "Debe ser mayor a 0";
        if (!form.mecaId) e.mecaId = "Requerido";
        if (form.meitImagenUrl.trim().length > 500) e.meitImagenUrl = "Máximo 500 caracteres";

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
                meitNombre: form.meitNombre.trim(),
                meitDescripcion: form.meitDescripcion.trim() || null,
                meitPrecio: Number(form.meitPrecio),
                meitImagenUrl: form.meitImagenUrl.trim() || null,
                mecaId: Number(form.mecaId),
                etiqIds: form.etiqIds,
            });
        } catch (error: unknown) {
            // el API valida lo mismo y además que la categoría siga activa
            setSubmitError(error instanceof Error ? error.message : "No se pudo guardar");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
                <Label htmlFor="meit_nombre">Nombre *</Label>
                <Input id="meit_nombre" value={form.meitNombre}
                       onChange={e => set("meitNombre", e.target.value)}
                       aria-invalid={!!errors.meitNombre}/>
                {errors.meitNombre && <p className="text-xs text-red-500">{errors.meitNombre}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="meit_precio">Precio *</Label>
                    <Input id="meit_precio" type="number" min="0" step="any" value={form.meitPrecio}
                           onChange={e => set("meitPrecio", e.target.value)}
                           aria-invalid={!!errors.meitPrecio}/>
                    {errors.meitPrecio && <p className="text-xs text-red-500">{errors.meitPrecio}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label>Categoría *</Label>
                    <Select items={subcategorias} value={form.mecaId || null}
                            onValueChange={value => set("mecaId", (value as string) ?? "")}>
                        <SelectTrigger className="w-full" aria-invalid={!!errors.mecaId}>
                            <SelectValue placeholder="Seleccionar"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {subcategorias.map(sub => (
                                    <SelectItem key={sub.value} value={sub.value}>{sub.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.mecaId && <p className="text-xs text-red-500">{errors.mecaId}</p>}
                </div>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meit_descripcion">Descripción</Label>
                <Input id="meit_descripcion" value={form.meitDescripcion}
                       onChange={e => set("meitDescripcion", e.target.value)}/>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="meit_imagen_url">URL de imagen</Label>
                <Input id="meit_imagen_url" value={form.meitImagenUrl}
                       onChange={e => set("meitImagenUrl", e.target.value)}
                       aria-invalid={!!errors.meitImagenUrl}/>
                {errors.meitImagenUrl && <p className="text-xs text-red-500">{errors.meitImagenUrl}</p>}
            </div>

            <div className="grid gap-1.5">
                <Label>Etiquetas</Label>
                <div className="grid grid-cols-2 gap-2">
                    {etiquetas.map(etiqueta => (
                        <label key={etiqueta.etiqId} className="flex items-center gap-2 text-sm">
                            <Checkbox checked={form.etiqIds.includes(etiqueta.etiqId)}
                                      onCheckedChange={checked => alternarEtiqueta(etiqueta.etiqId, !!checked)}/>
                            {etiqueta.etiqNombre}
                        </label>
                    ))}
                </div>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

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
