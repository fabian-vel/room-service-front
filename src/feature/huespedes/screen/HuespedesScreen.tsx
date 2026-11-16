import {useEffect, useState} from "react";
import {DoorClosed, KeyRound, Pencil, Plus, Search} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/shared/shadcn/components/ui/dialog.tsx";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {CatalogPaginator} from "@/feature/masters/catalogs/components/CatalogPaginator.tsx";
import {
    type Acceso, type AccesoFormData, type CodigoAcceso, finalizarAcceso, getAccesos, registrarAcceso,
    renovarCodigo, updateAcceso
} from "@/feature/huespedes/service/AccesoService.ts";
import {AccesosTable} from "@/feature/huespedes/components/AccesosTable.tsx";
import {AccesoForm} from "@/feature/huespedes/components/AccesoForm.tsx";
import {type Accion, ConfirmarAccion} from "@/feature/huespedes/components/ConfirmarAccion.tsx";

// recepción: registro de huéspedes, fechas de la estadía y código de acceso a la app
export function HuespedesScreen() {
    const [accesos, setAccesos] = useState<Acceso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const [habitacion, setHabitacion] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Acceso | null>(null);
    const [selectedItem, setSelectedItem] = useState<Acceso | null>(null);
    const [accion, setAccion] = useState<Accion | null>(null);
    // código recién generado: se muestra para entregárselo al huésped
    const [codigo, setCodigo] = useState<(CodigoAcceso & { habitacion: string }) | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        getAccesos("", controller.signal)
            .then(setAccesos)
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') setError(e.message);
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    const recargar = async () => {
        try {
            setAccesos(await getAccesos(habitacion.trim()));
            setSelectedItem(null);
        } catch (e: unknown) {
            setAviso(e instanceof Error ? e.message : "No se pudo cargar");
        }
    };

    // los errores del API los muestra el formulario
    const handleSubmit = async (formData: AccesoFormData) => {
        if (editingItem) {
            await updateAcceso(editingItem.haacId, formData);
        } else {
            const nuevo = await registrarAcceso(formData);
            setCodigo({...nuevo, habitacion: formData.haacHabitacion!});
        }
        setFormOpen(false);
        setEditingItem(null);
        await recargar();
    };

    const ejecutar = (fn: () => Promise<void>) => async () => {
        setAviso(null);
        try {
            await fn();
            await recargar();
        } catch (e: unknown) {
            setAviso(e instanceof Error ? e.message : "No se pudo completar la acción");
        } finally {
            setAccion(null);
        }
    };

    const pedirNuevoCodigo = (acceso: Acceso) => setAccion({
        titulo: `¿Nuevo código para la habitación ${acceso.haacHabitacion}?`,
        descripcion: "El código actual deja de servir para entrar a la app. Quien ya inició sesión sigue dentro hasta el fin de la estadía.",
        confirmar: "Generar código",
        ejecutar: ejecutar(async () => {
            const nuevo = await renovarCodigo(acceso.haacId);
            setCodigo({...nuevo, habitacion: acceso.haacHabitacion});
        }),
    });

    const pedirFinalizar = (acceso: Acceso) => setAccion({
        titulo: `¿Finalizar el acceso de la habitación ${acceso.haacHabitacion}?`,
        descripcion: "Check-out: el huésped ya no podrá entrar ni hacer pedidos. Sus pedidos siguen disponibles en Factura.",
        confirmar: "Finalizar",
        ejecutar: ejecutar(() => finalizarAcceso(acceso.haacId)),
    });

    const openForm = (item: Acceso | null) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const {paginatedData, currentPage, totalPages, goToPage} = usePagination(accesos);
    const activo = selectedItem?.haacEstado === "A";

    if (loading)
        return <div className="flex h-full items-center justify-center">Cargando...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <form className="relative" onSubmit={e => {
                    e.preventDefault();
                    goToPage(1);
                    void recargar();
                }}>
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Habitación (Enter) · vacío: vigentes"
                        value={habitacion}
                        onChange={e => setHabitacion(e.target.value)}
                        className="w-72 pl-8"
                    />
                </form>
                <div className="ml-auto flex gap-2">
                    <Button onClick={() => openForm(null)} className="gap-2">
                        <Plus className="size-4"/>
                        Registrar huésped
                    </Button>
                    <Button className="gap-2 bg-green-800" hidden={!activo}
                            onClick={() => selectedItem && openForm(selectedItem)}>
                        <Pencil className="size-4"/>
                        Editar
                    </Button>
                    <Button className="gap-2" variant="outline" hidden={!activo}
                            onClick={() => selectedItem && pedirNuevoCodigo(selectedItem)}>
                        <KeyRound className="size-4"/>
                        Nuevo código
                    </Button>
                    <Button className="gap-2 bg-red-500" hidden={!activo}
                            onClick={() => selectedItem && pedirFinalizar(selectedItem)}>
                        <DoorClosed className="size-4"/>
                        Finalizar
                    </Button>
                </div>
            </div>

            {aviso && <p className="text-sm text-red-600">{aviso}</p>}

            <div className="min-h-0 flex-1">
                <AccesosTable data={paginatedData} selectedItem={selectedItem} onSelectionChange={setSelectedItem}/>
            </div>

            <CatalogPaginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}/>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingItem ? "Editar acceso" : "Registrar huésped"}</DialogTitle>
                    </DialogHeader>
                    <AccesoForm
                        key={editingItem?.haacId ?? "nuevo"}
                        initialData={editingItem}
                        onSubmit={handleSubmit}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={!!codigo} onOpenChange={open => !open && setCodigo(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Código de acceso · habitación {codigo?.habitacion}</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-center font-mono text-4xl font-bold tracking-[0.3em]">{codigo?.haacCodigo}</p>
                    <p className="text-center text-sm text-muted-foreground">
                        Entrégueselo al huésped: con la habitación y este código entra a la app.
                    </p>
                </DialogContent>
            </Dialog>

            <ConfirmarAccion accion={accion} onClose={() => setAccion(null)}/>
        </div>
    );
}
