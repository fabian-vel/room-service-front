import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/shared/shadcn/components/ui/alert-dialog.tsx";

export interface Accion {
    titulo: string;
    descripcion: string;
    confirmar: string;
    ejecutar: () => Promise<void>;
}

interface Props {
    accion: Accion | null;
    onClose: () => void;
}

// confirmación para renovar el código o finalizar el acceso
export function ConfirmarAccion({accion, onClose}: Readonly<Props>) {
    return (
        <AlertDialog open={!!accion} onOpenChange={open => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{accion?.titulo}</AlertDialogTitle>
                    <AlertDialogDescription>{accion?.descripcion}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => accion?.ejecutar()}>
                        {accion?.confirmar}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
