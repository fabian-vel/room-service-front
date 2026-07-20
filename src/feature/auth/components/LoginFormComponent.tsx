import {Field, FieldDescription, FieldGroup, FieldLabel, FieldSet} from "@/shared/shadcn/components/ui/field.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface LoginFormComponentProps {
    onSubmit: () => void;
}

export function LoginFormComponent({onSubmit}: Readonly<LoginFormComponentProps>) {
    return (
        <FieldSet  className="w-full max-w-sm p-6 bg-base-200 rounded-2xl shadow-sm">
            <FieldDescription className="text-center text-base-content/60 mb-6 text-sm">
                Introduce el número de habitación y el código de acceso proporcionado en recepción.
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel  className="fieldset-legend">Número de Habitación</FieldLabel >
                    <Input
                        type="text"
                        placeholder="Ej: 302"
                        className="input w-full"
                    />
                </Field>
                <Field>
                    <FieldLabel  className="fieldset-legend">Código de Acceso</FieldLabel >
                    <Input
                        type="text"
                        placeholder="Ej: A7X9"
                        className="input w-full"
                    />
                </Field>
                <Button
                    type="submit"
                    className="btn btn-primary w-full mt-6"
                    onClick={onSubmit}
                >
                    Ingresar a la Habitación
                </Button>
                </FieldGroup>
        </FieldSet>
    );
}
