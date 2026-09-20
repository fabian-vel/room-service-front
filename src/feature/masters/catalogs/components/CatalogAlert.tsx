import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/shared/shadcn/components/ui/alert-dialog.tsx";
import React from "react";

interface Props<T> {
    deleteTarget: T | null;
    setDeleteTarget: (value: React.SetStateAction<T | null>) => void;

    handleDelete(): Promise<void>;

    catalogName: string;
}

export function CatalogAlert<T>({deleteTarget, setDeleteTarget, handleDelete, catalogName}: Readonly<Props<T>>) {
    return (
        <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{`Eliminar ${catalogName} ?`}</AlertDialogTitle>
                    <AlertDialogDescription>
                        El registro se desactivará. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
