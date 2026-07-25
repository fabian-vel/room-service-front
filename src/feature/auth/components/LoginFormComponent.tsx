import {useState} from "react";
import {Field, FieldGroup, FieldLabel, FieldSet, FieldDescription} from "@/shared/shadcn/components/ui/field.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";

interface LoginFormComponentProps {
    onSubmit: (usuario: string, password: string) => void;
    isLoading?: boolean;
}

export function LoginFormComponent({onSubmit, isLoading}: Readonly<LoginFormComponentProps>) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');

    return (
        <FieldSet className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-sm">
            <FieldDescription className="text-center text-stone-500 mb-6 text-sm">
                Introduce tus credenciales para acceder al sistema.
            </FieldDescription>
            <FieldGroup>
                <Field>
                    <FieldLabel>Usuario</FieldLabel>
                    <Input
                        type="text"
                        placeholder="Ej: cocina1"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel>Contraseña</FieldLabel>
                    <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Field>
                <Button
                    type="submit"
                    className="w-full mt-6"
                    disabled={isLoading}
                    onClick={() => onSubmit(usuario, password)}
                >
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </FieldGroup>
        </FieldSet>
    );
}
