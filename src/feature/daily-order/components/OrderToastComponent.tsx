import {useEffect, useState} from "react";
import {BellRing, CircleX, X} from "lucide-react";
import {cn} from "@/shared/shadcn/lib/utils.ts";

export interface OrderToast {
    id: number;
    tipo: "nuevo" | "cancelado";
    pediId: number;
    habitacion?: string;
    productos?: number;
}

const DURACION_MS = 6000;
const SALIDA_MS = 300;

function Toast({toast, onClose}: Readonly<{ toast: OrderToast; onClose: (id: number) => void }>) {
    const [saliendo, setSaliendo] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setSaliendo(true), DURACION_MS);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!saliendo) return;
        const timer = setTimeout(() => onClose(toast.id), SALIDA_MS);
        return () => clearTimeout(timer);
    }, [saliendo, toast.id, onClose]);

    const nuevo = toast.tipo === "nuevo";
    const habitacion = toast.habitacion ? `Habitación ${toast.habitacion}` : `Pedido #${toast.pediId}`;
    const productos = toast.productos === undefined
        ? ""
        : ` · ${toast.productos} ${toast.productos === 1 ? "producto" : "productos"}`;

    return (
        <div
            role="status"
            className={cn(
                "pointer-events-auto flex w-80 items-start gap-3 rounded-xl border border-l-4 bg-white p-4 shadow-lg",
                "animate-in fade-in slide-in-from-right-8 transition-opacity duration-300",
                nuevo ? "border-l-green-700" : "border-l-red-600",
                saliendo && "opacity-0",
            )}
        >
            {nuevo
                ? <BellRing className="mt-0.5 size-5 shrink-0 text-green-700"/>
                : <CircleX className="mt-0.5 size-5 shrink-0 text-red-600"/>}
            <div className="flex-1">
                <p className={cn("font-semibold", nuevo ? "text-green-700" : "text-red-600")}>
                    {nuevo ? "Pedido nuevo" : "Pedido cancelado"}
                </p>
                <p className="text-sm text-muted-foreground">{habitacion}{productos}</p>
            </div>
            <button
                type="button"
                aria-label="Cerrar"
                onClick={() => setSaliendo(true)}
                className="text-muted-foreground hover:text-foreground"
            >
                <X className="size-4"/>
            </button>
        </div>
    );
}

export function OrderToastComponent({toasts, onClose}: Readonly<{
    toasts: OrderToast[];
    onClose: (id: number) => void
}>) {
    return (
        <div className="pointer-events-none fixed top-20 right-6 z-50 flex flex-col gap-3">
            {toasts.map(t => <Toast key={t.id} toast={t} onClose={onClose}/>)}
        </div>
    );
}
