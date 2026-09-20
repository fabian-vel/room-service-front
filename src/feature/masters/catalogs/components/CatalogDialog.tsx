import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/shared/shadcn/components/ui/dialog.tsx";
import React from "react";

interface Props<T> {
    formOpen: boolean;
    editingItem: T | null;
    setFormOpen: (value: React.SetStateAction<boolean>) => void;
    children: React.ReactNode;
    catalogName: string;
}

export function CatalogDialog<T>({
                                     formOpen,
                                     setFormOpen,
                                     editingItem,
                                     children,
                                     catalogName,
                                 }: Readonly<Props<T>>) {
    return (
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {editingItem ? "Editar" : "Crear"} {catalogName}
                    </DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
