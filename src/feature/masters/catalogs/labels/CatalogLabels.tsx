import {useEffect, useState} from "react";
import type {Label, LabelFormData} from "@/feature/masters/types/Label.ts";
import {getLabels, createLabel, updateLabel, deleteLabel} from "@/feature/masters/service/LabelService.ts";
import {LabelsTable} from "@/feature/masters/catalogs/labels/components/LabelsTable.tsx";
import {LabelsForm} from "@/feature/masters/catalogs/labels/components/LabelsForm.tsx";
import {Button} from "@/shared/shadcn/components/ui/button.tsx";
import {Pencil, Plus, Trash2} from "lucide-react";
import {usePagination} from "@/shared/hooks/usePagination.ts";
import {CatalogPaginator} from "@/feature/masters/catalogs/components/CatalogPaginator.tsx";
import {CatalogAlert} from "@/feature/masters/catalogs/components/CatalogAlert.tsx";
import {CatalogDialog} from "@/feature/masters/catalogs/components/CatalogDialog.tsx";

export function CatalogLabels() {
    const [data, setData] = useState<Label[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Label | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Label | null>(null)
    const [selectedItem, setSelectedItem] = useState<Label | null>(null);

    const fetchData = async () => {
        try {
            const result = await getLabels();
            setData(result);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        getLabels(controller.signal)
            .then(result => {
                if (!controller.signal.aborted) setData(result);
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

    const handleCreate = async (formData: LabelFormData) => {
        await createLabel(formData);
        setFormOpen(false);
        await fetchData();
    };

    const handleUpdate = async (formData: LabelFormData) => {
        if (!editingItem) return;
        await updateLabel(editingItem.etiqId, formData);
        setFormOpen(false);
        setEditingItem(null);
        await fetchData();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await deleteLabel(deleteTarget.etiqId);
        setDeleteTarget(null);
        setSelectedItem(null);
        await fetchData();
    };

    const openCreate = () => {
        setEditingItem(null);
        setFormOpen(true);
    };

    const openEdit = (item: Label) => {
        setEditingItem(item);
        setFormOpen(true);
    };

    const {paginatedData, currentPage, totalPages, goToPage} = usePagination(data);

    if (loading)
        return <div className="flex h-full items-center justify-center">Loading...</div>;

    if (error)
        return <div className="flex h-full items-center justify-center text-red-600">{error}</div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <Button onClick={openCreate} className="gap-2">
                    <Plus className="size-4"/>
                    Crear etiqueta
                </Button>
                <Button className="gap-2 bg-green-800 ml-2"
                        hidden={!selectedItem}
                        onClick={() => selectedItem && openEdit(selectedItem)}
                >
                    <Pencil className="size-4"/>
                    Editar
                </Button>
                <Button
                    className="gap-2 bg-red-500 ml-2"
                    hidden={!selectedItem}
                    onClick={() => setDeleteTarget(selectedItem)}
                >
                    <Trash2 className="size-4"/>
                    Eliminar
                </Button>
            </div>

            <div className="min-h-0 flex-1">
                <LabelsTable data={paginatedData}
                             selectedItem={selectedItem}
                             onSelectionChange={setSelectedItem}
                />
            </div>

            <CatalogPaginator
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
            />

            <CatalogDialog
                formOpen={formOpen}
                editingItem={editingItem}
                setFormOpen={setFormOpen}
                catalogName={'etiqueta'}>
                <LabelsForm
                    initialData={editingItem}
                    onSubmit={editingItem ? handleUpdate : handleCreate}
                    onCancel={() => setFormOpen(false)}
                />
            </CatalogDialog>

            <CatalogAlert<Label>
                deleteTarget={deleteTarget}
                setDeleteTarget={setDeleteTarget}
                handleDelete={handleDelete}
                catalogName={'etiqueta'}
            />
        </div>
    );
}
