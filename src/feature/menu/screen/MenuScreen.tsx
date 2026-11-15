import {useEffect, useState} from "react";
import {Pencil, Plus, Search, Trash2} from "lucide-react";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Input} from "@/shared/shadcn/components/ui/input.tsx";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {CatalogPaginator} from "@/feature/masters/catalogs/components/CatalogPaginator.tsx";
import {CatalogAlert} from "@/feature/masters/catalogs/components/CatalogAlert.tsx";
import {CatalogDialog} from "@/feature/masters/catalogs/components/CatalogDialog.tsx";
import {getCategories} from "@/feature/masters/service/CategoryService.ts";
import {getLabels} from "@/feature/masters/service/LabelService.ts";
import type {Category} from "@/feature/masters/types/Category.ts";
import type {Label} from "@/feature/masters/types/Label.ts";
import {createItem, deleteItem, getItems, type Item, type ItemFormData, updateItem} from "@/feature/menu/service/ItemService.ts";
import {ItemsTable} from "@/feature/menu/components/ItemsTable.tsx";
import {ItemForm} from "@/feature/menu/components/ItemForm.tsx";

// maestro de ítems del menú (platos y bebidas que ve el huésped en la app)
export function MenuScreen() {
    const [items, setItems] = useState<Item[]>([]);
    const [categorias, setCategorias] = useState<Category[]>([]);
    const [etiquetas, setEtiquetas] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        Promise.all([getItems(controller.signal), getCategories(controller.signal), getLabels(controller.signal)])
            .then(([items, categorias, etiquetas]) => {
                if (controller.signal.aborted) return;
                setItems(items);
                setCategorias(categorias);
                setEtiquetas(etiquetas);
            })
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
            setItems(await getItems());
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "No se pudo cargar");
        }
    };

    // los errores del API los muestra el formulario
    const handleSubmit = async (formData: ItemFormData) => {
        if (editingItem) await updateItem(editingItem.meitId, formData);
        else await createItem(formData);
        setFormOpen(false);
        setEditingItem(null);
        setSelectedItem(null);
        await recargar();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteItem(deleteTarget.meitId);
        setDeleteTarget(null);
        setSelectedItem(null);
        await recargar();
    };

    const openForm = (item: Item | null) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const termino = busqueda.trim().toLowerCase();
    const filtrados = termino
        ? items.filter(i => i.meitNombre.toLowerCase().includes(termino))
        : items;
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
                        placeholder="Buscar por nombre..."
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
                        Crear ítem
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

            <div className="min-h-0 flex-1">
                <ItemsTable data={paginatedData} selectedItem={selectedItem} onSelectionChange={setSelectedItem}/>
            </div>

            <CatalogPaginator currentPage={currentPage} totalPages={totalPages} goToPage={goToPage}/>

            <CatalogDialog formOpen={formOpen} editingItem={editingItem} setFormOpen={setFormOpen} catalogName="ítem">
                <ItemForm
                    key={editingItem?.meitId ?? "nuevo"}
                    initialData={editingItem}
                    categorias={categorias}
                    etiquetas={etiquetas}
                    onSubmit={handleSubmit}
                    onCancel={() => setFormOpen(false)}
                />
            </CatalogDialog>

            <CatalogAlert<Item>
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                handleDelete={handleDelete}
                catalogName="ítem"
            />
        </div>
    );
}
