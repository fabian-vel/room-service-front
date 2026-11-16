import {useState} from "react";
import {type Empleado, type EmpleadoFormData, ROLES} from "@/feature/empleados/service/EmpleadoService.ts";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Label} from "@/shared/shadcn/components/ui/label.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/shared/shadcn/components/ui/select.tsx";

interface Props {
    initialData?: Empleado | null;
    onSubmit: (data: EmpleadoFormData) => Promise<void>;
    onCancel: () => void;
}

type Form = Omit<EmpleadoFormData, "emplPassword"> & { emplPassword: string; confirmar: string };

const USUARIO = /^[A-Za-z0-9._-]+$/;

export function EmpleadoForm({initialData, onSubmit, onCancel}: Readonly<Props>) {
    const editando = !!initialData;
    const [form, setForm] = useState<Form>({
        emplUsuario: initialData?.emplUsuario ?? "",
        emplNombre: initialData?.emplNombre ?? "",
        emplRol: initialData?.emplRol ?? "",
        emplPassword: "",
        confirmar: "",
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
        const usuario = form.emplUsuario.trim();

        if (!editando) {
            if (!usuario) e.emplUsuario = "Requerido";
            else if (usuario.length > 50) e.emplUsuario = "Máximo 50 caracteres";
            else if (!USUARIO.test(usuario)) e.emplUsuario = "Solo letras, números, punto, guion y guion bajo";
        }
        if (!form.emplNombre.trim()) e.emplNombre = "Requerido";
        if (form.emplNombre.trim().length > 100) e.emplNombre = "Máximo 100 caracteres";
        if (!form.emplRol) e.emplRol = "Requerido";
        // al editar, la contraseña vacía conserva la actual
        if (!editando || form.emplPassword) {
            if (form.emplPassword.length < 8 || form.emplPassword.length > 72)
                e.emplPassword = "Entre 8 y 72 caracteres";
            else if (form.emplPassword !== form.confirmar) e.confirmar = "No coincide";
        }

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
                emplUsuario: form.emplUsuario.trim(),
                emplNombre: form.emplNombre.trim(),
                emplRol: form.emplRol,
                emplPassword: form.emplPassword || null,
            });
        } catch (error: unknown) {
            // el API también rechaza el usuario repetido y quitarse a sí mismo el rol ADMIN
            setSubmitError(error instanceof Error ? error.message : "No se pudo guardar");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="empl_usuario">Usuario *</Label>
                    <Input id="empl_usuario" value={form.emplUsuario} disabled={editando}
                           autoComplete="off"
                           onChange={e => set("emplUsuario", e.target.value)}
                           aria-invalid={!!errors.emplUsuario}/>
                    {errors.emplUsuario && <p className="text-xs text-red-500">{errors.emplUsuario}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label>Rol *</Label>
                    <Select items={ROLES} value={form.emplRol || null}
                            onValueChange={value => set("emplRol", (value as string) ?? "")}>
                        <SelectTrigger className="w-full" aria-invalid={!!errors.emplRol}>
                            <SelectValue placeholder="Seleccionar"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {ROLES.map(rol => (
                                    <SelectItem key={rol.value} value={rol.value}>{rol.label}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.emplRol && <p className="text-xs text-red-500">{errors.emplRol}</p>}
                </div>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="empl_nombre">Nombre *</Label>
                <Input id="empl_nombre" value={form.emplNombre}
                       onChange={e => set("emplNombre", e.target.value)}
                       aria-invalid={!!errors.emplNombre}/>
                {errors.emplNombre && <p className="text-xs text-red-500">{errors.emplNombre}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="empl_password">{editando ? "Nueva contraseña" : "Contraseña *"}</Label>
                    <Input id="empl_password" type="password" value={form.emplPassword}
                           autoComplete="new-password"
                           placeholder={editando ? "Dejar vacía para no cambiarla" : ""}
                           onChange={e => set("emplPassword", e.target.value)}
                           aria-invalid={!!errors.emplPassword}/>
                    {errors.emplPassword && <p className="text-xs text-red-500">{errors.emplPassword}</p>}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="empl_confirmar">Confirmar contraseña</Label>
                    <Input id="empl_confirmar" type="password" value={form.confirmar}
                           autoComplete="new-password"
                           onChange={e => set("confirmar", e.target.value)}
                           aria-invalid={!!errors.confirmar}/>
                    {errors.confirmar && <p className="text-xs text-red-500">{errors.confirmar}</p>}
                </div>
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? "Guardando..." : editando ? "Actualizar" : "Crear"}
                </Button>
            </div>
        </form>
    );
}
