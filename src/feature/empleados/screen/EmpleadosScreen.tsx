import {useEffect, useState} from "react";
import {Pencil, Plus, Search, Trash2} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {CatalogPaginator} from "@/feature/masters/catalogs/components/CatalogPaginator.tsx";
import {CatalogAlert} from "@/feature/masters/catalogs/components/CatalogAlert.tsx";
import {CatalogDialog} from "@/feature/masters/catalogs/components/CatalogDialog.tsx";
import {
    createEmpleado, deleteEmpleado, type Empleado, type EmpleadoFormData, getEmpleados, updateEmpleado
} from "@/feature/empleados/service/EmpleadoService.ts";
import {EmpleadosTable} from "@/feature/empleados/components/EmpleadosTable.tsx";
import {EmpleadoForm} from "@/feature/empleados/components/EmpleadoForm.tsx";

// empleados del hotel y su rol (solo ADMIN)
export function EmpleadosScreen() {
    const [empleados, setEmpleados] = useState<Empleado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Empleado | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Empleado | null>(null);
    const [selectedItem, setSelectedItem] = useState<Empleado | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        getEmpleados(controller.signal)
            .then(setEmpleados)
            .catch((e: unknown) => {
                if (!controller.signal.aborted && e instanceof Error && e.name !== 'AbortError') {
                    setError(e.message);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });
        return () => controller.abort();
    }, []);

    const recargar = async () => {
        try {
            setEmpleados(await getEmpleados());
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo cargar");
        }
    };

    // los errores del API los muestra el formulario
    const handleSubmit = async (formData: EmpleadoFormData) => {
        if (editingItem) await updateEmpleado(editingItem.emplId, formData);
        else await createEmpleado(formData);
        setFormOpen(false);
        setEditingItem(null);
        setSelectedItem(null);
        await recargar();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setAviso(null);
        try {
            await deleteEmpleado(deleteTarget.emplId);
            setSelectedItem(null);
            await recargar();
        } catch (e: unknown) {
            // p. ej. intentar eliminar el propio usuario
            setAviso(e instanceof Error ? e.message : "No se pudo eliminar");
        } finally {
            setDeleteTarget(null);
        }
    };

    const openForm = (item: Empleado | null) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const termino = busqueda.trim().toLowerCase();
    const filtrados = termino
        ? empleados.filter(e =>
            e.emplNombre.toLowerCase().includes(termino) || e.emplUsuario.toLowerCase().includes(termino))
        : empleados;
    const {paginatedData, currentPage, totalPages, goToPage} = usePagination(filtrados);

    if (loading)
        return <div className="flex h-full items-center justify-center">Cargando...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                    <Input
                        placeholder="Buscar por nombre o usuario..."
                        value={busqueda}
                        onChange={e => {
                            setBusqueda(e.target.value);
                            goToPage(1);
                        }}
                        className="w-72 pl-8"
                    />
                </div>
                <div className="ml-auto flex gap-2">
                    <Button onClick={() => openForm(null)} className="gap-2">
                        <Plus className="size-4"/>
                        Crear empleado
                    </Button>
                    <Button className="gap-2 bg-green-800" hidden={!selectedItem}
                            onClick={() => selectedItem && openForm(selectedItem)}>
                        <Pencil className="size-4"/>
                        Editar
                    </Button>
                    <Button className="gap-2 bg-red-500" hidden={!selectedItem}
                            onClick={() => setDeleteTarget(selectedItem)}>
                        <Trash2 className="size-4"/>
                        Eliminar
                    </Button>
                </div>
            </div>

            {aviso && <p className="text-sm text-red-600">{aviso}</p>}

            <div className="min-h-0 flex-1">
                <EmpleadosTable data={paginatedData} selectedItem={selectedItem} onSelectionChange={setSelectedItem}/>
            </div>

            <CatalogPaginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}/>

            <CatalogDialog formOpen={formOpen} editingItem={editingItem} setFormOpen={setFormOpen} catalogName="empleado">
                <EmpleadoForm
                    key={editingItem?.emplId ?? "nuevo"}
                    initialData={editingItem}
                    onSubmit={handleSubmit}
                    onCancel={() => setFormOpen(false)}
                />
            </CatalogDialog>

            <CatalogAlert<Empleado>
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                handleDelete={handleDelete}
                catalogName="empleado"
            />
        </div>
    );
}
